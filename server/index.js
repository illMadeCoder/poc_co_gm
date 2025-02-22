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
    }});

// OpenAI Configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('send_prompt', async (prompt) => {
	try {
	    const response = await openai.chat.completions.create({
		model: 'gpt-4',
		messages: [{ role: 'user', content: prompt }]
	    });

	    socket.emit('ai_response', response.choices[0].message.content);
	} catch (error) {
	    console.error('error from OpenAI:', error);
	    socket.emit('ai_response', 'Error generating suggestion.');
	}
    });

    socket.on('disconnect', () => {
	console.log('Client disconnected:', socket.id);
    });
});

//Start Server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
