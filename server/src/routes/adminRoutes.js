const express = require('express');
const router = express.Router();
const {
    loginAdmin,
    registerAdmin,
    verifyEmail,
    forgotPassword,
    resetPassword
} = require('../controllers/authController');

router.post('/login', loginAdmin);
router.post('/register', registerAdmin);
router.post('/verify', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
