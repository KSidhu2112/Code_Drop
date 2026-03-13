import { useState, useEffect, useCallback } from 'react';
import api from '../config/api';
import { FaEnvelope, FaTrash, FaCheck, FaReply, FaClock, FaUser, FaInfoCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');

    const fetchMessages = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/contact', {
                params: {
                    status: filterStatus !== 'all' ? filterStatus : undefined
                }
            });
            setMessages(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching messages:', error);
            const message = error.response?.data?.message || 'Failed to fetch messages';
            toast.error(message);
            setLoading(false);
        }
    }, [filterStatus]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            try {
                await api.delete(`/contact/${id}`);
                toast.success('Message deleted');
                fetchMessages();
                if (selectedMessage && selectedMessage._id === id) {
                    setSelectedMessage(null);
                }
            } catch {
                toast.error('Failed to delete message');
            }
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.put(`/contact/${id}`, { status });
            toast.success(`Message marked as ${status}`);
            fetchMessages();
            if (selectedMessage && selectedMessage._id === id) {
                setSelectedMessage({ ...selectedMessage, status });
            }
        } catch {
            toast.error('Failed to update status');
        }
    };

    const handleSelectMessage = async (message) => {
        setSelectedMessage(message);
        if (message.status === 'unread') {
            handleUpdateStatus(message._id, 'read');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Contact Messages</h1>
                    <p className="text-gray-500">Manage inquiries from your users</p>
                </div>
                <div className="flex gap-2">
                    {['all', 'unread', 'read', 'replied'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterStatus === status
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                }`}
                        >
                            {status.charAt(0) + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
                {/* List View */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <span className="font-semibold text-gray-700">Messages ({messages.length})</span>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="flex justify-center items-center h-40">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="text-center py-10 px-4">
                                <FaEnvelope className="mx-auto text-gray-200 text-4xl mb-3" />
                                <p className="text-gray-400">No messages found</p>
                            </div>
                        ) : (
                            messages.map((message) => (
                                <div
                                    key={message._id}
                                    onClick={() => handleSelectMessage(message)}
                                    className={`p-4 border-b border-gray-50 cursor-pointer transition relative hover:bg-indigo-50/30 ${selectedMessage?._id === message._id ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''
                                        }`}
                                >
                                    {message.status === 'unread' && (
                                        <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
                                    )}
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-gray-800 truncate pr-6">{message.name}</h3>
                                        <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                            {new Date(message.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 font-medium truncate mb-1">{message.subject}</p>
                                    <p className="text-xs text-gray-400 line-clamp-2">{message.message}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Detail View */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                    {selectedMessage ? (
                        <>
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center text-gray-800">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                        <FaUser size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">{selectedMessage.name}</h2>
                                        <p className="text-sm text-gray-500">{selectedMessage.email}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleUpdateStatus(selectedMessage._id, selectedMessage.status === 'replied' ? 'read' : 'replied')}
                                        className={`p-2 rounded-lg transition ${selectedMessage.status === 'replied' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                        title="Mark as Replied"
                                    >
                                        <FaReply />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(selectedMessage._id)}
                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                                        title="Delete Message"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 p-8 overflow-y-auto space-y-8">
                                <div>
                                    <div className="flex items-center gap-2 text-indigo-600 mb-2">
                                        <FaInfoCircle />
                                        <span className="text-sm font-bold uppercase tracking-wider">Inquiry Details</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{selectedMessage.subject}</h3>
                                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                            {selectedMessage.message}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Status</p>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${selectedMessage.status === 'unread' ? 'bg-indigo-100 text-indigo-600' :
                                                selectedMessage.status === 'read' ? 'bg-blue-100 text-blue-600' :
                                                    'bg-green-100 text-green-600'
                                                }`}>
                                                {selectedMessage.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Date</p>
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <FaClock size={12} className="text-gray-400" />
                                            <span className="text-sm font-medium">
                                                {new Date(selectedMessage.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100">
                                    <h4 className="font-bold text-gray-800 mb-4">Quick Reply</h4>
                                    <p className="text-sm text-gray-500 mb-4">Click below to open your email client and reply to this user.</p>
                                    <a
                                        href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                                    >
                                        <FaEnvelope />
                                        Reply via Email
                                    </a>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col justify-center items-center text-gray-300 p-10">
                            <FaEnvelope size={64} className="mb-4 opacity-20" />
                            <p className="text-xl font-medium">Select a message to view details</p>
                            <p className="text-sm">Inquiries from your users will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;
