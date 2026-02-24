import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell, FaCode, FaLaptopCode, FaTrophy, FaTimes } from 'react-icons/fa';
import api from '../config/api';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);
    const bellRef = useRef(null);
    const navigate = useNavigate();

    // Get user info from localStorage
    const getUserId = () => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const parsed = JSON.parse(userInfo);
            return parsed._id || parsed.id;
        }
        return null;
    };

    // Fetch unread count
    const fetchUnreadCount = async () => {
        try {
            const userId = getUserId();
            const params = {};

            if (userId) {
                params.userId = userId;
            } else {
                // For anonymous users, use lastChecked from localStorage
                const lastChecked = localStorage.getItem('notif_last_checked');
                if (lastChecked) {
                    params.lastChecked = lastChecked;
                }
            }

            const response = await api.get('/notifications/unread-count', { params });
            setUnreadCount(response.data.count);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    // Fetch notifications
    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const userId = getUserId();
            const params = { unreadOnly: 'true' };

            if (userId) {
                params.userId = userId;
            } else {
                const lastChecked = localStorage.getItem('notif_last_checked');
                if (lastChecked) {
                    params.lastChecked = lastChecked;
                }
            }

            const response = await api.get('/notifications', { params });
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    // Mark all as read
    const markAllAsRead = async () => {
        try {
            const userId = getUserId();

            if (userId) {
                // If we have specific notifications in the list (which are unread), mark only those
                if (notifications.length > 0) {
                    const notificationIds = notifications.map(n => n._id);
                    await api.put('/notifications/mark-read', { userId, notificationIds });
                } else {
                    // Fallback to mark all
                    await api.put('/notifications/mark-read', { userId });
                }
            } else {
                // For anonymous users, store the timestamp
                localStorage.setItem('notif_last_checked', new Date().toISOString());
            }

            setUnreadCount(0);
            // Clear the list because we only show unread, and now they are read
            setNotifications([]);
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };

    // Poll for unread count every 30 seconds
    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                bellRef.current &&
                !bellRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // When dropdown opens, fetch notifications
    const handleToggle = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        if (newState) {
            fetchNotifications();
        }
    };

    const getPostTypeIcon = (type) => {
        switch (type) {
            case 'DSA': return <FaCode className="text-blue-500" />;
            case 'FULLSTACK': return <FaLaptopCode className="text-green-500" />;
            case 'CONTEST': return <FaTrophy className="text-amber-500" />;
            default: return <FaCode className="text-indigo-500" />;
        }
    };

    const getPostTypeBg = (type) => {
        switch (type) {
            case 'DSA': return 'bg-blue-50 border-blue-100';
            case 'FULLSTACK': return 'bg-green-50 border-green-100';
            case 'CONTEST': return 'bg-amber-50 border-amber-100';
            default: return 'bg-indigo-50 border-indigo-100';
        }
    };

    const timeAgo = (dateStr) => {
        const now = new Date();
        const date = new Date(dateStr);
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="relative">
            {/* Bell Icon Button */}
            <button
                ref={bellRef}
                onClick={handleToggle}
                className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors duration-200 focus:outline-none group"
                aria-label="Notifications"
                id="notification-bell"
            >
                <FaBell size={18} className="group-hover:animate-wiggle" />

                {/* Unread Badge */}
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg shadow-red-500/30 animate-notification-pop border-2 border-white">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Dropdown */}
            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fade-in-down origin-top-right"
                    style={{ maxHeight: '480px' }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <FaBell className="text-indigo-600" size={16} />
                            <h3 className="font-bold text-gray-900 font-outfit text-lg">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="px-2 py-0.5 text-xs font-bold bg-indigo-100 text-indigo-700 rounded-full">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                                >
                                    Mark all read
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                            >
                                <FaTimes size={12} />
                            </button>
                        </div>
                    </div>

                    {/* Notification List */}
                    <div className="overflow-y-auto" style={{ maxHeight: '380px' }}>
                        {loading ? (
                            <div className="p-6 space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex gap-3 animate-pulse">
                                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex-shrink-0"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                                            <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-10 text-center">
                                <div className="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <FaBell className="text-gray-300" size={24} />
                                </div>
                                <p className="text-gray-500 font-medium">No new notifications</p>
                                <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
                            </div>
                        ) : (
                            <div>
                                {notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            // Close dropdown immediately for responsiveness
                                            setIsOpen(false);

                                            // Navigate immediately to feel fast
                                            navigate(`/post/${notification.postSlug}`);

                                            // Process the read status in background
                                            try {
                                                const userId = getUserId();
                                                if (userId) {
                                                    // Fire and forget, or at least don't block navigation
                                                    await api.put('/notifications/mark-read', { userId, notificationIds: [notification._id] });
                                                }
                                                // Update local state to remove this notification
                                                setNotifications(prev => prev.filter(n => n._id !== notification._id));
                                                setUnreadCount(prev => Math.max(0, prev - 1));
                                            } catch (err) {
                                                console.error("Error marking read", err);
                                            }
                                        }}
                                        className={`flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition-all duration-200 border-b border-gray-50 group cursor-pointer ${!notification.isRead ? 'bg-indigo-50/40' : ''
                                            }`}
                                    >
                                        {/* Icon */}
                                        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border ${getPostTypeBg(notification.postType)} group-hover:scale-110 transition-transform`}>
                                            {getPostTypeIcon(notification.postType)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                                                    {notification.title}
                                                </span>
                                                {!notification.isRead && (
                                                    <span className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 animate-pulse"></span>
                                                )}
                                            </div>
                                            <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-indigo-600 transition-colors">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {timeAgo(notification.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
