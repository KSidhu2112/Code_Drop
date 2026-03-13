const express = require('express');
const router = express.Router();
const {
    registerUser,
    verifyUserEmail,
    resendOtp,
    loginUser,
    forgotUserPassword,
    resetUserPassword,
    getAllUsers,
    deleteUser
} = require('../controllers/userController');

const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/verify', verifyUserEmail);
router.post('/resend-otp', resendOtp);
router.post('/login', loginUser);
router.post('/forgot-password', forgotUserPassword);
router.post('/reset-password', resetUserPassword);
router.get('/', protect, adminOnly, getAllUsers);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;
