import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50mb' })); // Increase payload limit for base64 images
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: true },
});

// File paths
const MINIGAMES_PATH = path.join(__dirname, 'src', 'data', 'minigames.json');
const GAMES_PATH = path.join(__dirname, 'src', 'data', 'games.json');
const USERS_PATH = path.join(__dirname, 'src', 'data', 'users.json');

// Helper functions
const readJSON = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

const writeJSON = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
};

// Initialize files with default data if they're empty
const initializeData = () => {
  readJSON(GAMES_PATH);
  readJSON(MINIGAMES_PATH);
  readJSON(USERS_PATH);
};

// Initialize on startup
initializeData();

// ===== MINI GAMES API =====

// Get all mini games
app.get('/api/minigames', (req, res) => {
  const minigames = readJSON(MINIGAMES_PATH);
  res.json(minigames);
});

// Save all mini games
app.post('/api/minigames', (req, res) => {
  const minigames = req.body;
  if (!Array.isArray(minigames)) {
    return res.status(400).json({ error: 'Invalid data format. Expected an array.' });
  }
  const success = writeJSON(MINIGAMES_PATH, minigames);
  if (success) {
    res.json({ success: true, message: 'Mini games saved successfully' });
  } else {
    res.status(500).json({ error: 'Failed to save mini games' });
  }
});

// Update a specific mini game
app.put('/api/minigames/:id', (req, res) => {
  const { id } = req.params;
  const updatedGame = req.body;
  
  let minigames = readJSON(MINIGAMES_PATH);
  const index = minigames.findIndex(g => g.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Mini game not found' });
  }
  
  minigames[index] = { ...minigames[index], ...updatedGame, id };
  const success = writeJSON(MINIGAMES_PATH, minigames);
  
  if (success) {
    res.json({ success: true, game: minigames[index] });
  } else {
    res.status(500).json({ error: 'Failed to update mini game' });
  }
});

// Delete a mini game
app.delete('/api/minigames/:id', (req, res) => {
  const { id } = req.params;
  let minigames = readJSON(MINIGAMES_PATH);
  const filtered = minigames.filter(g => g.id !== id);
  
  if (filtered.length === minigames.length) {
    return res.status(404).json({ error: 'Mini game not found' });
  }
  
  const success = writeJSON(MINIGAMES_PATH, filtered);
  if (success) {
    res.json({ success: true, message: 'Mini game deleted successfully' });
  } else {
    res.status(500).json({ error: 'Failed to delete mini game' });
  }
});

// ===== PRODUCTS API =====

// Get all products
app.get('/api/products', (req, res) => {
  const products = readJSON(GAMES_PATH);
  res.json(products);
});

// Save all products
app.post('/api/products', (req, res) => {
  const products = req.body;
  if (!Array.isArray(products)) {
    return res.status(400).json({ error: 'Invalid data format. Expected an array.' });
  }
  const success = writeJSON(GAMES_PATH, products);
  if (success) {
    res.json({ success: true, message: 'Products saved successfully' });
  } else {
    res.status(500).json({ error: 'Failed to save products' });
  }
});

// ===== USERS API =====

// Get all users
app.get('/api/users', (req, res) => {
  const users = readJSON(USERS_PATH);
  res.json(users);
});

// Save all users
app.post('/api/users', (req, res) => {
  const users = req.body;
  if (!Array.isArray(users)) {
    return res.status(400).json({ error: 'Invalid data format. Expected an array.' });
  }
  const success = writeJSON(USERS_PATH, users);
  if (success) {
    res.json({ success: true, message: 'Users saved successfully' });
  } else {
    res.status(500).json({ error: 'Failed to save users' });
  }
});

let connectedUsers = 0;

io.on('connection', (socket) => {
  connectedUsers++;
  io.emit('user:count', connectedUsers);

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
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server listening on http://localhost:${PORT}`);
});
