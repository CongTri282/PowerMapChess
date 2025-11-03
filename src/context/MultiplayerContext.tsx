import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import type { GameState, Action, GameEvent } from '../types';

interface MultiplayerPlayer {
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
  players: MultiplayerPlayer[];
  maxPlayers: number;
  gameState: GameState | null;
  isStarted: boolean;
  createdAt: number;
}

interface ChatMessage {
  playerName: string;
  message: string;
  timestamp: number;
}

interface MultiplayerContextType {
  socket: Socket | null;
  isConnected: boolean;
  currentRoom: GameRoom | null;
  availableRooms: GameRoom[];
  myPlayer: MultiplayerPlayer | null;
  chatMessages: ChatMessage[];
  createRoom: (playerName: string, maxPlayers: number) => void;
  joinRoom: (roomId: string, playerName: string) => void;
  leaveRoom: () => void;
  toggleReady: () => void;
  selectPlayerType: (type: string, capitalType: string) => void;
  startGame: (initialState: GameState) => void;
  performAction: (action: Action) => void;
  updateGameState: (gameState: GameState) => void;
  nextTurn: () => void;
  triggerEvent: (event: GameEvent) => void;
  selectEventOption: (eventId: string, optionId: string) => void;
  sendMessage: (message: string) => void;
  refreshRooms: () => void;
}

const MultiplayerContext = createContext<MultiplayerContextType | null>(null);

export const useMultiplayer = () => {
  const context = useContext(MultiplayerContext);
  if (!context) {
    throw new Error('useMultiplayer must be used within MultiplayerProvider');
  }
  return context;
};

interface MultiplayerProviderProps {
  children: React.ReactNode;
  serverUrl?: string;
  onGameStateUpdate?: (gameState: GameState) => void;
  onActionPerformed?: (action: Action) => void;
  onTurnAdvanced?: () => void;
  onEventTriggered?: (event: GameEvent) => void;
  onEventOptionSelected?: (eventId: string, optionId: string) => void;
  onGameStarted?: (gameState: GameState) => void;
}

export const MultiplayerProvider: React.FC<MultiplayerProviderProps> = ({
  children,
  serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001',
  onGameStateUpdate,
  onActionPerformed,
  onTurnAdvanced,
  onEventTriggered,
  onEventOptionSelected,
  onGameStarted
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<GameRoom | null>(null);
  const [availableRooms, setAvailableRooms] = useState<GameRoom[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const myPlayer = currentRoom?.players.find(p => p.socketId === socket?.id) || null;

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(serverUrl);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to multiplayer server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from multiplayer server');
      setIsConnected(false);
      setCurrentRoom(null);
    });

    // Room events
    newSocket.on('room-created', ({ room }) => {
      setCurrentRoom(room);
    });

    newSocket.on('room-joined', ({ room }) => {
      console.log('Room joined successfully:', room);
      setCurrentRoom(room);
    });

    newSocket.on('player-joined', ({ room }) => {
      setCurrentRoom(room);
    });

    newSocket.on('player-left', ({ room }) => {
      setCurrentRoom(room);
    });

    newSocket.on('room-updated', ({ room }) => {
      setCurrentRoom(room);
    });

    newSocket.on('rooms-list', (rooms: GameRoom[]) => {
      setAvailableRooms(rooms);
    });

    newSocket.on('rooms-updated', (rooms: GameRoom[]) => {
      setAvailableRooms(rooms);
    });

    newSocket.on('new-host', ({ hostId }) => {
      if (currentRoom) {
        setCurrentRoom({ ...currentRoom, host: hostId });
      }
    });

    // Game events
    newSocket.on('game-started', ({ gameState }) => {
      if (currentRoom) {
        setCurrentRoom({ ...currentRoom, isStarted: true, gameState });
      }
      onGameStarted?.(gameState);
    });

    newSocket.on('action-performed', ({ action }) => {
      onActionPerformed?.(action);
    });

    newSocket.on('game-state-updated', ({ gameState }) => {
      onGameStateUpdate?.(gameState);
    });

    newSocket.on('turn-advanced', () => {
      onTurnAdvanced?.();
    });

    newSocket.on('event-triggered', ({ event }) => {
      onEventTriggered?.(event);
    });

    newSocket.on('event-option-selected', ({ eventId, optionId }) => {
      onEventOptionSelected?.(eventId, optionId);
    });

    // Chat events
    newSocket.on('chat-message', (message: ChatMessage) => {
      setChatMessages(prev => [...prev, message]);
    });

    // Error handling
    newSocket.on('error', ({ message }) => {
      console.error('Server error:', message);
      alert(message);
    });

    return () => {
      newSocket.close();
    };
  }, [serverUrl]);

  // Methods
  const createRoom = useCallback((playerName: string, maxPlayers: number) => {
    localStorage.setItem('playerName', playerName);
    socket?.emit('create-room', { playerName, maxPlayers });
  }, [socket]);

  const joinRoom = useCallback((roomId: string, playerName: string) => {
    localStorage.setItem('playerName', playerName);
    socket?.emit('join-room', { roomId, playerName });
  }, [socket]);

  const leaveRoom = useCallback(() => {
    socket?.emit('leave-room');
    setCurrentRoom(null);
    setChatMessages([]);
    localStorage.removeItem('currentRoom');
    localStorage.removeItem('chatMessages');
    localStorage.removeItem('playerName');
  }, [socket]);

  const toggleReady = useCallback(() => {
    socket?.emit('toggle-ready');
  }, [socket]);

  const selectPlayerType = useCallback((type: string, capitalType: string) => {
    socket?.emit('select-player-type', { type, capitalType });
  }, [socket]);

  const startGame = useCallback((initialState: GameState) => {
    socket?.emit('start-game', initialState);
  }, [socket]);

  const performAction = useCallback((action: Action) => {
    socket?.emit('perform-action', action);
  }, [socket]);

  const updateGameState = useCallback((gameState: GameState) => {
    socket?.emit('update-game-state', gameState);
  }, [socket]);

  const nextTurn = useCallback(() => {
    socket?.emit('next-turn');
  }, [socket]);

  const triggerEvent = useCallback((event: GameEvent) => {
    socket?.emit('trigger-event', event);
  }, [socket]);

  const selectEventOption = useCallback((eventId: string, optionId: string) => {
    socket?.emit('select-event-option', { eventId, optionId });
  }, [socket]);

  const sendMessage = useCallback((message: string) => {
    socket?.emit('send-message', message);
  }, [socket]);

  const refreshRooms = useCallback(() => {
    socket?.emit('get-rooms');
  }, [socket]);

  const value: MultiplayerContextType = {
    socket,
    isConnected,
    currentRoom,
    availableRooms,
    myPlayer,
    chatMessages,
    createRoom,
    joinRoom,
    leaveRoom,
    toggleReady,
    selectPlayerType,
    startGame,
    performAction,
    updateGameState,
    nextTurn,
    triggerEvent,
    selectEventOption,
    sendMessage,
    refreshRooms
  };

  return (
    <MultiplayerContext.Provider value={value}>
      {children}
    </MultiplayerContext.Provider>
  );
};
