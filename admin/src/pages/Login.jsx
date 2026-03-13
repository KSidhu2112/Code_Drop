import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaLock } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState(''); // Use email instead of username
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) {
            toast.success('Admin Login Successful!');
            navigate('/');
        } else {
            setError(result.error);
            toast.error(result.error || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                <div className="text-center mb-6">
                    <FaLock className="mx-auto text-indigo-600 text-4xl mb-2" />
                    <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
                </div>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email or Username</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Login
                    </button>

                    <div className="flex justify-between mt-4 text-sm">
                        <Link to="/forgot-password" className="text-gray-600 hover:text-indigo-600">Forgot Password?</Link>
                        <Link to="/signup" className="text-indigo-600 hover:underline">Sign Up</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
