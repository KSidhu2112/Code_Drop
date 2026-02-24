const express = require('express');
const router = express.Router();
const {
    registerUser,
    verifyUserEmail,
    loginUser,
    forgotUserPassword,
    resetUserPassword,
    getAllUsers,
    deleteUser
} = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/verify', verifyUserEmail);
router.post('/login', loginUser);
router.post('/forgot-password', forgotUserPassword);
router.post('/reset-password', resetUserPassword);
router.get('/', getAllUsers);
router.delete('/:id', deleteUser);

module.exports = router;
