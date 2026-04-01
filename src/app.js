const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

app.use(cors()); // allow requests from any domain

app.use(express.json()); // parse JSON in the request body
app.use(express.urlencoded({ extended: true })); // parse form-data

// Public routes (no token required)
app.use('/', authRoutes);

// Protected routes (authMiddleware checks the token before each request)
app.use('/file', authMiddleware, fileRoutes);

// Global error handler - the latest middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 The server is running on port ${PORT}`);
});