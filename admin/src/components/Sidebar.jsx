import { useContext, useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaHome, FaPlus, FaSignOutAlt, FaList, FaUser, FaCog } from 'react-icons/fa';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const isActive = (path) => location.pathname === path;

    return (
        <div className="bg-gray-900 text-white w-64 min-h-screen flex flex-col fixed left-0 top-0">
            <div className="p-6 border-b border-gray-800">
                <h2 className="text-2xl font-bold tracking-wider text-indigo-400">AdminPanel</h2>
            </div>
            <nav className="flex-grow p-6 space-y-2">
                <Link to="/" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive('/') ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                    <FaList />
                    <span>All Posts</span>
                </Link>
                <Link to="/add-post" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive('/add-post') ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                    <FaPlus />
                    <span>Add New Post</span>
                </Link>
            </nav>
            <div className="p-6 border-t border-gray-800 relative" ref={dropdownRef}>
                {user && (
                    <div className="w-full">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 focus:outline-none group"
                        >
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                                <FaUser size={14} />
                            </div>
                            <div className="flex-1 text-left overflow-hidden">
                                <p className="text-sm font-medium text-white truncate">{user.username}</p>
                                <p className="text-xs text-gray-500 truncate">Admin</p>
                            </div>
                            <FaCog className={`text-gray-500 transition-transform duration-200 group-hover:text-indigo-400 ${isDropdownOpen ? 'rotate-90' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute bottom-full left-0 mx-4 mb-2 w-56 bg-gray-800 rounded-xl shadow-xl border border-gray-700 py-2 z-50 animate-fade-in-up origin-bottom-left">
                                <div className="px-4 py-3 border-b border-gray-700">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Signed in as</p>
                                    <p className="text-sm font-bold text-white truncate">{user.username}</p>
                                </div>

                                <div className="py-1">
                                    <Link
                                        to="/profile"
                                        state={{ activeTab: 'details' }}
                                        onClick={() => setIsDropdownOpen(false)}
                                        className="group flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                    >
                                        <FaUser className="mr-3 text-gray-500 group-hover:text-indigo-400 transition-colors" />
                                        Account Details
                                    </Link>

                                    <Link
                                        to="/profile"
                                        state={{ activeTab: 'settings' }}
                                        onClick={() => setIsDropdownOpen(false)}
                                        className="group flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                    >
                                        <FaCog className="mr-3 text-gray-500 group-hover:text-indigo-400 transition-colors" />
                                        Settings
                                    </Link>
                                </div>

                                <div className="border-t border-gray-700 pt-1 pb-1">
                                    <button
                                        onClick={logout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 transition-colors flex items-center group"
                                    >
                                        <FaSignOutAlt className="mr-3 group-hover:text-red-500 transition-colors" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {!user && (
                    <button onClick={logout} className="flex items-center space-x-3 text-gray-400 hover:text-red-400 transition w-full">
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
