/**
 * Email Service
 * =============
 * Send email notifications using Nodemailer with SMTP
 * 
 * Environment Variables Required:
 * - SMTP_HOST: SMTP server hostname
 * - SMTP_PORT: SMTP server port (usually 587 or 465)
 * - SMTP_USER: SMTP username/email
 * - SMTP_PASS: SMTP password or app password
 * - NOTIFICATION_EMAIL: Email address to receive notifications
 * 
 * Recommended SMTP Providers:
 * - Gmail (use App Password)
 * - SendGrid
 * - Mailgun
 * - Amazon SES
 * - Resend
 */

const nodemailer = require('nodemailer');

// Create transporter (configured lazily)
let transporter = null;

function getTransporter() {
    if (!transporter && process.env.SMTP_HOST) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }
    return transporter;
}

/**
 * Send notification email
 * @param {Object} options - Email options
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.text - Plain text content (optional)
 */
async function sendNotification({ subject, html, text }) {
    const transport = getTransporter();
    
    if (!transport) {
        console.log('📧 Email not configured - skipping notification');
        console.log('   To enable: Set SMTP_HOST, SMTP_USER, SMTP_PASS, NOTIFICATION_EMAIL');
        return { skipped: true, reason: 'Email not configured' };
    }

    const notificationEmail = process.env.NOTIFICATION_EMAIL;
    if (!notificationEmail) {
        console.log('📧 NOTIFICATION_EMAIL not set - skipping notification');
        return { skipped: true, reason: 'Notification email not set' };
    }

    const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: notificationEmail,
        subject: subject,
        html: html,
        text: text || html.replace(/<[^>]*>/g, '')
    };

    const result = await transport.sendMail(mailOptions);
    console.log('📧 Email sent:', result.messageId);
    
    return { success: true, messageId: result.messageId };
}

/**
 * Verify SMTP connection
 */
async function verifyConnection() {
    const transport = getTransporter();
    if (!transport) {
        return { configured: false };
    }
    
    try {
        await transport.verify();
        return { configured: true, connected: true };
    } catch (error) {
        return { configured: true, connected: false, error: error.message };
    }
}

module.exports = {
    sendNotification,
    verifyConnection
};
