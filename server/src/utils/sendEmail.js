const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false, // TLS – use STARTTLS
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
        // Hard timeouts so the server never hangs waiting for SMTP
        connectionTimeout: 8000,   // 8s to connect
        greetingTimeout: 5000,     // 5s for SMTP greeting
        socketTimeout: 10000,      // 10s socket idle
    });

    const message = {
        from: `"CodeDrop" <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html || options.message,
    };

    const info = await transporter.sendMail(message);
    console.log('✅ Email sent to:', options.email, '| MessageId:', info.messageId);
    return info;
};

module.exports = sendEmail;
