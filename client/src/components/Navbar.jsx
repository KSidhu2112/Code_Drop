import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { FaBars, FaTimes, FaCode, FaLaptopCode, FaRocket, FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const [user, setUser] = useState(null);
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

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
    }, [location]); // Re-check on route change

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
        window.location.href = '/login';
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed top-0 left-0 w-full z-50 glass-effect transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex items-center space-x-2">
                        <Link to="/" className="flex-shrink-0 flex items-center group">
                            <div className="bg-indigo-600 text-white p-2 rounded-lg mr-2 transform group-hover:rotate-12 transition duration-300">
                                <FaRocket size={20} />
                            </div>
                            <span className="font-outfit font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                                CodeDrop
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <NavLink to="/" isActive={isActive('/')}>Home</NavLink>
                        <NavLink to="/dsa" isActive={isActive('/dsa')} icon={<FaCode />}>DSA</NavLink>
                        <NavLink to="/full-stack" isActive={isActive('/full-stack')} icon={<FaLaptopCode />}>Full Stack</NavLink>

                        {user ? (
                            <div className="relative ml-4" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 text-gray-700 font-medium hover:text-indigo-600 transition-colors focus:outline-none"
                                >
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border border-indigo-200">
                                        <FaUser size={14} />
                                    </div>
                                    <span>{user.username}</span>
                                    <svg className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-fade-in-down origin-top-right">
                                        <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Signed in as</p>
                                            <p className="text-sm font-bold text-gray-900 truncate">{user.username}</p>
                                        </div>

                                        <div className="py-1">
                                            <Link
                                                to="/profile"
                                                state={{ activeTab: 'details' }}
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                            >
                                                <FaUser className="mr-3 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                                                Account Details
                                            </Link>

                                            <Link
                                                to="/profile"
                                                state={{ activeTab: 'settings' }}
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                            >
                                                <FaCog className="mr-3 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                                                Settings
                                            </Link>
                                        </div>

                                        <div className="border-t border-gray-100 pt-1 pb-1">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center group"
                                            >
                                                <FaSignOutAlt className="mr-3 text-red-400 group-hover:text-red-600 transition-colors" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 ml-4">
                                <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Login</Link>
                                <Link
                                    to="/signup"
                                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="-mr-2 flex md:hidden items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition duration-300 focus:outline-none"
                        >
                            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur-md shadow-lg border-t border-gray-100 absolute w-full animate-fade-in-down">
                    <div className="px-4 pt-4 pb-6 space-y-2">
                        <MobileNavLink to="/" onClick={() => setIsOpen(false)} isActive={isActive('/')}>Home</MobileNavLink>
                        <MobileNavLink to="/dsa" onClick={() => setIsOpen(false)} isActive={isActive('/dsa')}>DSA Problems</MobileNavLink>
                        <MobileNavLink to="/full-stack" onClick={() => setIsOpen(false)} isActive={isActive('/full-stack')}>Full Stack Guide</MobileNavLink>
                        {user ? (
                            <>
                                <div className="px-4 py-2 text-gray-700 font-medium border-t border-gray-100 mt-2 bg-indigo-50/50 rounded-lg mx-2 mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                            <FaUser size={12} />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Signed in as</p>
                                            <p className="text-sm font-bold text-gray-900 truncate">{user.username}</p>
                                        </div>
                                    </div>
                                </div>

                                <MobileNavLink to="/profile" onClick={() => setIsOpen(false)} state={{ activeTab: 'details' }}>
                                    Account Details
                                </MobileNavLink>

                                <MobileNavLink to="/profile" onClick={() => setIsOpen(false)} state={{ activeTab: 'settings' }}>
                                    Settings
                                </MobileNavLink>

                                <div className="border-t border-gray-100 mt-1 pt-1">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 font-medium transition-colors flex items-center gap-2"
                                    >
                                        <FaSignOutAlt /> Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="pt-4 border-t border-gray-100 flex flex-col gap-2 px-4">
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full text-center py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:border-indigo-600 hover:text-indigo-600 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full text-center py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-md"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

const NavLink = ({ to, children, isActive, icon }) => (
    <Link
        to={to}
        className={`flex items-center gap-2 font-medium transition-all duration-300 relative group ${isActive ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
    >
        {icon && <span className="group-hover:scale-110 transition-transform">{icon}</span>}
        {children}
        <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full ${isActive ? 'w-full' : ''}`}></span>
    </Link>
);

const MobileNavLink = ({ to, children, onClick, isActive, state }) => (
    <Link
        to={to}
        state={state}
        className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${isActive
            ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600'
            : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 hover:pl-6'
            }`}
        onClick={onClick}
    >
        {children}
    </Link>
);

export default Navbar;
