require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const ticketRoutes = require('./routes/ticketRoutes');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', authMiddleware, ticketRoutes);

// Health Check
app.get('/', (req, res) => {
  res.json({ message: 'Support CRM API is running' });
});

// Connect to Database and start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();

module.exports = { app };