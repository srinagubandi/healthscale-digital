/**
 * Database Module
 * ===============
 * PostgreSQL connection and query helpers for Railway deployment.
 * 
 * Environment Variables Required:
 * - DATABASE_URL: PostgreSQL connection string (provided by Railway)
 */

const { Pool } = require('pg');

// Create connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

/**
 * Initialize database tables
 */
async function initialize() {
    const client = await pool.connect();
    
    try {
        // Create contact_submissions table
        await client.query(`
            CREATE TABLE IF NOT EXISTS contact_submissions (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(50),
                company VARCHAR(255),
                message TEXT NOT NULL,
                status VARCHAR(50) DEFAULT 'new',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create admin_users table
        await client.query(`
            CREATE TABLE IF NOT EXISTS admin_users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                email VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create notification_logs table
        await client.query(`
            CREATE TABLE IF NOT EXISTS notification_logs (
                id SERIAL PRIMARY KEY,
                submission_id INTEGER REFERENCES contact_submissions(id),
                type VARCHAR(50) NOT NULL,
                status VARCHAR(50) NOT NULL,
                details TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Database tables created/verified');
    } finally {
        client.release();
    }
}

/**
 * Execute a query
 */
async function query(text, params) {
    const start = Date.now();
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    if (process.env.NODE_ENV !== 'production') {
        console.log('Query executed:', { text: text.substring(0, 50), duration, rows: result.rowCount });
    }
    
    return result;
}

/**
 * Get a client from the pool for transactions
 */
async function getClient() {
    return pool.connect();
}

module.exports = {
    initialize,
    query,
    getClient,
    pool
};
