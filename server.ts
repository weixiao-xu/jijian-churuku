import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  // Track online users: socketId -> { userId, name, username }
  const onlineUsers = new Map<string, { id: string; name: string; username: string }>();
  // Simple message history storage
  const messageHistory: any[] = [];

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("user:login", (user) => {
      onlineUsers.set(socket.id, user);
      // Broadcast updated online list
      io.emit("users:online", Array.from(onlineUsers.values()));
      
      // Send history relevant to this user
      const userHistory = messageHistory.filter(m => m.fromId === user.id || m.toId === user.id);
      socket.emit("message:history", userHistory);
    });

    socket.on("message:send", (message) => {
      // Store in history
      messageHistory.push(message);
      // Keep only last 500 messages to prevent memory issues
      if (messageHistory.length > 500) messageHistory.shift();

      // Forward message to the specific recipient
      const recipientSocketId = Array.from(onlineUsers.entries())
        .find(([_, u]) => u.id === message.toId)?.[0];
      
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("message:receive", message);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      onlineUsers.delete(socket.id);
      io.emit("users:online", Array.from(onlineUsers.values()));
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
