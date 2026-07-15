// db.js
require('dotenv').config();
const { Pool } = require('pg');

// Initialize the database connection pool using the Vercel connection string
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    // Vercel Postgres requires SSL connections
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = pool;