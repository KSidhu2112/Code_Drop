import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../config/api';
import toast from 'react-hot-toast';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
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
            const res = await api.post('/users/login', formData);
            localStorage.setItem('userInfo', JSON.stringify(res.data));
            setLoading(false);
            toast.success('Welcome back! 🎉');
            navigate('/');
        } catch (err) {
            setLoading(false);
            const data = err.response?.data;
            const message = data?.message || 'Invalid email or password';
            setError(message);
            toast.error(message);

            // If unverified, offer to redirect to verify page
            if (data?.needsVerification && data?.email) {
                setTimeout(() => {
                    navigate(`/verify-otp?email=${encodeURIComponent(data.email)}`);
                }, 2000);
            }
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.blob1} />
            <div style={styles.blob2} />

            <div style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.logoIcon}>⚡</div>
                    <h1 style={styles.title}>Welcome Back</h1>
                    <p style={styles.subtitle}>Sign in to continue your learning journey</p>
                </div>

                {error && (
                    <div style={styles.errorBox}>
                        <span>⚠️</span>
                        <span style={styles.errorText}>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label} htmlFor="login-email">Email Address</label>
                        <div style={styles.inputWrapper}>
                            <span style={styles.inputIcon}>✉️</span>
                            <input
                                id="login-email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                style={styles.input}
                                onFocus={e => e.target.parentElement.style.borderColor = '#6366f1'}
                                onBlur={e => e.target.parentElement.style.borderColor = '#e2e8f0'}
                            />
                        </div>
                    </div>

                    <div style={styles.fieldGroup}>
                        <div style={styles.labelRow}>
                            <label style={styles.label} htmlFor="login-password">Password</label>
                            <Link to="/forgot-password" style={styles.forgotLink}>Forgot password?</Link>
                        </div>
                        <div style={styles.inputWrapper}>
                            <span style={styles.inputIcon}>🔒</span>
                            <input
                                id="login-password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                required
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                style={{ ...styles.input, paddingRight: '48px' }}
                                onFocus={e => e.target.parentElement.style.borderColor = '#6366f1'}
                                onBlur={e => e.target.parentElement.style.borderColor = '#e2e8f0'}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={styles.eyeBtn}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        id="login-submit-btn"
                        style={{
                            ...styles.submitBtn,
                            opacity: loading ? 0.75 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {loading ? (
                            <span style={styles.btnContent}>
                                <span style={styles.spinner} />
                                Signing in...
                            </span>
                        ) : (
                            <span style={styles.btnContent}>🔑 Sign In</span>
                        )}
                    </button>
                </form>

                <div style={styles.dividerRow}>
                    <div style={styles.dividerLine} />
                    <span style={styles.dividerText}>or</span>
                    <div style={styles.dividerLine} />
                </div>

                <p style={styles.switchText}>
                    Don't have an account?{' '}
                    <Link to="/signup" style={styles.link}>Create one</Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    page: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        padding: '40px 20px',
        position: 'relative',
        overflow: 'hidden',
    },
    blob1: {
        position: 'absolute',
        top: '-80px',
        left: '-60px',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'rgba(99,102,241,0.12)',
        pointerEvents: 'none',
    },
    blob2: {
        position: 'absolute',
        bottom: '-60px',
        right: '-60px',
        width: '260px',
        height: '260px',
        borderRadius: '50%',
        background: 'rgba(139,92,246,0.1)',
        pointerEvents: 'none',
    },
    card: {
        background: '#ffffff',
        borderRadius: '24px',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
        position: 'relative',
        zIndex: 1,
    },
    header: {
        textAlign: 'center',
        marginBottom: '32px',
    },
    logoIcon: {
        fontSize: '40px',
        marginBottom: '12px',
    },
    title: {
        fontSize: '28px',
        fontWeight: '800',
        color: '#1a1a2e',
        margin: '0 0 8px',
        letterSpacing: '-0.5px',
    },
    subtitle: {
        fontSize: '15px',
        color: '#6b7280',
        margin: 0,
    },
    errorBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '12px',
        padding: '12px 16px',
        marginBottom: '20px',
    },
    errorText: {
        color: '#dc2626',
        fontSize: '14px',
        fontWeight: '500',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    fieldGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    labelRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151',
    },
    forgotLink: {
        fontSize: '13px',
        color: '#6366f1',
        fontWeight: '600',
        textDecoration: 'none',
    },
    inputWrapper: {
        display: 'flex',
        alignItems: 'center',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        padding: '0 14px',
        transition: 'border-color 0.2s',
        background: '#fafafa',
        position: 'relative',
    },
    inputIcon: {
        fontSize: '16px',
        marginRight: '10px',
        flexShrink: 0,
    },
    input: {
        flex: 1,
        border: 'none',
        outline: 'none',
        background: 'transparent',
        padding: '13px 0',
        fontSize: '15px',
        color: '#1f2937',
    },
    eyeBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        padding: '0',
        position: 'absolute',
        right: '14px',
    },
    submitBtn: {
        width: '100%',
        padding: '14px',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        color: '#ffffff',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '700',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
        marginTop: '8px',
    },
    btnContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
    },
    spinner: {
        width: '18px',
        height: '18px',
        border: '2px solid rgba(255,255,255,0.3)',
        borderTopColor: '#fff',
        borderRadius: '50%',
        display: 'inline-block',
        animation: 'spin 0.8s linear infinite',
    },
    dividerRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        margin: '24px 0 16px',
    },
    dividerLine: {
        flex: 1,
        height: '1px',
        background: '#e5e7eb',
    },
    dividerText: {
        color: '#9ca3af',
        fontSize: '13px',
    },
    switchText: {
        textAlign: 'center',
        fontSize: '14px',
        color: '#6b7280',
        margin: 0,
    },
    link: {
        color: '#6366f1',
        fontWeight: '700',
        textDecoration: 'none',
    },
};

export default Login;
