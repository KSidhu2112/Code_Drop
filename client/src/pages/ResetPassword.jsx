import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../config/api';
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!email) navigate('/forgot-password');
    }, [email, navigate]);

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        if (value && index < 5) inputRefs.current[index + 1]?.focus();
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
        setError('');

        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter all 6 OTP digits');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await api.post('/users/reset-password', {
                email,
                otp: otpString,
                password: formData.password
            });

            setSuccess(true);
            setLoading(false);
            toast.success('Password reset successful! 🎉');

            setTimeout(() => navigate('/login'), 2500);
        } catch (err) {
            setLoading(false);
            const msg = err.response?.data?.message || 'Failed to reset password';
            setError(msg);
            toast.error(msg);
        }
    };

    if (success) {
        return (
            <div style={styles.page}>
                <div style={styles.blob1} />
                <div style={styles.blob2} />
                <div style={{ ...styles.card, textAlign: 'center' }}>
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
                    <h2 style={styles.title}>Password Reset!</h2>
                    <p style={styles.subtitle}>
                        Your password has been updated successfully. Redirecting to login...
                    </p>
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
                    <div style={styles.logoIcon}>🔑</div>
                    <h1 style={styles.title}>Reset Password</h1>
                    <p style={styles.subtitle}>
                        Enter the OTP sent to <strong style={{ color: '#6366f1' }}>{email}</strong>
                    </p>
                </div>

                {error && (
                    <div style={styles.errorBox}>
                        <span>⚠️</span>
                        <span style={styles.errorText}>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    {/* OTP Inputs */}
                    <div>
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
                                    id={`reset-otp-digit-${i}`}
                                    style={{
                                        ...styles.otpInput,
                                        borderColor: digit ? '#6366f1' : '#e2e8f0',
                                        background: digit ? '#f0f4ff' : '#fafafa',
                                        color: digit ? '#6366f1' : '#374151',
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* New Password */}
                    <div style={styles.fieldGroup}>
                        <label style={styles.label} htmlFor="new-password">New Password</label>
                        <div style={styles.inputWrapper}>
                            <span style={styles.inputIcon}>🔒</span>
                            <input
                                id="new-password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                placeholder="At least 6 characters"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                style={{ ...styles.input, paddingRight: '48px' }}
                                onFocus={e => e.target.parentElement.style.borderColor = '#6366f1'}
                                onBlur={e => e.target.parentElement.style.borderColor = '#e2e8f0'}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div style={styles.fieldGroup}>
                        <label style={styles.label} htmlFor="confirm-password">Confirm Password</label>
                        <div style={styles.inputWrapper}>
                            <span style={styles.inputIcon}>🔒</span>
                            <input
                                id="confirm-password"
                                name="confirmPassword"
                                type={showConfirm ? 'text' : 'password'}
                                required
                                placeholder="Repeat your password"
                                value={formData.confirmPassword}
                                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                style={{ ...styles.input, paddingRight: '48px' }}
                                onFocus={e => e.target.parentElement.style.borderColor = '#6366f1'}
                                onBlur={e => e.target.parentElement.style.borderColor = '#e2e8f0'}
                            />
                            <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
                                {showConfirm ? '🙈' : '👁️'}
                            </button>
                        </div>
                        {/* Password match indicator */}
                        {formData.confirmPassword && (
                            <p style={{
                                fontSize: '12px',
                                marginTop: '4px',
                                color: formData.password === formData.confirmPassword ? '#16a34a' : '#dc2626',
                                fontWeight: '500',
                            }}>
                                {formData.password === formData.confirmPassword ? '✅ Passwords match' : '❌ Passwords don\'t match'}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        id="reset-password-btn"
                        style={{
                            ...styles.submitBtn,
                            opacity: loading ? 0.75 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {loading ? (
                            <span style={styles.btnContent}>
                                <span style={styles.spinner} />
                                Resetting Password...
                            </span>
                        ) : (
                            <span style={styles.btnContent}>🔄 Reset Password</span>
                        )}
                    </button>
                </form>
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
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2d1b69 50%, #11152c 100%)',
        padding: '40px 20px',
        position: 'relative',
        overflow: 'hidden',
    },
    blob1: {
        position: 'absolute',
        top: '-60px',
        left: '-60px',
        width: '260px',
        height: '260px',
        borderRadius: '50%',
        background: 'rgba(99,102,241,0.12)',
        pointerEvents: 'none',
    },
    blob2: {
        position: 'absolute',
        bottom: '-80px',
        right: '-60px',
        width: '280px',
        height: '280px',
        borderRadius: '50%',
        background: 'rgba(139,92,246,0.1)',
        pointerEvents: 'none',
    },
    card: {
        background: '#ffffff',
        borderRadius: '24px',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '460px',
        boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
        position: 'relative',
        zIndex: 1,
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
        margin: 0,
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
        animation: 'fillProgress 2.5s linear forwards',
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
    otpLabel: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '10px',
        textAlign: 'center',
    },
    otpRow: {
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
    },
    otpInput: {
        width: '48px',
        height: '52px',
        textAlign: 'center',
        fontSize: '20px',
        fontWeight: '700',
        border: '2px solid #e2e8f0',
        borderRadius: '10px',
        outline: 'none',
        transition: 'all 0.2s',
        caretColor: '#6366f1',
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
        marginTop: '4px',
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
};

export default ResetPassword;
