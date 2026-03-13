const mongoose = require('mongoose');
const Notification = require('../models/Notification');

// @desc    Get all notifications (with read status for the current user)
// @route   GET /api/notifications
// @access  Public (unread count logic works for both logged-in and anonymous users)
const getNotifications = async (req, res) => {
    try {
        const { userId, unreadOnly, lastChecked } = req.query;
        let query = {};

        if (unreadOnly === 'true') {
            if (userId) {
                // Use $nin to exclude notifications where readBy array contains userId
                // Explicitly cast to ObjectId
                const userObjectId = new mongoose.Types.ObjectId(userId);
                query.readBy = { $nin: [userObjectId] };
            } else if (lastChecked) {
                query.createdAt = { $gt: new Date(lastChecked) };
            }
        }

        // Get the last 20 notifications, newest first
        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

        const notificationsWithReadStatus = notifications.map(notification => ({
            ...notification,
            isRead: userId ? notification.readBy.some(id => id.toString() === userId) : false
        }));

        // Remove readBy array from response (no need to send it to client)
        const sanitized = notificationsWithReadStatus.map(({ readBy, ...rest }) => rest);

        res.json(sanitized);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get unread notification count for user
// @route   GET /api/notifications/unread-count
// @access  Public
const getUnreadCount = async (req, res) => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            // For anonymous users, count notifications from last 7 days
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            // Check localStorage timestamp approach — return all recent ones
            const lastChecked = req.query.lastChecked;
            const query = lastChecked
                ? { createdAt: { $gt: new Date(lastChecked) } }
                : { createdAt: { $gt: sevenDaysAgo } };

            const count = await Notification.countDocuments(query);
            return res.json({ count });
        }

        // For logged-in users, count notifications they haven't read
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const count = await Notification.countDocuments({
            readBy: { $nin: [userObjectId] }
        });

        res.json({ count });
    } catch (error) {
        console.error('Error fetching unread count:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Mark notifications as read
// @route   PUT /api/notifications/mark-read
// @access  Public
const markAsRead = async (req, res) => {
    try {
        const { userId, notificationIds } = req.body;

        if (userId) {
            const userObjectId = new mongoose.Types.ObjectId(userId);

            if (notificationIds && notificationIds.length > 0) {
                // Mark specific notifications as read for this user
                const objectIds = notificationIds.map(id => new mongoose.Types.ObjectId(id));
                await Notification.updateMany(
                    { _id: { $in: objectIds } },
                    { $addToSet: { readBy: userObjectId } }
                );
            } else {
                // Mark all unread notifications as read for this user
                await Notification.updateMany(
                    { readBy: { $nin: [userObjectId] } },
                    { $addToSet: { readBy: userObjectId } }
                );
            }
        }

        res.json({ message: 'Notifications marked as read' });
    } catch (error) {
        console.error('Error marking notifications as read:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getNotifications,
    getUnreadCount,
    markAsRead
};
