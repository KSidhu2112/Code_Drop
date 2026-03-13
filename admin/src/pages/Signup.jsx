import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../config/api';
import { FaUserPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await api.post('/admin/register', formData);
            // On success, navigate to verify page with email in state
            if (res.data.devMode) {
                toast.success('Admin Account created! (DEV: Check server console for OTP)', { duration: 6000 });
            } else {
                toast.success('Admin Account created! Please verify your email.');
            }
            navigate('/verify-email', { state: { email: formData.email } });
        } catch (err) {
            const message = err.response?.data?.message || 'Signup failed';
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                <div className="text-center mb-6">
                    <FaUserPlus className="mx-auto text-indigo-600 text-4xl mb-2" />
                    <h1 className="text-2xl font-bold text-gray-800">Admin Signup</h1>
                </div>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                    <div className="text-center mt-4 text-sm">
                        Already have an account? <Link to="/login" className="text-indigo-600 hover:underline">Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
