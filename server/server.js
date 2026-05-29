require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = async () => {
  const conn = require('./config/db');
  await conn();
};

const ticketRoutes = require('./routes/ticketRoutes');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', authMiddleware, ticketRoutes);

// Simple Health Check Root route
app.get('/', (req, res) => {
  res.json({ message: 'Support CRM API is running' });
});

// Connect to Database and start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

async function startServer() {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}
startServer()

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    return server;
  } catch (error) {
    console.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

// Export app and start function for testing/verification purposes
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
