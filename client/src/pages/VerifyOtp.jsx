import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../config/api';
import toast from 'react-hot-toast';

const VerifyOtp = () => {
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [success, setSuccess] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!email) navigate('/signup');
    }, [email, navigate]);

    // Countdown timer for resend
    useEffect(() => {
        if (countdown > 0 && !canResend) {
            const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            setCanResend(true);
        }
    }, [countdown, canResend]);

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return; // Only digits
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Only last digit
        setOtp(newOtp);

        // Auto-focus next
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 6) {
            setOtp(pasted.split(''));
            inputRefs.current[5]?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const res = await api.post('/users/verify', { email, otp: otpString });
            setSuccess(true);
            setLoading(false);
            toast.success('Email verified successfully! 🎉');

            if (res.data.token) {
                localStorage.setItem('userInfo', JSON.stringify(res.data));
            }

            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setLoading(false);
            const msg = err.response?.data?.message || 'Invalid OTP';
            setError(msg);
            toast.error(msg);
        }
    };

    const handleResend = async () => {
        setResending(true);
        try {
            const res = await api.post('/users/resend-otp', { email });
            if (res.data.devMode) {
                toast.success('OTP resent! Check server console.', { duration: 5000 });
            } else {
                toast.success('New OTP sent to your email!');
            }
            setCountdown(60);
            setCanResend(false);
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setResending(false);
        }
    };

    if (success) {
        return (
            <div style={styles.page}>
                <div style={styles.blob1} />
                <div style={styles.blob2} />
                <div style={{ ...styles.card, textAlign: 'center' }}>
                    <div style={styles.successIcon}>✅</div>
                    <h2 style={styles.title}>Email Verified!</h2>
                    <p style={styles.subtitle}>Your account has been activated. Redirecting to login...</p>
                    <div style={styles.progressBar}>
                        <div style={styles.progressFill} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <div style={styles.blob1} />
            <div style={styles.blob2} />

            <div style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.logoIcon}>📬</div>
                    <h1 style={styles.title}>Check Your Inbox</h1>
                    <p style={styles.subtitle}>
                        We sent a 6-digit OTP to
                    </p>
                    <div style={styles.emailBadge}>
                        <span style={styles.emailBadgeText}>{email}</span>
                    </div>
                </div>

                {error && (
                    <div style={styles.errorBox}>
                        <span>⚠️</span>
                        <span style={styles.errorText}>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <p style={styles.otpLabel}>Enter OTP</p>
                    <div style={styles.otpRow} onPaste={handlePaste}>
                        {otp.map((digit, i) => (
                            <input
                                key={i}
                                ref={el => inputRefs.current[i] = el}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={e => handleOtpChange(i, e.target.value)}
                                onKeyDown={e => handleKeyDown(i, e)}
                                id={`otp-digit-${i}`}
                                style={{
                                    ...styles.otpInput,
                                    borderColor: digit ? '#6366f1' : '#e2e8f0',
                                    background: digit ? '#f0f4ff' : '#fafafa',
                                    color: digit ? '#6366f1' : '#374151',
                                }}
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        id="verify-otp-btn"
                        style={{
                            ...styles.submitBtn,
                            opacity: loading ? 0.75 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {loading ? (
                            <span style={styles.btnContent}>
                                <span style={styles.spinner} />
                                Verifying...
                            </span>
                        ) : (
                            <span style={styles.btnContent}>✅ Verify Email</span>
                        )}
                    </button>
                </form>

                <div style={styles.resendSection}>
                    <p style={styles.resendText}>Didn't receive the code?</p>
                    {canResend ? (
                        <button
                            onClick={handleResend}
                            disabled={resending}
                            id="resend-otp-btn"
                            style={styles.resendBtn}
                        >
                            {resending ? 'Sending...' : '🔄 Resend OTP'}
                        </button>
                    ) : (
                        <p style={styles.countdownText}>
                            Resend in <strong style={{ color: '#6366f1' }}>{countdown}s</strong>
                        </p>
                    )}
                </div>

                <div style={styles.spamNote}>
                    <span>💡</span>
                    <span>Also check your spam/junk folder</span>
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
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        padding: '40px 20px',
        position: 'relative',
        overflow: 'hidden',
    },
    blob1: {
        position: 'absolute',
        top: '-60px',
        right: '-60px',
        width: '280px',
        height: '280px',
        borderRadius: '50%',
        background: 'rgba(99,102,241,0.15)',
        pointerEvents: 'none',
    },
    blob2: {
        position: 'absolute',
        bottom: '-80px',
        left: '-40px',
        width: '240px',
        height: '240px',
        borderRadius: '50%',
        background: 'rgba(139,92,246,0.12)',
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
    successIcon: {
        fontSize: '64px',
        marginBottom: '20px',
    },
    progressBar: {
        height: '4px',
        background: '#e5e7eb',
        borderRadius: '4px',
        marginTop: '24px',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        width: '100%',
        background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
        borderRadius: '4px',
        animation: 'fillProgress 2s linear forwards',
    },
    header: {
        textAlign: 'center',
        marginBottom: '28px',
    },
    logoIcon: {
        fontSize: '40px',
        marginBottom: '12px',
    },
    title: {
        fontSize: '26px',
        fontWeight: '800',
        color: '#1a1a2e',
        margin: '0 0 8px',
        letterSpacing: '-0.5px',
    },
    subtitle: {
        fontSize: '14px',
        color: '#6b7280',
        margin: '0 0 10px',
    },
    emailBadge: {
        display: 'inline-block',
        background: '#f0f4ff',
        border: '1px solid #c7d2fe',
        borderRadius: '20px',
        padding: '6px 16px',
        marginTop: '4px',
    },
    emailBadgeText: {
        color: '#4f46e5',
        fontWeight: '600',
        fontSize: '13px',
    },
    errorBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '10px',
        padding: '10px 14px',
        marginBottom: '16px',
    },
    errorText: {
        color: '#dc2626',
        fontSize: '13px',
        fontWeight: '500',
    },
    otpLabel: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '12px',
        textAlign: 'center',
    },
    otpRow: {
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        marginBottom: '24px',
    },
    otpInput: {
        width: '50px',
        height: '56px',
        textAlign: 'center',
        fontSize: '22px',
        fontWeight: '700',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        outline: 'none',
        transition: 'all 0.2s',
        caretColor: '#6366f1',
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
    resendSection: {
        textAlign: 'center',
        marginTop: '24px',
    },
    resendText: {
        color: '#6b7280',
        fontSize: '14px',
        marginBottom: '8px',
    },
    countdownText: {
        color: '#6b7280',
        fontSize: '14px',
    },
    resendBtn: {
        background: 'none',
        border: '1.5px solid #6366f1',
        borderRadius: '8px',
        color: '#6366f1',
        fontSize: '14px',
        fontWeight: '600',
        padding: '8px 20px',
        cursor: 'pointer',
        transition: 'background 0.2s',
    },
    spamNote: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        marginTop: '16px',
        color: '#9ca3af',
        fontSize: '12px',
    },
};

export default VerifyOtp;
