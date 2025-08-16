const express = require('express');
const cors = require('cors');
const db = require('./database.js');

require('dotenv').config();

const { router: authRoutes } = require('./auth'); // Destructure to get just the router
const apiRoutes = require('./routes'); // Import main router

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); // Now authRoutes is the actual router
app.use('/api', apiRoutes); // Use main router

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Сервер працює!' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Помилка сервера:', err);
  res.status(500).json({ error: 'Внутрішня помилка сервера' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на порті ${PORT}`);
});