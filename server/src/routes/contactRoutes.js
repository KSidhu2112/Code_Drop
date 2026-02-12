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
router.get('/', protect, adminOnly, getAllContacts);
router.get('/:id', protect, adminOnly, getContactById);
router.put('/:id', protect, adminOnly, updateContact);
router.delete('/:id', protect, adminOnly, deleteContact);

module.exports = router;
