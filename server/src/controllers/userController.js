const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const { getOtpEmailTemplate } = require('../utils/emailTemplates');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
};

// Helper: send OTP email with fallback logging
const sendOtpEmail = async ({ email, username, otp, type }) => {
    const subject = type === 'verify'
        ? 'Verify your email - CodeDrop'
        : 'Password Reset OTP - CodeDrop';

    const plainText = type === 'verify'
        ? `Your email verification OTP is: ${otp}. It expires in 10 minutes.`
        : `Your password reset OTP is: ${otp}. It expires in 10 minutes.`;

    const html = getOtpEmailTemplate(otp, type, username);

    try {
        await sendEmail({ email, subject, message: plainText, html });
        return { success: true };
    } catch (error) {
        console.error('📧 Email Error:', error.message);
        console.log('--- DEVELOPMENT OTP ---');
        console.log(`📧 Email: ${email}`);
        console.log(`🔑 OTP: ${otp}`);
        console.log(`📋 Type: ${type}`);
        console.log('-----------------------');
        return { success: false, devMode: true };
    }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email and password are required.' });
    }

    try {
        // Check if email already exists and is verified
        let user = await User.findOne({ email });
        if (user && user.isVerified) {
            return res.status(400).json({ message: 'An account with this email already exists. Please login.' });
        }

        // Check if username is already taken by any OTHER verified user
        const takenByOther = await User.findOne({ username, isVerified: true, email: { $ne: email } });
        if (takenByOther) {
            return res.status(400).json({ message: 'This username is already taken. Please choose another.' });
        }

        const otp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        if (user) {
            // Update existing unverified user
            user.username = username;
            user.password = password;
            user.otp = otp;
            user.otpExpires = otpExpires;
            await user.save();
        } else {
            // Create new user
            user = await User.create({
                username,
                email,
                password,
                otp,
                otpExpires,
                isVerified: false
            });
        }

        const emailResult = await sendOtpEmail({
            email: user.email,
            username: user.username,
            otp,
            type: 'verify'
        });

        res.status(201).json({
            message: emailResult.devMode
                ? 'User registered. (Email delivery failed, check server console for OTP)'
                : 'User registered. Please verify your email with the OTP sent.',
            email: user.email,
            devMode: emailResult.devMode || false
        });

    } catch (error) {
        console.error('Register error:', error.message);
        // MongoDB duplicate key — return 400 with a friendly message instead of 500
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern || {})[0];
            if (field === 'email') return res.status(400).json({ message: 'An account with this email already exists.' });
            if (field === 'username') return res.status(400).json({ message: 'This username is already taken. Please choose another.' });
            return res.status(400).json({ message: 'A duplicate value was detected. Please try again with different details.' });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify OTP for registration
// @route   POST /api/users/verify
// @access  Public
const verifyUserEmail = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Email already verified' });
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({
            success: true,
            message: 'Email verified successfully. You can now login.',
            token: generateToken(user._id),
            username: user.username,
            _id: user._id
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Resend OTP for email verification
// @route   POST /api/users/resend-otp
// @access  Public
const resendOtp = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'No account found with this email' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Email is already verified. Please login.' });
        }

        const otp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000;

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        const emailResult = await sendOtpEmail({
            email: user.email,
            username: user.username,
            otp,
            type: 'verify'
        });

        res.json({
            message: emailResult.devMode
                ? 'OTP resent. (Email delivery failed, check server console for OTP)'
                : 'A new OTP has been sent to your email.',
            devMode: emailResult.devMode || false
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            if (!user.isVerified) {
                return res.status(401).json({
                    message: 'Please verify your email first.',
                    needsVerification: true,
                    email: user.email
                });
            }

            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Forgot Password - Send OTP
// @route   POST /api/users/forgot-password
// @access  Public
const forgotUserPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'No account found with this email' });
        }

        const otp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000;

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        const emailResult = await sendOtpEmail({
            email: user.email,
            username: user.username,
            otp,
            type: 'reset'
        });

        res.json({
            message: emailResult.devMode
                ? 'OTP sent to email. (Email delivery failed, check server console for OTP)'
                : 'OTP sent to your email successfully.',
            devMode: emailResult.devMode || false
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset Password with OTP
// @route   POST /api/users/reset-password
// @access  Public
const resetUserPassword = async (req, res) => {
    const { email, otp, password } = req.body;

    try {
        const user = await User.findOne({
            email,
            otp,
            otpExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.password = password; // Will be hashed by pre-save hook
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({ message: 'Password reset successful. You can login now.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    verifyUserEmail,
    resendOtp,
    loginUser,
    forgotUserPassword,
    resetUserPassword,
    getAllUsers,
    deleteUser
};
