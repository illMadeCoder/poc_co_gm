import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "apiTypes";

import { config as dotenvConfig } from "dotenv";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import { OpenAI } from "openai";
import http from "http";

dotenvConfig();
const app = express();
const PORT = 5000;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
);
app.use(express.json());

// http server
const server = http.createServer(app);

// configure socket.io
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// OpenAI Configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Receive prompt along with its unique ID from the client
  socket.on("send_prompt", async ({ id, prompt, mock }) => {
    // if (mock) {
    //   socket.emit("ai_response", suggestionMocks);
    //   console.log({ action: "returned mock data", data: suggestionMocks });
    //   return;
    // }
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "user", content: prompt },
          {
            role: "system",
            content:
              "You are overhearing a game master running a Tabletop RPG game, briefly predict and provide creative ideas for what the game master might say next. You are limited to 30 tokens.",
          },
        ],
        max_tokens: 30,
        temperature: 0.8,
      });

      // Emit response along with the original ID for client-side matching
      socket.emit("ai_response", {
        id,
        response: response.choices[0].message.content,
      });
    } catch (error) {
      console.error("error from OpenAI:", error);
      socket.emit("ai_response", {
        id,
        response: "Error generating suggestion.",
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
