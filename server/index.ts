import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST']
  }
});

// Game rooms storage
interface Player {
  id: string;
  socketId: string;
  name: string;
  type: string;
  capitalType: string;
  ready: boolean;
}

interface GameRoom {
  id: string;
  name: string;
  host: string;
  players: Player[];
  maxPlayers: number;
  gameState: any;
  isStarted: boolean;
  createdAt: number;
}

const rooms = new Map<string, GameRoom>();
const playerRooms = new Map<string, string>(); // socketId -> roomId

// Generate room ID
function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Create room
  socket.on('create-room', (data: { playerName: string; maxPlayers: number }) => {
    const roomId = generateRoomId();
    const room: GameRoom = {
      id: roomId,
      name: `Room ${roomId}`,
      host: socket.id,
      players: [{
        id: `player_${socket.id}`,
        socketId: socket.id,
        name: data.playerName,
        type: 'GOVERNMENT',
        capitalType: 'DOMESTIC',
        ready: false
      }],
      maxPlayers: data.maxPlayers || 20,
      gameState: null,
      isStarted: false,
      createdAt: Date.now()
    };

    rooms.set(roomId, room);
    playerRooms.set(socket.id, roomId);
    socket.join(roomId);

    socket.emit('room-created', { roomId, room });
    io.emit('rooms-updated', Array.from(rooms.values()).filter(r => !r.isStarted));
    
    console.log(`Room ${roomId} created by ${data.playerName}`);
  });

  // Join room
  socket.on('join-room', (data: { roomId: string; playerName: string }) => {
    const room = rooms.get(data.roomId);
    
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    // Check if game already started - don't allow new joins
    if (room.isStarted) {
      socket.emit('error', { message: 'Game already started' });
      return;
    }

    if (room.players.length >= room.maxPlayers) {
      socket.emit('error', { message: 'Room is full' });
      return;
    }

    const player: Player = {
      id: `player_${socket.id}`,
      socketId: socket.id,
      name: data.playerName,
      type: 'BANK',
      capitalType: 'DOMESTIC',
      ready: false
    };

    room.players.push(player);
    playerRooms.set(socket.id, data.roomId);
    socket.join(data.roomId);

    socket.emit('room-joined', { room });
    io.to(data.roomId).emit('player-joined', { player, room });
    io.emit('rooms-updated', Array.from(rooms.values()).filter(r => !r.isStarted));

    console.log(`${data.playerName} joined room ${data.roomId}`);
  });

  // Get room list
  socket.on('get-rooms', () => {
    const availableRooms = Array.from(rooms.values()).filter(r => !r.isStarted);
    socket.emit('rooms-list', availableRooms);
  });

  // Player ready toggle
  socket.on('toggle-ready', () => {
    const roomId = playerRooms.get(socket.id);
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    const player = room.players.find(p => p.socketId === socket.id);
    if (player) {
      player.ready = !player.ready;
      io.to(roomId).emit('room-updated', { room });
      
      // Check if all players ready
      const allReady = room.players.every(p => p.ready);
      if (allReady && room.players.length >= 2) {
        io.to(roomId).emit('all-players-ready');
      }
    }
  });

  // Select player type
  socket.on('select-player-type', (data: { type: string; capitalType: string }) => {
    const roomId = playerRooms.get(socket.id);
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    const player = room.players.find(p => p.socketId === socket.id);
    if (player) {
      player.type = data.type;
      player.capitalType = data.capitalType;
      io.to(roomId).emit('room-updated', { room });
    }
  });

  // Start game
  socket.on('start-game', (initialState: any) => {
    const roomId = playerRooms.get(socket.id);
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    if (room.host !== socket.id) {
      socket.emit('error', { message: 'Only host can start game' });
      return;
    }

    if (room.isStarted) {
      console.log(`Game already started in room ${roomId}, ignoring duplicate start request`);
      return;
    }

    room.isStarted = true;
    room.gameState = initialState;
    
    io.to(roomId).emit('game-started', { gameState: initialState });
    io.emit('rooms-updated', Array.from(rooms.values()).filter(r => !r.isStarted));
    
    console.log(`Game started in room ${roomId}`);
  });

  // Perform action
  socket.on('perform-action', (action: any) => {
    const roomId = playerRooms.get(socket.id);
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    // Broadcast action to all players in room
    io.to(roomId).emit('action-performed', { action, socketId: socket.id });
    
    console.log(`Action performed in room ${roomId}:`, action.type);
  });

  // Update game state
  socket.on('update-game-state', (gameState: any) => {
    const roomId = playerRooms.get(socket.id);
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    room.gameState = gameState;
    
    // Broadcast to all except sender
    socket.to(roomId).emit('game-state-updated', { gameState });
  });

  // Next turn
  socket.on('next-turn', () => {
    const roomId = playerRooms.get(socket.id);
    if (!roomId) return;

    io.to(roomId).emit('turn-advanced');
  });

  // Trigger event
  socket.on('trigger-event', (event: any) => {
    const roomId = playerRooms.get(socket.id);
    if (!roomId) return;

    io.to(roomId).emit('event-triggered', { event });
  });

  // Event option selected
  socket.on('select-event-option', (data: { eventId: string; optionId: string }) => {
    const roomId = playerRooms.get(socket.id);
    if (!roomId) return;

    io.to(roomId).emit('event-option-selected', data);
  });

  // Chat message
  socket.on('send-message', (message: string) => {
    const roomId = playerRooms.get(socket.id);
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    const player = room.players.find(p => p.socketId === socket.id);
    if (!player) return;

    io.to(roomId).emit('chat-message', {
      playerName: player.name,
      message,
      timestamp: Date.now()
    });
  });

  // Leave room
  socket.on('leave-room', () => {
    handlePlayerLeave(socket.id);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    handlePlayerLeave(socket.id);
  });

  function handlePlayerLeave(socketId: string) {
    const roomId = playerRooms.get(socketId);
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    const playerIndex = room.players.findIndex(p => p.socketId === socketId);
    if (playerIndex !== -1) {
      const player = room.players[playerIndex];
      
      // Remove player from room
      room.players.splice(playerIndex, 1);
      
      console.log(`${player.name} left room ${roomId}`);

      // If room is empty, delete it
      if (room.players.length === 0) {
        rooms.delete(roomId);
        console.log(`Room ${roomId} deleted (empty)`);
      } else {
        // If host left, assign new host
        if (room.host === socketId) {
          room.host = room.players[0].socketId;
          io.to(roomId).emit('new-host', { hostId: room.host });
        }
        
        io.to(roomId).emit('player-left', { playerId: player.id, room });
      }

      io.emit('rooms-updated', Array.from(rooms.values()).filter(r => !r.isStarted));
    }

    playerRooms.delete(socketId);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    rooms: rooms.size,
    players: playerRooms.size
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Multiplayer server running on port ${PORT}`);
  console.log(`📡 WebSocket ready for connections`);
});
