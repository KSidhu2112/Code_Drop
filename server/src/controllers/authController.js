const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Admin = require('../models/Admin');
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

// @desc    Register a new admin
// @route   POST /api/admin/register
// @access  Public
const registerAdmin = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const adminExists = await Admin.findOne({ email });

        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists with this email' });
        }

        const otp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        const admin = await Admin.create({
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
                email: admin.email,
                subject: 'Verify your email - Admin Panel',
                message,
                html: `<h3>Your verify OTP: <b>${otp}</b></h3>` // Simple HTML
            });

            res.status(201).json({
                message: 'Admin registered. Please verify your email with the OTP sent.',
                email: admin.email,
            });
        } catch (error) {
            console.error(error);
            // Delete user if email fails? Maybe keep but allow resend?
            // For simplicity, keep user but they can't login without verify.
            res.status(500).json({ message: 'Email could not be sent' });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify OTP for registration
// @route   POST /api/admin/verify
// @access  Public
const verifyEmail = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(400).json({ message: 'Invalid email' });
        }

        if (admin.isVerified) {
            return res.status(400).json({ message: 'Email already verified' });
        }

        if (admin.otp !== otp || admin.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        admin.isVerified = true;
        admin.otp = undefined;
        admin.otpExpires = undefined;
        await admin.save();

        res.json({
            success: true,
            message: 'Email verified successfully. You can now login.',
            token: generateToken(admin._id),
            username: admin.username,
            _id: admin._id
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth admin & get token
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
    const { email, password } = req.body; // Changed from username to email usually safer, or check both

    try {
        // Find by email or username
        const admin = await Admin.findOne({
            $or: [{ email: email }, { username: email }]
        });

        if (admin && (await admin.matchPassword(password))) {
            // Check if verified
            if (!admin.isVerified) {
                // Resend OTP logic could be here, but for now just block
                // Or generate new OTP and prompt verification?
                // Let's allow login but warn? No, usually block.
                // But for "register flow", we just did verify.
                // Let's strict check.
                return res.status(401).json({ message: 'Please verify your email first.' });
            }

            res.json({
                _id: admin._id,
                username: admin.username,
                email: admin.email,
                token: generateToken(admin._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Forgot Password - Send OTP
// @route   POST /api/admin/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000;

        admin.otp = otp;
        admin.otpExpires = otpExpires;
        await admin.save();

        const message = `Your OTP for password reset is: ${otp}`;

        try {
            await sendEmail({
                email: admin.email,
                subject: 'Password Reset OTP',
                message,
                html: `<h3>Your Password Reset OTP: <b>${otp}</b></h3>`
            });

            res.json({ message: 'OTP sent to email' });
        } catch (error) {
            admin.otp = undefined;
            admin.otpExpires = undefined;
            await admin.save();
            res.status(500).json({ message: 'Email could not be sent' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset Password with OTP
// @route   POST /api/admin/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    const { email, otp, password } = req.body;

    try {
        const admin = await Admin.findOne({
            email,
            otp,
            otpExpires: { $gt: Date.now() }
        });

        if (!admin) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        admin.password = password; // Will be hashed by pre-save hook
        admin.otp = undefined;
        admin.otpExpires = undefined;
        await admin.save();

        res.json({ message: 'Password reset successful. You can login now.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    loginAdmin,
    registerAdmin,
    verifyEmail,
    forgotPassword,
    resetPassword
};
