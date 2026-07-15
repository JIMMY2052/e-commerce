// index.js
const express = require('express');
const cors = require('cors');
const path = require('path'); // <-- Add this line
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allows cross-origin requests
app.use(express.json()); // Parses incoming JSON payloads
app.use(express.static(path.join(__dirname, 'public')));



// GET endpoint to fetch all products
app.get('/api/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Database error:', err.message);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Start the server
// Local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

// Export for Vercel serverless deployment
module.exports = app;

// POST endpoint to add a new product
app.post('/api/products', async (req, res) => {
    // 1. Extract the data from the incoming request body
    const { name, description, price, image_url } = req.body;

    try {
        // 2. Insert the data into the database using parameterized queries ($1, $2, etc.)
        // This prevents SQL injection attacks!
        const result = await pool.query(
            'INSERT INTO products (name, description, price, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, description, price, image_url]
        );

        // 3. Send back the newly created product with a 201 (Created) status code
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Database error:', err.message);
        res.status(500).json({ error: 'Failed to add product' });
    }
});