const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { connectToDatabase } = require('./db');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Admin Registration (First admin only, or by super admin)
router.post('/admin/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const { Admin } = await connectToDatabase();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = new Admin({
      email,
      password: hashedPassword,
      name,
      role: 'admin',
    });

    await admin.save();

    // Generate token
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ error: 'Failed to register admin' });
  }
});

// Admin Login
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { Admin } = await connectToDatabase();

    // Find admin
    const admin = await Admin.findOne({ email, isActive: true });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Paramedic Registration (Admin creates paramedic accounts)
router.post('/paramedic/register', async (req, res) => {
  try {
    const { email, password, name, phone, ambulanceId, stationId } = req.body;
    const { Paramedic } = await connectToDatabase();

    // Check if paramedic already exists
    const existingParamedic = await Paramedic.findOne({ email });
    if (existingParamedic) {
      return res.status(400).json({ error: 'Paramedic with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create paramedic
    const paramedic = new Paramedic({
      email,
      password: hashedPassword,
      name,
      phone,
      ambulance: ambulanceId || null,
      station: stationId || null,
    });

    await paramedic.save();

    res.status(201).json({
      success: true,
      message: 'Paramedic registered successfully',
      paramedic: {
        id: paramedic._id,
        email: paramedic.email,
        name: paramedic.name,
        phone: paramedic.phone,
      },
    });
  } catch (error) {
    console.error('Paramedic registration error:', error);
    res.status(500).json({ error: 'Failed to register paramedic' });
  }
});

// Paramedic Login
router.post('/paramedic/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { Paramedic } = await connectToDatabase();

    // Find paramedic
    const paramedic = await Paramedic.findOne({ email, isActive: true })
      .populate('ambulance')
      .populate('station');
      
    if (!paramedic) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, paramedic.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { id: paramedic._id, email: paramedic.email, role: 'paramedic' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      paramedic: {
        id: paramedic._id,
        email: paramedic.email,
        name: paramedic.name,
        phone: paramedic.phone,
        ambulance: paramedic.ambulance,
        station: paramedic.station,
      },
    });
  } catch (error) {
    console.error('Paramedic login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Middleware to verify admin
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }
  next();
};

// Middleware to verify paramedic
const verifyParamedic = (req, res, next) => {
  if (req.user.role !== 'paramedic') {
    return res.status(403).json({ error: 'Access denied. Paramedic only.' });
  }
  next();
};

module.exports = { router, verifyToken, verifyAdmin, verifyParamedic };
