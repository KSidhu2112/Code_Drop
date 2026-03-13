import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../config/api';
import { FaCheckCircle } from 'react-icons/fa';

const VerifyEmail = () => {
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
        } else {
            // If no email passed, maybe redirect or ask for it?
            // For now, let user type it if missing, but UI only shows OTP input primarily.
            // Better to redirect to login if no email.
            // setError("No email provided. Please login or signup again.");
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            await api.post('/admin/verify', { email, otp });
            setMessage('Email verified successfully! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                <div className="text-center mb-6">
                    <FaCheckCircle className="mx-auto text-green-500 text-4xl mb-2" />
                    <h1 className="text-2xl font-bold text-gray-800">Verify Email</h1>
                    <p className="text-gray-600 text-sm">Enter the OTP sent to {email}</p>
                </div>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
                {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">{message}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!location.state?.email && (
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">OTP</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 tracking-widest text-center text-xl"
                            required
                            maxLength="6"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Verifying...' : 'Verify'}
                    </button>
                    <div className="text-center mt-4 text-sm">
                        <Link to="/login" className="text-indigo-600 hover:underline">Back to Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerifyEmail;
