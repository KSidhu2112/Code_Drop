import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../config/api';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [devMode, setDevMode] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await api.post('/users/forgot-password', { email });
            setSent(true);
            setLoading(false);

            if (res.data.devMode) {
                setDevMode(true);
                toast.success('DEV MODE: Check server console for OTP!', { duration: 6000 });
            } else {
                toast.success('OTP sent to your email!');
            }

            setTimeout(() => {
                navigate(`/reset-password?email=${encodeURIComponent(email)}`);
            }, 3000);
        } catch (err) {
            setLoading(false);
            const msg = err.response?.data?.message || 'Something went wrong';
            setError(msg);
            toast.error(msg);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.blob1} />
            <div style={styles.blob2} />

            <div style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.logoIcon}>🔐</div>
                    <h1 style={styles.title}>Forgot Password?</h1>
                    <p style={styles.subtitle}>
                        Enter your email and we'll send you a reset OTP
                    </p>
                </div>

                {sent ? (
                    <div style={devMode ? styles.devAlert : styles.successAlert}>
                        <div style={styles.alertIcon}>{devMode ? '⚠️' : '📬'}</div>
                        <div>
                            <p style={styles.alertTitle}>
                                {devMode ? 'Dev Mode Active' : 'OTP Sent!'}
                            </p>
                            <p style={styles.alertMsg}>
                                {devMode
                                    ? 'Email not configured. Check the server terminal for your OTP. Redirecting...'
                                    : `A reset OTP was sent to ${email}. Redirecting to reset page...`
                                }
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {error && (
                            <div style={styles.errorBox}>
                                <span>⚠️</span>
                                <span style={styles.errorText}>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={styles.form}>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label} htmlFor="forgot-email">Email Address</label>
                                <div style={styles.inputWrapper}>
                                    <span style={styles.inputIcon}>✉️</span>
                                    <input
                                        id="forgot-email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        style={styles.input}
                                        onFocus={e => e.target.parentElement.style.borderColor = '#6366f1'}
                                        onBlur={e => e.target.parentElement.style.borderColor = '#e2e8f0'}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                id="forgot-password-btn"
                                style={{
                                    ...styles.submitBtn,
                                    opacity: loading ? 0.75 : 1,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {loading ? (
                                    <span style={styles.btnContent}>
                                        <span style={styles.spinner} />
                                        Sending OTP...
                                    </span>
                                ) : (
                                    <span style={styles.btnContent}>📨 Send Reset OTP</span>
                                )}
                            </button>
                        </form>
                    </>
                )}

                <div style={styles.backRow}>
                    <Link to="/login" style={styles.backLink}>← Back to Sign In</Link>
                </div>
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
        background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
        padding: '40px 20px',
        position: 'relative',
        overflow: 'hidden',
    },
    blob1: {
        position: 'absolute',
        top: '-80px',
        right: '-60px',
        width: '280px',
        height: '280px',
        borderRadius: '50%',
        background: 'rgba(99,102,241,0.1)',
        pointerEvents: 'none',
    },
    blob2: {
        position: 'absolute',
        bottom: '-60px',
        left: '-50px',
        width: '240px',
        height: '240px',
        borderRadius: '50%',
        background: 'rgba(45,212,191,0.08)',
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
    successAlert: {
        display: 'flex',
        gap: '14px',
        background: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: '14px',
        padding: '18px',
        marginBottom: '24px',
    },
    devAlert: {
        display: 'flex',
        gap: '14px',
        background: '#fffbeb',
        border: '1px solid #fde68a',
        borderRadius: '14px',
        padding: '18px',
        marginBottom: '24px',
    },
    alertIcon: {
        fontSize: '26px',
        flexShrink: 0,
    },
    alertTitle: {
        fontWeight: '700',
        color: '#166534',
        fontSize: '15px',
        marginBottom: '4px',
    },
    alertMsg: {
        color: '#15803d',
        fontSize: '13px',
        lineHeight: '1.5',
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
    label: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151',
    },
    inputWrapper: {
        display: 'flex',
        alignItems: 'center',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        padding: '0 14px',
        transition: 'border-color 0.2s',
        background: '#fafafa',
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
    backRow: {
        textAlign: 'center',
        marginTop: '24px',
    },
    backLink: {
        color: '#6b7280',
        fontSize: '14px',
        textDecoration: 'none',
        fontWeight: '500',
    },
};

export default ForgotPassword;
