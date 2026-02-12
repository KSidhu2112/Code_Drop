
import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaCog, FaSave, FaArrowLeft, FaInfoCircle, FaSignOutAlt, FaPhoneAlt } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const Profile = () => {
    const [user, setUser] = useState(null);
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('details');
    const [formData, setFormData] = useState({
        username: '',
        email: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state && location.state.activeTab) {
            setActiveTab(location.state.activeTab);
        }
    }, [location]);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const parsedUser = JSON.parse(userInfo);
            setUser(parsedUser);
            setFormData({
                username: parsedUser.username || '',
                email: parsedUser.email || ''
            });
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically make an API call to update user info
        // For now, we'll just update localStorage to simulate it
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
        setUser(updatedUser);
        toast.success('Profile updated successfully!');
    };

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 font-outfit">My Profile</h1>
                        <p className="mt-2 text-gray-600">Manage your account settings and preferences.</p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                        <FaArrowLeft className="mr-2" /> Back to Home
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="flex flex-col md:flex-row min-h-[500px]">
                        {/* Sidebar / Tabs */}
                        <div className="w-full md:w-64 bg-gray-50 border-r border-gray-100 p-6">
                            <div className="flex flex-col space-y-2">
                                <button
                                    onClick={() => setActiveTab('details')}
                                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'details'
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <FaUser className="mr-3" />
                                    Account Details
                                </button>
                                <button
                                    onClick={() => setActiveTab('settings')}
                                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'settings'
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <FaCog className="mr-3" />
                                    Settings
                                </button>

                                <div className="pt-4 mt-4 border-t border-gray-100 space-y-2">
                                    <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Support & Links</p>
                                    <button
                                        onClick={() => navigate('/contact-us')}
                                        className="w-full flex items-center px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all duration-200"
                                    >
                                        <FaPhoneAlt className="mr-3 text-indigo-400" />
                                        Contact Us
                                    </button>
                                    <button
                                        onClick={() => navigate('/about-me')}
                                        className="w-full flex items-center px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all duration-200"
                                    >
                                        <FaInfoCircle className="mr-3 text-purple-400" />
                                        About Me
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 mt-4 group"
                                    >
                                        <FaSignOutAlt className="mr-3 text-red-400 group-hover:text-red-600 transition-colors" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-8">
                            {activeTab === 'details' ? (
                                <div className="space-y-6 animate-fade-in">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Account Information</h2>

                                    <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                                        <div className="flex items-center space-x-4 mb-6">
                                            <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-2xl">
                                                <FaUser />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">{user.username}</h3>
                                                <span className="text-sm font-medium text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                                                    Member
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-6">
                                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Username</label>
                                                <div className="mt-1 flex items-center text-gray-900 font-medium">
                                                    <FaUser className="text-gray-400 mr-3" />
                                                    {user.username}
                                                </div>
                                            </div>

                                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</label>
                                                <div className="mt-1 flex items-center text-gray-900 font-medium">
                                                    <FaEnvelope className="text-gray-400 mr-3" />
                                                    {user.email || 'No email provided'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-fade-in">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Edit Profile</h2>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Username
                                            </label>
                                            <div className="relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FaUser className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="username"
                                                    value={formData.username}
                                                    onChange={handleInputChange}
                                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-3 border"
                                                    placeholder="Enter your username"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address
                                            </label>
                                            <div className="relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FaEnvelope className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-3 border"
                                                    placeholder="Enter your email"
                                                />
                                            </div>
                                            <p className="mt-2 text-sm text-gray-500">
                                                Note: Changing your email might require re-verification.
                                            </p>
                                        </div>

                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                className="flex items-center justify-center w-full px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                            >
                                                <FaSave className="mr-2" />
                                                Save Changes
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
