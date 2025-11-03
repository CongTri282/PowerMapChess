import React, { useState, useEffect } from 'react';
import { useMultiplayer } from '../context/MultiplayerContext';
import GameGuide from './GameGuide';

interface LobbyProps {
  onStartGame: () => void;
}

export const MultiplayerLobby: React.FC<LobbyProps> = ({ onStartGame }) => {
  const {
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
    sendMessage,
    refreshRooms
  } = useMultiplayer();

  const [screen, setScreen] = useState<'menu' | 'create' | 'join' | 'room'>('menu');
  const [playerName, setPlayerName] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [showGuide, setShowGuide] = useState(false);

  const isHost = currentRoom?.host === myPlayer?.socketId;
  const allPlayersReady = currentRoom?.players.every(p => p.ready) && currentRoom.players.length >= 2;

  useEffect(() => {
    if (currentRoom) {
      setScreen('room');
    }
  }, [currentRoom]);

  useEffect(() => {
    if (screen === 'join') {
      refreshRooms();
      const interval = setInterval(refreshRooms, 3000);
      return () => clearInterval(interval);
    }
  }, [screen, refreshRooms]);

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      alert('Vui lòng nhập tên!');
      return;
    }
    createRoom(playerName, 30); // Default max 30 players
  };

  const handleJoinRoom = (roomId: string) => {
    if (!playerName.trim()) {
      alert('Vui lòng nhập tên!');
      return;
    }
    joinRoom(roomId, playerName);
  };

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      sendMessage(chatInput);
      setChatInput('');
    }
  };

  const handleStartGame = () => {
    console.log('Start game clicked!', { allPlayersReady, isHost, isStarted: currentRoom?.isStarted });
    
    if (!isHost) {
      alert('Chỉ chủ phòng mới có thể bắt đầu trò chơi!');
      return;
    }
    
    if (!allPlayersReady) {
      alert('Tất cả người chơi phải sẵn sàng!');
      return;
    }
    
    if (currentRoom?.isStarted) {
      console.log('Game already started, ignoring');
      return;
    }
    
    console.log('Starting game...');
    onStartGame();
  };

  if (!isConnected) {
    return (
      <div className="lobby-screen">
        <div className="lobby-container">
          <div className="connecting">
            <div className="spinner"></div>
            <h2>Đang kết nối đến server...</h2>
          </div>
        </div>
      </div>
    );
  }

  // Menu screen
  if (screen === 'menu') {
    return (
      <div className="lobby-screen">
        <div className="lobby-container">
          <h1>🌐 Multiplayer Mode</h1>
          <p className="subtitle">Chơi cùng bạn bè từ nhiều máy khác nhau!</p>

          <div className="name-input">
            <input
              type="text"
              placeholder="Nhập tên của bạn..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={20}
            />
          </div>

          <div className="menu-buttons">
            <button 
              className="menu-btn create"
              onClick={() => setScreen('create')}
              disabled={!playerName.trim()}
            >
              🎮 Tạo phòng mới
            </button>
            <button 
              className="menu-btn join"
              onClick={() => setScreen('join')}
              disabled={!playerName.trim()}
            >
              🚪 Tham gia phòng
            </button>
            <button 
              className="menu-btn guide"
              onClick={() => setShowGuide(true)}
            >
              📖 Hướng dẫn chơi
            </button>
          </div>
        </div>

        <GameGuide isOpen={showGuide} onClose={() => setShowGuide(false)} />
        <style>{lobbyStyles}</style>
      </div>
    );
  }

  // Create room screen
  if (screen === 'create') {
    return (
      <div className="lobby-screen">
        <div className="lobby-container">
          <button style={{ color: "#000" }} className="back-btn" onClick={() => setScreen("menu")}>
            ← Quay lại
          </button>

          <h1>Tạo phòng mới</h1>

          <div className="form-group">
            <label>Tên người chơi:</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={20}
              placeholder="Nhập tên của bạn..."
            />
          </div>

          <p className="info-text">
            💡 Số lượng người chơi trong game sẽ được tạo tự động dựa trên số người tham gia phòng.
          </p>

          <button className="create-btn" onClick={handleCreateRoom}>
            Tạo phòng
          </button>
        </div>

        <style>{lobbyStyles}</style>
      </div>
    );
  }

  // Join room screen
  if (screen === 'join') {
    return (
      <div className="lobby-screen">
        <div className="lobby-container wide">
          <button style={{ color: "#000" }} className="back-btn" onClick={() => setScreen("menu")}>
            ← Quay lại
          </button>

          <h1>Danh sách phòng</h1>

          {availableRooms.length === 0 ? (
            <div className="no-rooms">
              <p>Chưa có phòng nào. Hãy tạo phòng mới!</p>
            </div>
          ) : (
            <div className="rooms-grid">
              {availableRooms.map((room) => (
                <div key={room.id} className="room-card">
                  <div className="room-header">
                    <h3>🎮 {room.name}</h3>
                    <span className="room-id">#{room.id}</span>
                  </div>
                  <div className="room-info">
                    <div className="info-item">
                      <span>👥 Người chơi:</span>
                      <strong>{room.players.length} người</strong>
                    </div>
                    <div className="info-item">
                      <span>👑 Host:</span>
                      <strong>{room.players.find((p) => p.socketId === room.host)?.name}</strong>
                    </div>
                  </div>
                  <button
                    className="join-btn"
                    onClick={() => handleJoinRoom(room.id)}
                    disabled={room.players.length >= room.maxPlayers}
                  >
                    {room.players.length >= room.maxPlayers ? "Đầy" : "Tham gia"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <style>{lobbyStyles}</style>
      </div>
    );
  }

  // Don't render lobby if game has started
  if (currentRoom?.isStarted) {
    return null;
  }

  // Room screen
  if (screen === 'room' && currentRoom) {
    return (
      <div className="lobby-screen">
        <div className="room-container">
          <div className="room-sidebar">
            <div className="room-header-info">
              <h2>Phòng #{currentRoom.id}</h2>
              {isHost && <span className="host-badge">👑 Host</span>}
              <button className="leave-btn" onClick={leaveRoom}>Rời phòng</button>
            </div>

            <div className="players-section">
              <h3>Người chơi ({currentRoom.players.length} người)</h3>
              <div className="info-note">
                💡 Số lượng nhân vật trong game = Số người chơi tham gia
              </div>
              <div className="players-list-lobby">
                {currentRoom.players.map(player => (
                  <div 
                    key={player.id} 
                    className={`player-card-lobby ${player.socketId === myPlayer?.socketId ? 'me' : ''}`}
                  >
                    <div className="player-info-lobby">
                      <span className="player-name-lobby">
                        {player.socketId === currentRoom.host && '👑 '}
                        {player.name}
                        {player.socketId === myPlayer?.socketId && ' (Bạn)'}
                      </span>
                      <span className="player-role">{player.type} - {player.capitalType}</span>
                    </div>
                    <span className={`ready-status ${player.ready ? 'ready' : 'not-ready'}`}>
                      {player.ready ? '✓ Sẵn sàng' : '○ Chờ'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {myPlayer && (
              <div className="player-controls">
                <div className="role-selector">
                  <label>Vai trò:</label>
                  <select
                    value={myPlayer.type}
                    onChange={(e) => selectPlayerType(e.target.value, myPlayer.capitalType)}
                  >
                    <option value="BANK">Ngân hàng/Quỹ</option>
                    <option value="ENTERPRISE">Doanh nghiệp</option>
                    <option value="GOVERNMENT">Chính phủ</option>
                  </select>
                </div>

                <div className="capital-selector">
                  <label>Nguồn vốn:</label>
                  <select
                    value={myPlayer.capitalType}
                    onChange={(e) => selectPlayerType(myPlayer.type, e.target.value)}
                  >
                    <option value="DOMESTIC">Trong nước</option>
                    <option value="FOREIGN">Nước ngoài</option>
                  </select>
                </div>

                <button
                  className={`ready-btn ${myPlayer.ready ? 'ready' : ''}`}
                  onClick={toggleReady}
                >
                  {myPlayer.ready ? '✓ Sẵn sàng' : 'Sẵn sàng'}
                </button>
              </div>
            )}

            {isHost && (
              <button
                className="start-game-btn"
                onClick={handleStartGame}
                disabled={!allPlayersReady || currentRoom.isStarted}
              >
                {currentRoom.isStarted ? '⏳ Đang bắt đầu...' : allPlayersReady ? '🚀 Bắt đầu trò chơi' : 'Chờ tất cả sẵn sàng...'}
              </button>
            )}
          </div>

          <div className="chat-section">
            <h3>💬 Chat</h3>
            <div className="chat-messages">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className="chat-message">
                  <span className="chat-sender">{msg.playerName}:</span>
                  <span className="chat-text">{msg.message}</span>
                  <span className="chat-time">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage}>Gửi</button>
            </div>
          </div>
        </div>

        <style>{lobbyStyles}</style>
      </div>
    );
  }

  return null;
};

const lobbyStyles = `
  .lobby-screen {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
  }

  .lobby-container {
    background: white;
    border-radius: 24px;
    padding: 48px;
    max-width: 500px;
    width: 100%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }

  .lobby-container.wide {
    max-width: 900px;
  }

  .lobby-container h1 {
    margin: 0 0 12px 0;
    font-size: 32px;
    color: #1f2937;
    text-align: center;
  }

  .subtitle {
    text-align: center;
    color: #6b7280;
    margin: 0 0 32px 0;
  }

  .connecting {
    text-align: center;
    padding: 40px;
  }

  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f4f6;
    border-top-color: #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .name-input {
    margin-bottom: 32px;
  }

  .name-input input {
    width: 100%;
    padding: 16px;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    font-size: 16px;
    text-align: center;
    color: #1f2937;
    background: white;
  }

  .name-input input::placeholder {
    color: #9ca3af;
  }

  .name-input input:focus {
    outline: none;
    border-color: #667eea;
  }

  .menu-buttons {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .menu-btn {
    padding: 20px;
    border: none;
    border-radius: 12px;
    font-size: 18px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s;
  }

  .menu-btn.create {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
  }

  .menu-btn.join {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
  }

  .menu-btn.guide {
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    color: white;
  }

  .menu-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  .menu-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .back-btn {
    background: #f3f4f6;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 20px;
    font-weight: 600;
  }

  .back-btn:hover {
    background: #e5e7eb;
  }

  .form-group {
    margin-bottom: 24px;
  }

  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #374151;
  }

  .form-group input[type="text"] {
    width: 100%;
    padding: 12px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 16px;
    color: #1f2937;
    background: white;
  }

  .form-group input[type="text"]::placeholder {
    color: #9ca3af;
  }

  .form-group input[type="text"]:focus {
    outline: none;
    border-color: #667eea;
  }

  .form-group input[type="range"] {
    width: 100%;
  }

  .range-value {
    display: inline-block;
    margin-top: 8px;
    padding: 8px 16px;
    background: #ede9fe;
    color: #5b21b6;
    border-radius: 16px;
    font-weight: 700;
  }

  .info-text {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    padding: 16px;
    border-radius: 12px;
    border-left: 4px solid #3b82f6;
    color: #1e40af;
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 24px;
  }

  .create-btn {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 18px;
    font-weight: 700;
    cursor: pointer;
  }

  .create-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(16, 185, 129, 0.4);
  }

  .no-rooms {
    text-align: center;
    padding: 60px 20px;
    color: #6b7280;
  }

  .rooms-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    max-height: 500px;
    overflow-y: auto;
  }

  .room-card {
    background: #f9fafb;
    border-radius: 12px;
    padding: 20px;
    border: 2px solid #e5e7eb;
    transition: all 0.2s;
  }

  .room-card:hover {
    border-color: #667eea;
    transform: translateY(-2px);
  }

  .room-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .room-header h3 {
    margin: 0;
    font-size: 18px;
    color: #1f2937;
  }

  .room-id {
    background: #ede9fe;
    color: #5b21b6;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 700;
  }

  .room-info {
    margin-bottom: 16px;
  }

  .info-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 14px;
    color: #6b7280;
  }

  .join-btn {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 700;
    cursor: pointer;
  }

  .join-btn:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  .join-btn:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }

  .room-container {
    background: white;
    border-radius: 24px;
    max-width: 1200px;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 350px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }

  .room-sidebar {
    padding: 32px;
  }

  .room-header-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
  }

  .room-header-info h2 {
    margin: 0;
    font-size: 24px;
  }

  .host-badge {
    background: #fef3c7;
    color: #92400e;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 700;
  }

  .leave-btn {
    padding: 8px 16px;
    background: #fee2e2;
    color: #991b1b;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
  }

  .leave-btn:hover {
    background: #fecaca;
  }

  .players-section h3 {
    margin: 0 0 16px 0;
    font-size: 18px;
  }

  .info-note {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    padding: 12px;
    border-radius: 8px;
    border-left: 3px solid #3b82f6;
    color: #1e40af;
    font-size: 13px;
    margin-bottom: 16px;
    line-height: 1.5;
  }

  .players-list-lobby {
    max-height: 300px;
    overflow-y: auto;
    margin-bottom: 24px;
  }

  .player-card-lobby {
    background: #f9fafb;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .player-card-lobby.me {
    background: #ede9fe;
    border: 2px solid #8b5cf6;
  }

  .player-info-lobby {
    flex: 1;
  }

  .player-name-lobby {
    display: block;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 4px;
  }

  .player-role {
    font-size: 12px;
    color: #6b7280;
  }

  .ready-status {
    padding: 6px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 700;
  }

  .ready-status.ready {
    background: #d1fae5;
    color: #065f46;
  }

  .ready-status.not-ready {
    background: #fee2e2;
    color: #991b1b;
  }

  .player-controls {
    background: #f9fafb;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 20px;
  }

  .role-selector, .capital-selector {
    margin-bottom: 16px;
  }

  .role-selector label, .capital-selector label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #374151;
    font-size: 14px;
  }

  .role-selector select, .capital-selector select {
    width: 100%;
    padding: 10px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    color: #1f2937;
    background: white;
    cursor: pointer;
  }

  .role-selector select:focus, .capital-selector select:focus {
    outline: none;
    border-color: #667eea;
  }

  .ready-btn {
    width: 100%;
    padding: 14px;
    border: 2px solid #10b981;
    background: white;
    color: #10b981;
    border-radius: 8px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
  }

  .ready-btn.ready {
    background: #10b981;
    color: white;
  }

  .ready-btn:hover {
    transform: translateY(-2px);
  }

  .start-game-btn {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 18px;
    font-weight: 700;
    cursor: pointer;
  }

  .start-game-btn:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }

  .start-game-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(245, 158, 11, 0.4);
  }

  .chat-section {
    background: #f9fafb;
    padding: 32px;
    display: flex;
    flex-direction: column;
  }

  .chat-section h3 {
    margin: 0 0 16px 0;
    font-size: 18px;
  }

  .chat-messages {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 16px;
    min-height: 400px;
    max-height: 500px;
  }

  .chat-message {
    margin-bottom: 12px;
    padding: 12px;
    background: white;
    border-radius: 8px;
  }

  .chat-sender {
    font-weight: 700;
    color: #1f2937;
    margin-right: 8px;
  }

  .chat-text {
    color: #4b5563;
  }

  .chat-time {
    display: block;
    font-size: 11px;
    color: #9ca3af;
    margin-top: 4px;
  }

  .chat-input {
    display: flex;
    gap: 8px;
  }

  .chat-input input {
    flex: 1;
    padding: 12px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    color: #1f2937;
    background: white;
  }

  .chat-input input::placeholder {
    color: #9ca3af;
  }

  .chat-input input:focus {
    outline: none;
    border-color: #667eea;
  }

  .chat-input button {
    padding: 12px 24px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 700;
    cursor: pointer;
  }

  .chat-input button:hover {
    background: #5568d3;
  }
`;
