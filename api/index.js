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
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Routes
app.use('/api/reports', reportsRouter);
app.use('/api/driver', driverRouter);
app.use('/api/admin', adminRouter);

// Export for Vercel
module.exports = app;
