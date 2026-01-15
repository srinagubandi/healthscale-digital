/**
 * Health Scale Digital - Main Server
 * ==================================
 * Express server with PostgreSQL database, contact form handling,
 * email notifications, and WhatsApp notifications.
 * 
 * Deployable to Railway via GitHub
 */

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');

// Import routes
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');

// Import database
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// ===========================================
// MIDDLEWARE
// ===========================================

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'healthscale-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// ===========================================
// ROUTES
// ===========================================

// API routes (contact form submissions)
app.use('/api', apiRoutes);

// Admin routes (dashboard, login)
app.use('/admin', adminRoutes);

// Home page - serve the main website
app.get('/', (req, res) => {
    res.render('index');
});

// ===========================================
// ERROR HANDLING
// ===========================================

// 404 handler
app.use((req, res) => {
    res.status(404).render('404');
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
    });
});

// ===========================================
// START SERVER
// ===========================================

async function startServer() {
    try {
        // Initialize database
        await db.initialize();
        console.log('✅ Database initialized');

        // Start listening
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📧 Email notifications: ${process.env.SMTP_HOST ? 'Configured' : 'Not configured'}`);
            console.log(`📱 WhatsApp notifications: ${process.env.TWILIO_ACCOUNT_SID ? 'Configured' : 'Not configured'}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
