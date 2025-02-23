require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cors({ origin: 'http://localhost:5174', credentials: true }));
app.use(express.json());

// http server
const server = http.createServer(app);

// configure socket.io
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5174',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// OpenAI Configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Receive prompt along with its unique ID from the client
  socket.on('send_prompt', async ({ id, prompt }) => {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'user', content: prompt },
          {
            role: 'system',
            content:
              'You are overhearing a game master running a Tabletop RPG game, briefly predict and provide creative ideas for what the game master might say next. You are limited to 20 tokens',
          },
        ],
        max_tokens: 20,
        temperature: 0.8,
      });

      // Emit response along with the original ID for client-side matching
      socket.emit('ai_response', { id, response: response.choices[0].message.content });
    } catch (error) {
      console.error('error from OpenAI:', error);
      socket.emit('ai_response', { id, response: 'Error generating suggestion.' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
