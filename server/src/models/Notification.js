const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['NEW_POST'],
        default: 'NEW_POST'
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    postSlug: {
        type: String,
        required: true
    },
    postType: {
        type: String,
        enum: ['DSA', 'FULLSTACK', 'CONTEST'],
        required: true
    },
    readBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
