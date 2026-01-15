/**
 * Admin Routes
 * ============
 * Dashboard for viewing contact form submissions
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');

/**
 * Middleware: Check if user is authenticated
 */
function requireAuth(req, res, next) {
    if (req.session && req.session.adminId) {
        return next();
    }
    res.redirect('/admin/login');
}

/**
 * GET /admin/login
 * Show login page
 */
router.get('/login', (req, res) => {
    if (req.session && req.session.adminId) {
        return res.redirect('/admin');
    }
    res.render('admin/login', { error: null });
});

/**
 * POST /admin/login
 * Process login
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const result = await db.query(
            'SELECT * FROM admin_users WHERE username = $1',
            [username]
        );

        if (result.rows.length === 0) {
            return res.render('admin/login', { error: 'Invalid username or password' });
        }

        const user = result.rows[0];

        // Verify password
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return res.render('admin/login', { error: 'Invalid username or password' });
        }

        // Set session
        req.session.adminId = user.id;
        req.session.adminUsername = user.username;

        res.redirect('/admin');

    } catch (error) {
        console.error('Login error:', error);
        res.render('admin/login', { error: 'An error occurred. Please try again.' });
    }
});

/**
 * GET /admin/logout
 * Logout user
 */
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

/**
 * GET /admin
 * Dashboard - view all submissions
 */
router.get('/', requireAuth, async (req, res) => {
    try {
        const result = await db.query(
            `SELECT * FROM contact_submissions 
             ORDER BY created_at DESC`
        );

        res.render('admin/dashboard', {
            submissions: result.rows,
            username: req.session.adminUsername
        });

    } catch (error) {
        console.error('Dashboard error:', error);
        res.render('admin/dashboard', {
            submissions: [],
            username: req.session.adminUsername,
            error: 'Failed to load submissions'
        });
    }
});

/**
 * GET /admin/submission/:id
 * View single submission details
 */
router.get('/submission/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;

        // Get submission
        const submissionResult = await db.query(
            'SELECT * FROM contact_submissions WHERE id = $1',
            [id]
        );

        if (submissionResult.rows.length === 0) {
            return res.redirect('/admin');
        }

        // Get notification logs
        const logsResult = await db.query(
            'SELECT * FROM notification_logs WHERE submission_id = $1 ORDER BY created_at DESC',
            [id]
        );

        res.render('admin/submission', {
            submission: submissionResult.rows[0],
            logs: logsResult.rows,
            username: req.session.adminUsername
        });

    } catch (error) {
        console.error('Submission view error:', error);
        res.redirect('/admin');
    }
});

/**
 * POST /admin/submission/:id/status
 * Update submission status
 */
router.post('/submission/:id/status', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await db.query(
            `UPDATE contact_submissions 
             SET status = $1, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $2`,
            [status, id]
        );

        res.json({ success: true });

    } catch (error) {
        console.error('Status update error:', error);
        res.status(500).json({ success: false, message: 'Failed to update status' });
    }
});

/**
 * DELETE /admin/submission/:id
 * Delete a submission
 */
router.delete('/submission/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;

        // Delete notification logs first
        await db.query('DELETE FROM notification_logs WHERE submission_id = $1', [id]);
        
        // Delete submission
        await db.query('DELETE FROM contact_submissions WHERE id = $1', [id]);

        res.json({ success: true });

    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete submission' });
    }
});

/**
 * GET /admin/setup
 * Initial admin setup (only works if no admin exists)
 */
router.get('/setup', async (req, res) => {
    try {
        const result = await db.query('SELECT COUNT(*) FROM admin_users');
        if (parseInt(result.rows[0].count) > 0) {
            return res.redirect('/admin/login');
        }
        res.render('admin/setup', { error: null });
    } catch (error) {
        res.render('admin/setup', { error: 'Database not ready. Please try again.' });
    }
});

/**
 * POST /admin/setup
 * Create first admin user
 */
router.post('/setup', async (req, res) => {
    try {
        // Check if admin already exists
        const countResult = await db.query('SELECT COUNT(*) FROM admin_users');
        if (parseInt(countResult.rows[0].count) > 0) {
            return res.redirect('/admin/login');
        }

        const { username, password, email } = req.body;

        if (!username || !password) {
            return res.render('admin/setup', { error: 'Username and password are required' });
        }

        if (password.length < 8) {
            return res.render('admin/setup', { error: 'Password must be at least 8 characters' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create admin user
        await db.query(
            `INSERT INTO admin_users (username, password_hash, email)
             VALUES ($1, $2, $3)`,
            [username, passwordHash, email || null]
        );

        res.redirect('/admin/login');

    } catch (error) {
        console.error('Setup error:', error);
        res.render('admin/setup', { error: 'Failed to create admin user' });
    }
});

module.exports = router;
