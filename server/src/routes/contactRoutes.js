const express = require('express');
const router = express.Router();
const {
    submitContactForm,
    getAllContacts,
    getContactById,
    updateContact,
    deleteContact
} = require('../controllers/contactController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Public route - Submit contact form
router.post('/', submitContactForm);

// Admin routes - Manage contact messages
router.get('/', protect, getAllContacts);
router.get('/:id', protect, getContactById);
router.put('/:id', protect, updateContact);
router.delete('/:id', protect, deleteContact);

module.exports = router;
