const express = require('express');
const router = express.Router();
const {
    getNotifications,
    getUnreadCount,
    markAsRead
} = require('../controllers/notificationController');

// Public routes
router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/mark-read', markAsRead);

module.exports = router;
