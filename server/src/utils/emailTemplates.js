/**
 * Generates a beautiful HTML email template for OTP
 * @param {string} otp - The OTP code
 * @param {string} type - 'verify' | 'reset'
 * @param {string} username - User's name (optional)
 */
const getOtpEmailTemplate = (otp, type = 'verify', username = '') => {
    const isVerify = type === 'verify';

    const title = isVerify ? 'Verify Your Email Address' : 'Reset Your Password';
    const subtitle = isVerify
        ? 'Welcome to CodeDrop! Please verify your email to get started.'
        : 'We received a request to reset your password.';
    const instruction = isVerify
        ? 'Use the OTP below to verify your email address. This code is valid for <strong>10 minutes</strong>.'
        : 'Use the OTP below to reset your password. This code is valid for <strong>10 minutes</strong>.';
    const footerNote = isVerify
        ? 'If you didn\'t create a CodeDrop account, you can safely ignore this email.'
        : 'If you didn\'t request a password reset, you can safely ignore this email.';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f0f4ff; }
  </style>
</head>
<body style="background:#f0f4ff; padding: 40px 20px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 32px 40px; border-radius: 16px 16px 0 0; text-align:center;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align:center;">
              <div style="display:inline-block; background:rgba(255,255,255,0.15); border-radius:50%; width:60px; height:60px; line-height:60px; font-size:28px; margin-bottom:12px;">
                ${isVerify ? '✉️' : '🔒'}
              </div>
              <h1 style="color:#ffffff; font-size:24px; font-weight:700; letter-spacing:-0.5px; margin:0;">${title}</h1>
              <p style="color:rgba(255,255,255,0.85); font-size:14px; margin-top:8px;">${subtitle}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="background:#ffffff; padding: 40px;">
        ${username ? `<p style="color:#374151; font-size:16px; margin-bottom:20px;">Hi <strong>${username}</strong>,</p>` : ''}
        <p style="color:#6b7280; font-size:15px; line-height:1.6; margin-bottom:28px;">${instruction}</p>

        <!-- OTP Box -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align:center; padding: 20px 0;">
              <div style="display:inline-block; background: linear-gradient(135deg, #f0f4ff 0%, #ede9fe 100%); border: 2px dashed #818cf8; border-radius: 12px; padding: 24px 48px;">
                <p style="color:#6366f1; font-size:13px; font-weight:600; letter-spacing:2px; text-transform:uppercase; margin-bottom:8px;">Your OTP Code</p>
                <p style="color:#1e1b4b; font-size:40px; font-weight:800; letter-spacing:12px; font-family:monospace;">${otp}</p>
                <p style="color:#9ca3af; font-size:12px; margin-top:8px;">⏰ Expires in 10 minutes</p>
              </div>
            </td>
          </tr>
        </table>

        <div style="background:#fefce8; border-left:4px solid #f59e0b; border-radius:0 8px 8px 0; padding:16px; margin:24px 0;">
          <p style="color:#92400e; font-size:13px; line-height:1.5;">
            ⚠️ <strong>Security Tip:</strong> Never share this OTP with anyone. CodeDrop will never ask for your OTP via phone or chat.
          </p>
        </div>

        <p style="color:#9ca3af; font-size:13px; line-height:1.6;">${footerNote}</p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background:#f9fafb; padding: 24px 40px; border-radius: 0 0 16px 16px; border-top: 1px solid #e5e7eb; text-align:center;">
        <p style="color:#6b7280; font-size:13px; margin-bottom:8px;">
          Sent with ❤️ by <strong style="color:#6366f1;">CodeDrop</strong>
        </p>
        <p style="color:#9ca3af; font-size:12px;">
          DSA &amp; Full Stack Learning Platform
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
};

module.exports = { getOtpEmailTemplate };
