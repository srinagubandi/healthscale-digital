/**
 * WhatsApp Service
 * ================
 * Send WhatsApp notifications using Twilio
 * 
 * Environment Variables Required:
 * - TWILIO_ACCOUNT_SID: Your Twilio Account SID
 * - TWILIO_AUTH_TOKEN: Your Twilio Auth Token
 * - TWILIO_WHATSAPP_FROM: Your Twilio WhatsApp number (format: whatsapp:+14155238886)
 * - WHATSAPP_NOTIFICATION_TO: Recipient WhatsApp number (format: whatsapp:+1234567890)
 * 
 * Setup Instructions:
 * 1. Create a Twilio account at https://www.twilio.com
 * 2. Go to Messaging > Try it out > Send a WhatsApp message
 * 3. Follow the sandbox setup instructions
 * 4. For production, apply for a WhatsApp Business API number
 */

let twilioClient = null;

function getTwilioClient() {
    if (!twilioClient && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        const twilio = require('twilio');
        twilioClient = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );
    }
    return twilioClient;
}

/**
 * Send WhatsApp notification
 * @param {Object} options - Message options
 * @param {string} options.message - Message text
 */
async function sendNotification({ message }) {
    const client = getTwilioClient();
    
    if (!client) {
        console.log('📱 WhatsApp not configured - skipping notification');
        console.log('   To enable: Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM, WHATSAPP_NOTIFICATION_TO');
        return { skipped: true, reason: 'WhatsApp not configured' };
    }

    const from = process.env.TWILIO_WHATSAPP_FROM;
    const to = process.env.WHATSAPP_NOTIFICATION_TO;

    if (!from || !to) {
        console.log('📱 WhatsApp numbers not configured - skipping notification');
        return { skipped: true, reason: 'WhatsApp numbers not set' };
    }

    const result = await client.messages.create({
        body: message,
        from: from,
        to: to
    });

    console.log('📱 WhatsApp sent:', result.sid);
    
    return { success: true, messageSid: result.sid };
}

/**
 * Verify Twilio connection
 */
async function verifyConnection() {
    const client = getTwilioClient();
    if (!client) {
        return { configured: false };
    }
    
    try {
        // Try to fetch account info to verify credentials
        await client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
        return { configured: true, connected: true };
    } catch (error) {
        return { configured: true, connected: false, error: error.message };
    }
}

module.exports = {
    sendNotification,
    verifyConnection
};
