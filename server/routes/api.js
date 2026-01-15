/**
 * API Routes
 * ==========
 * Handles contact form submissions and notifications
 */

const express = require('express');
const router = express.Router();
const db = require('../db');
const emailService = require('../services/email');
const whatsappService = require('../services/whatsapp');

/**
 * POST /api/contact
 * Submit a contact form
 */
router.post('/contact', async (req, res) => {
    try {
        const { name, email, phone, company, message } = req.body;

        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and message are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Insert into database
        const result = await db.query(
            `INSERT INTO contact_submissions (name, email, phone, company, message)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, created_at`,
            [name, email, phone || null, company || null, message]
        );

        const submission = result.rows[0];

        // Send notifications (don't wait, fire and forget)
        sendNotifications(submission.id, { name, email, phone, company, message });

        res.status(201).json({
            success: true,
            message: 'Thank you for your message! We will get back to you soon.',
            submissionId: submission.id
        });

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit form. Please try again later.'
        });
    }
});

/**
 * Send email and WhatsApp notifications
 */
async function sendNotifications(submissionId, data) {
    const { name, email, phone, company, message } = data;

    // Send email notification
    try {
        await emailService.sendNotification({
            subject: `New Contact Form Submission from ${name}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                <p><strong>Company:</strong> ${company || 'Not provided'}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
                <hr>
                <p><small>Submitted at: ${new Date().toISOString()}</small></p>
            `
        });

        // Log successful email
        await db.query(
            `INSERT INTO notification_logs (submission_id, type, status, details)
             VALUES ($1, 'email', 'sent', 'Email notification sent successfully')`,
            [submissionId]
        );
    } catch (error) {
        console.error('Email notification failed:', error);
        await db.query(
            `INSERT INTO notification_logs (submission_id, type, status, details)
             VALUES ($1, 'email', 'failed', $2)`,
            [submissionId, error.message]
        );
    }

    // Send WhatsApp notification
    try {
        await whatsappService.sendNotification({
            message: `🔔 New Contact Form Submission\n\n👤 Name: ${name}\n📧 Email: ${email}\n📱 Phone: ${phone || 'N/A'}\n🏢 Company: ${company || 'N/A'}\n\n💬 Message:\n${message}`
        });

        // Log successful WhatsApp
        await db.query(
            `INSERT INTO notification_logs (submission_id, type, status, details)
             VALUES ($1, 'whatsapp', 'sent', 'WhatsApp notification sent successfully')`,
            [submissionId]
        );
    } catch (error) {
        console.error('WhatsApp notification failed:', error);
        await db.query(
            `INSERT INTO notification_logs (submission_id, type, status, details)
             VALUES ($1, 'whatsapp', 'failed', $2)`,
            [submissionId, error.message]
        );
    }
}

module.exports = router;
