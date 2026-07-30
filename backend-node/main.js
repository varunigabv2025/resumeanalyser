/**
 * Main Express application for the Trust Score module.
 */

const express = require('express');
const trustRoutes = require('./routes/trust');

// Create Express app
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());

// Include trust score routes
app.use('/', trustRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Trust Score API is running',
    version: '1.0.0',
    endpoints: {
      trust_score: '/trust/:username'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Trust Score API is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT}/health to check status`);
});

module.exports = app;
