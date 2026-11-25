require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const foodRoutes = require('./routes/foods');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static Files - serve frontend
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// System health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Online Food Ordering System (OFOS) API',
    version: '1.0.0',
    database: 'Ready (Multi-tier: Auto / Persistent / MySQL / MongoDB)'
  });
});

// Single Page fallback for clean URL navigation if needed
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Start Server with graceful fallback
function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`=======================================================`);
    console.log(`🚀 ONLINE FOOD ORDERING SYSTEM Backend Running!`);
    console.log(`📍 Web Dashboard:  http://localhost:${port}`);
    console.log(`📍 Customer Login: http://localhost:${port}/index.html`);
    console.log(`📍 Admin Panel:    http://localhost:${port}/admin.html`);
    console.log(`📍 API Health:     http://localhost:${port}/api/health`);
    console.log(`=======================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${port} is in use, attempting port ${Number(port) + 1}...`);
      startServer(Number(port) + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(PORT);
