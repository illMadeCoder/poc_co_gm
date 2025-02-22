require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:5174', credentials: true }));
app.use(express.json());

// OpenAI Configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Route to handle AI suggestions
app.post('/api/suggest', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    res.json({ suggestion: response.choices[0].message.content });
  } catch (error) {
    console.error('Error from OpenAI:', error);
    res.status(500).json({ error: 'Failed to get AI suggestion.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
