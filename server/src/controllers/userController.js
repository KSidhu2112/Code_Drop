const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

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

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const otp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        const user = await User.create({
            username,
            email,
            password,
            otp,
            otpExpires,
            isVerified: false // Not verified yet
        });

        // Send OTP email
        const message = `Your OTP for registration is: ${otp}`;
        try {
            await sendEmail({
                email: user.email,
                subject: 'Verify your email - CodeDrop',
                message,
                html: `<h3>Your verify OTP: <b>${otp}</b></h3>` // Simple HTML
            });

            res.status(201).json({
                message: 'User registered. Please verify your email with the OTP sent.',
                email: user.email,
            });
        } catch (error) {
            console.error(error);
            // In a production application, you might want to rollback user creation here.
            res.status(500).json({ message: 'Email could not be sent' });
        }

    } catch (error) {
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

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find by email or username (optional, stick to email for now)
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            // Check if verified
            if (!user.isVerified) {
                return res.status(401).json({ message: 'Please verify your email first.' });
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
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000;

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        const message = `Your OTP for password reset is: ${otp}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset OTP - CodeDrop',
                message,
                html: `<h3>Your Password Reset OTP: <b>${otp}</b></h3>`
            });

            res.json({ message: 'OTP sent to email' });
        } catch (error) {
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();
            res.status(500).json({ message: 'Email could not be sent' });
        }
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

module.exports = {
    registerUser,
    verifyUserEmail,
    loginUser,
    forgotUserPassword,
    resetUserPassword
};
