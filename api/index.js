const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Import routers
const reportsRouter = require('./reports');
const driverRouter = require('./driver');
const adminRouter = require('./admin');

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Routes - No /api prefix needed, Vercel handles that
app.use('/reports', reportsRouter);
app.use('/driver', driverRouter);
app.use('/admin', adminRouter);

// Export for Vercel
module.exports = app;
