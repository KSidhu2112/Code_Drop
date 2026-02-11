
import React, { useState, useEffect, useContext } from 'react';
import { FaUser, FaEnvelope, FaCog, FaSave } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, login } = useContext(AuthContext); // user from context might not update immediately if we just change local state, so we might need a way to update context or just rely on local state for the form
    // Actually, updating the context user would be better. For now, let's stick to the pattern used in the client app.

    // We'll use local state for the form display and editing, initialized from context or localStorage
    const [localUser, setLocalUser] = useState(user);
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('details');
    const [formData, setFormData] = useState({
        username: '',
        email: ''
    });

    useEffect(() => {
        if (location.state && location.state.activeTab) {
            setActiveTab(location.state.activeTab);
        }
    }, [location]);

    useEffect(() => {
        if (user) {
            setLocalUser(user);
            setFormData({
                username: user.username || '',
                email: user.email || ''
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock update - in a real app, this would be an API call
        const updatedUser = { ...localUser, ...formData };

        // Update localStorage to persist
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));

        // We might need to refresh the page or have a setUser in context to see changes strictly, 
        // but for now let's just update local state to reflect the change immediately in the UI
        setLocalUser(updatedUser);
        toast.success('Profile updated successfully!');

        // Note: The Sidebar might not update until a refresh because it reads from Context which reads from localStorage on mount/login.
        // Implementing a proper setUser in context would be better, but avoiding changing context API for now unless necessary.
        // A reload would fix it:
        window.location.reload();
    };

    if (!localUser) return <div>Loading...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[calc(100vh-4rem)]">
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800">Admin Profile</h1>
                <p className="text-gray-500 mt-1">Manage your administrator account settings</p>
            </div>

            <div className="flex flex-col md:flex-row h-full">
                {/* Sidebar / Tabs */}
                <div className="w-full md:w-64 border-r border-gray-200 p-6 bg-gray-50/50">
                    <div className="space-y-2">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === 'details'
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <FaUser className="mr-3" />
                            Account Details
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === 'settings'
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <FaCog className="mr-3" />
                            Settings
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-8">
                    {activeTab === 'details' ? (
                        <div className="max-w-2xl animate-fade-in">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">Profile Information</h2>

                            <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100 mb-8">
                                <div className="flex items-center space-x-4">
                                    <div className="h-20 w-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-3xl border-2 border-indigo-200">
                                        <FaUser />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">{localUser.username}</h3>
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Administrator
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Username</label>
                                    <div className="flex items-center text-gray-900 font-medium text-lg">
                                        <FaUser className="text-gray-400 mr-3" />
                                        {localUser.username}
                                    </div>
                                </div>

                                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Email Address</label>
                                    <div className="flex items-center text-gray-900 font-medium text-lg">
                                        <FaEnvelope className="text-gray-400 mr-3" />
                                        {localUser.email || 'No email provided'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-2xl animate-fade-in">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">Edit Profile</h2>

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
                                        Note: This email is used for login and notifications.
                                    </p>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="flex items-center justify-center w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-md"
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
    );
};

export default Profile;
