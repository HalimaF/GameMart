import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors({ origin: true, credentials: true }));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: true },
});

let connectedUsers = 0;

io.on('connection', (socket) => {
  connectedUsers++;
  io.emit('user:count', connectedUsers);
  console.log(`User connected. Total users: ${connectedUsers}`);

  socket.on('chat:message', (msg) => {
    const enriched = { 
      ...msg, 
      id: Date.now(),
      serverTimestamp: new Date().toISOString()
    };
    io.emit('chat:message', enriched);
  });

  socket.on('chat:typing', (data) => {
    socket.broadcast.emit('chat:typing', data);
  });

  socket.on('chat:stop-typing', (data) => {
    socket.broadcast.emit('chat:stop-typing', data);
  });

  socket.on('disconnect', () => {
    connectedUsers--;
    io.emit('user:count', connectedUsers);
    console.log(`User disconnected. Total users: ${connectedUsers}`);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server listening on http://localhost:${PORT}`);
});
