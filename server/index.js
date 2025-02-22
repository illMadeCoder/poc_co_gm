const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');

// Middleware to parse JSON
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5174',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Basic route
app.get('/', (req, res) => {
  res.send('AI Assistant Backend Running 🚀');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
