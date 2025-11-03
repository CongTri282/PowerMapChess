import { useReducer, useState, useEffect, useRef } from 'react';
import { MultiplayerProvider, useMultiplayer } from './context/MultiplayerContext';
import { MultiplayerLobby } from './components/MultiplayerLobby';
import { PowerMap } from './components/PowerMap';
import { ActionPanel } from './components/ActionPanel';
import { Dashboard } from './components/Dashboard';
import { AnalysisPanel } from './components/AnalysisPanel';
import { EventCard } from './components/EventCard';
import GameGuide from './components/GameGuide';
import { gameReducer, initialGameState, analyzeAction } from './context/GameContext';
import { createSamplePlayers } from './utils/playerUtils';
import { getRandomEvent, calculateEventImpact } from './utils/events';
import type { Player, Action, AIAnalysis, GameEvent, GameState } from './types';
import './App.css';

function MultiplayerGame() {
  const multiplayer = useMultiplayer();
  
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<AIAnalysis | null>(null);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [showGuide, setShowGuide] = useState(false);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [multiplayer.chatMessages]);

  // Listen for game start from server
  useEffect(() => {
    if (multiplayer.currentRoom?.isStarted && multiplayer.currentRoom.gameState && !gameStarted) {
      console.log('Game started! Initializing state...');
      const serverGameState = multiplayer.currentRoom.gameState;
      
      // Initialize game with server state
      dispatch({ type: 'INIT_GAME', payload: { players: serverGameState.players } });
      setGameStarted(true);
      setIsStarting(false);
      
      // Assign my player
      if (multiplayer.myPlayer) {
        const myGamePlayer = serverGameState.players.find(
          p => p.name === multiplayer.myPlayer?.name
        );
        if (myGamePlayer) {
          setSelectedPlayer(myGamePlayer);
        }
      }
    }
  }, [multiplayer.currentRoom, multiplayer.myPlayer, gameStarted]);

  // Update selected player when game state changes
  useEffect(() => {
    if (selectedPlayer && gameState.players.length > 0) {
      const updatedPlayer = gameState.players.find(p => p.id === selectedPlayer.id);
      if (updatedPlayer) {
        setSelectedPlayer(updatedPlayer);
        localStorage.setItem('selectedPlayerId', updatedPlayer.id);
      }
    }
  }, [gameState.players, selectedPlayer]);

  // Restore selected player on mount if gameStarted
  useEffect(() => {
    if (gameStarted && !selectedPlayer && gameState.players.length > 0) {
      const savedPlayerId = localStorage.getItem('selectedPlayerId');
      const savedPlayerName = localStorage.getItem('playerName');
      
      if (savedPlayerId) {
        const player = gameState.players.find(p => p.id === savedPlayerId);
        if (player) {
          setSelectedPlayer(player);
          return;
        }
      }
      
      if (savedPlayerName) {
        const player = gameState.players.find(p => p.name === savedPlayerName);
        if (player) {
          setSelectedPlayer(player);
          localStorage.setItem('selectedPlayerId', player.id);
        }
      }
    }
  }, [gameStarted, selectedPlayer, gameState.players]);

  // Listen for multiplayer events
  useEffect(() => {
    if (!multiplayer.socket) return;

    const handleTurnAdvanced = () => {
      console.log('Turn advanced from server');
      dispatch({ type: 'NEXT_TURN' });
    };

    const handleActionPerformed = ({ action, socketId }: { action: Action; socketId: string }) => {
      // Don't apply action if it came from this client (already applied locally)
      if (socketId === multiplayer.socket?.id) {
        console.log('Ignoring own action echo');
        return;
      }
      
      console.log('Action performed by another player:', action);
      dispatch({ type: 'PERFORM_ACTION', payload: action });
      
      const analysis = analyzeAction(gameState, action);
      dispatch({
        type: 'UPDATE_METRICS',
        payload: {
          domesticControl: gameState.nationalMetrics.domesticControl + analysis.nationalImpact.domesticControlChange,
          economicSovereignty: gameState.nationalMetrics.economicSovereignty + analysis.nationalImpact.sovereigntyChange,
          monopolyLevel: gameState.nationalMetrics.monopolyLevel + analysis.nationalImpact.monopolyChange
        }
      });
    };

    const handleGameStateUpdated = ({ gameState: newState }: { gameState: GameState }) => {
      console.log('Game state updated from server');
      dispatch({ type: 'INIT_GAME', payload: { players: newState.players } });
    };

    const handleEventTriggered = ({ event }: { event: GameEvent }) => {
      console.log('Event triggered:', event);
      setCurrentEvent(event);
    };

    multiplayer.socket.on('turn-advanced', handleTurnAdvanced);
    multiplayer.socket.on('action-performed', handleActionPerformed);
    multiplayer.socket.on('game-state-updated', handleGameStateUpdated);
    multiplayer.socket.on('event-triggered', handleEventTriggered);

    return () => {
      multiplayer.socket?.off('turn-advanced', handleTurnAdvanced);
      multiplayer.socket?.off('action-performed', handleActionPerformed);
      multiplayer.socket?.off('game-state-updated', handleGameStateUpdated);
      multiplayer.socket?.off('event-triggered', handleEventTriggered);
    };
  }, [multiplayer.socket, gameState, dispatch]);

  // Start game as host
  const handleStartMultiplayerGame = () => {
    if (!multiplayer.currentRoom || !multiplayer.myPlayer) return;
    if (isStarting || multiplayer.currentRoom.isStarted) {
      console.log('Game already starting or started');
      return;
    }

    setIsStarting(true);
    console.log('Starting game...');

    // Create players based ONLY on lobby players (no AI fill)
    const numRealPlayers = multiplayer.currentRoom.players.length;
    const allPlayers = createSamplePlayers(numRealPlayers);
    
    // Map real players to their game entities
    const players = multiplayer.currentRoom.players.map((lobbyPlayer, idx) => {
      return {
        ...allPlayers[idx],
        id: lobbyPlayer.id,
        name: lobbyPlayer.name,
        // Keep player type selection from lobby
        type: lobbyPlayer.type as any,
        capitalType: lobbyPlayer.capitalType as any
      };
    });

    const initialState: GameState = {
      ...initialGameState,
      players
    };

    dispatch({ type: 'INIT_GAME', payload: { players } });
    multiplayer.startGame(initialState);
  };

  // Handle action performance
  const handlePerformAction = (action: Action) => {
    // Check if player has already acted this turn
    if (currentPlayer && gameState.playersActedThisTurn.includes(currentPlayer.id)) {
      alert(`Bạn đã thực hiện hành động trong lượt này! Chờ lượt tiếp theo.`);
      return;
    }
    
    const analysis = analyzeAction(gameState, action);
    
    // Apply action locally for immediate feedback
    dispatch({ type: 'PERFORM_ACTION', payload: action });
    
    // Broadcast to other players (they will receive via action-performed event)
    multiplayer.performAction(action);
    
    setCurrentAnalysis(analysis);
    
    dispatch({
      type: 'UPDATE_METRICS',
      payload: {
        domesticControl: gameState.nationalMetrics.domesticControl + analysis.nationalImpact.domesticControlChange,
        economicSovereignty: gameState.nationalMetrics.economicSovereignty + analysis.nationalImpact.sovereigntyChange,
        monopolyLevel: gameState.nationalMetrics.monopolyLevel + analysis.nationalImpact.monopolyChange
      }
    });
  };

  // Handle next turn
  const handleNextTurn = () => {
    console.log('Host clicked next turn, current turn:', gameState.currentTurn);
    // Don't dispatch locally - let the server broadcast to everyone including host
    multiplayer.nextTurn();
    
    // Trigger random event every 3 turns
    if ((gameState.currentTurn + 1) % 3 === 0) {
      const event = getRandomEvent();
      setCurrentEvent(event);
      multiplayer.triggerEvent(event);
    }
  };

  // Handle chat
  const handleSendChat = () => {
    if (chatInput.trim()) {
      multiplayer.sendMessage(chatInput);
      setChatInput('');
    }
  };

  const handleChatKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendChat();
    }
  };

  // Handle event option
  const handleEventOption = (optionId: string) => {
    if (!currentEvent) return;
    
    const impacts = calculateEventImpact(currentEvent, optionId);
    multiplayer.selectEventOption(currentEvent.id, optionId);
    
    impacts.forEach(impact => {
      if (impact.capitalChange || impact.powerChange) {
        dispatch({
          type: 'UPDATE_METRICS',
          payload: {
            domesticControl: gameState.nationalMetrics.domesticControl + (impact.powerChange || 0) * 0.5
          }
        });
      }
    });
    
    setCurrentEvent(null);
  };

  // Handle reset
  const handleReset = () => {
    dispatch({ type: 'RESET_GAME' });
    setGameStarted(false);
    setIsStarting(false);
    setSelectedPlayer(null);
    setCurrentAnalysis(null);
    setCurrentEvent(null);
    multiplayer.leaveRoom();
  };

  // Show lobby if not in game
  if (!gameStarted || !multiplayer.currentRoom?.isStarted) {
    return <MultiplayerLobby onStartGame={handleStartMultiplayerGame} />;
  }

  const currentPlayer = selectedPlayer 
    ? gameState.players.find(p => p.id === selectedPlayer.id) || selectedPlayer
    : null;

  return (
    <div className="app">
      <header className="app-header">
        <h1>🗺️ Bản đồ Quyền lực Tài chính (Multiplayer)</h1>
        <div className="header-info">
          <span className="room-badge">Phòng: #{multiplayer.currentRoom?.id}</span>
          <span className="turn-badge">
            Lượt {gameState.currentTurn}/{gameState.maxTurns}
          </span>
          <span className="player-badge">
            Vai trò: {multiplayer.myPlayer?.name} ({multiplayer.myPlayer?.type})
          </span>
          <span
            className={`action-status ${
              gameState.playersActedThisTurn.includes(currentPlayer?.id || "") ? "acted" : "waiting"
            }`}
          >
            {gameState.playersActedThisTurn.includes(currentPlayer?.id || "") ? "✓ Đã hành động" : "⏳ Chưa hành động"}
          </span>
        </div>
        <div className="header-actions">
          <button className="header-btn guide" onClick={() => setShowGuide(true)}>
            📖 Hướng dẫn
          </button>
          {multiplayer.currentRoom?.host === multiplayer.myPlayer?.socketId && (
            <button className="header-btn" onClick={handleNextTurn}>
              ⏭️ Lượt tiếp theo ({gameState.playersActedThisTurn.length}/{gameState.players.length})
            </button>
          )}
          <button className="header-btn reset" onClick={handleReset}>
            🔄 Rời phòng
          </button>
        </div>
      </header>

      <GameGuide isOpen={showGuide} onClose={() => setShowGuide(false)} />

      <div className="game-layout">
        <div className="top-panel">
          <Dashboard
            metrics={gameState.nationalMetrics}
            currentTurn={gameState.currentTurn}
            maxTurns={gameState.maxTurns}
          />
        </div>

        <div className="bottom-layout">
          <div className="left-panel">
            {currentPlayer && multiplayer.myPlayer && (
              <div className="action-panel-container">
                <ActionPanel
                  player={currentPlayer}
                  allPlayers={gameState.players}
                  onPerformAction={handlePerformAction}
                  hasActed={gameState.playersActedThisTurn.includes(currentPlayer.id)}
                />
              </div>
            )}
          </div>

          <div className="center-panel">
            <PowerMap
              players={gameState.players}
              capitalFlows={gameState.capitalFlows}
              onPlayerSelect={(player) => {
                // Only select if it's your player
                if (player.name === multiplayer.myPlayer?.name) {
                  setSelectedPlayer(player);
                }
              }}
              selectedPlayer={currentPlayer || undefined}
            />
          </div>

          <div className="right-panel">
            <div className="players-list">
              <h3>Người chơi ({gameState.players.length})</h3>
              <div className="players-scroll">
                {gameState.players.map((player) => {
                  const isMyPlayer = player.name === multiplayer.myPlayer?.name;
                  return (
                    <div
                      key={player.id}
                      className={`player-item ${currentPlayer?.id === player.id ? "selected" : ""} ${
                        isMyPlayer ? "my-player" : ""
                      }`}
                      onClick={() => isMyPlayer && setSelectedPlayer(player)}
                      style={{ borderLeftColor: player.color }}
                    >
                      <div className="player-name">
                        {player.name}
                        {isMyPlayer && " 👤"}
                      </div>
                      <div className="player-power">
                        <div className="power-bar-small">
                          <div
                            className="power-fill-small"
                            style={{ width: `${player.power}%`, backgroundColor: player.color }}
                          />
                        </div>
                        <span>{player.power.toFixed(0)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="recent-actions">
              <h3>Hoạt động gần đây</h3>
              <div className="actions-scroll">
                {gameState.actions
                  .slice(-10)
                  .reverse()
                  .map((action) => (
                    <div key={action.id} className="action-item">
                      <div className="action-description">{action.description}</div>
                      <div className="action-time">{new Date(action.timestamp).toLocaleTimeString()}</div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="multiplayer-chat">
              <h3>💬 Chat ({multiplayer.chatMessages.length})</h3>
              <div ref={chatMessagesRef} className="chat-messages-mini">
                {multiplayer.chatMessages.slice(-10).map((msg, idx) => (
                  <div style={{ color: "#000" }} key={idx} className="chat-msg">
                    <strong>{msg.playerName}:</strong> {msg.message}
                  </div>
                ))}
                {multiplayer.chatMessages.length === 0 && <div className="chat-empty">Chưa có tin nhắn nào</div>}
              </div>
              <div className="chat-input-container">
                <input
                  type="text"
                  className="chat-input"
                  placeholder="Nhập tin nhắn..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={handleChatKeyPress}
                />
                <button className="chat-send-btn" onClick={handleSendChat}>
                  📤
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {currentAnalysis && <AnalysisPanel analysis={currentAnalysis} onClose={() => setCurrentAnalysis(null)} />}

      {currentEvent && (
        <EventCard event={currentEvent} onSelectOption={handleEventOption} onDismiss={() => setCurrentEvent(null)} />
      )}

      {gameState.isGameOver && (
        <div className="game-over-overlay">
          <div className="game-over-panel">
            <div className="game-over-header">
              <h1>🎉 Trò chơi kết thúc!</h1>
              <p className="game-over-subtitle">Đã hoàn thành {gameState.maxTurns} lượt chơi</p>
            </div>

            {/* Player Rankings */}
            <div className="rankings-section">
              <h3>🏆 Bảng xếp hạng người chơi</h3>
              <div className="rankings-list">
                {[...gameState.players]
                  .sort((a, b) => b.power - a.power)
                  .map((player, index) => (
                    <div
                      key={player.id}
                      className={`ranking-item ${player.name === multiplayer.myPlayer?.name ? "my-ranking" : ""}`}
                    >
                      <div
                        className="rank-badge"
                        style={{
                          background:
                            index === 0
                              ? "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)"
                              : index === 1
                              ? "linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)"
                              : index === 2
                              ? "linear-gradient(135deg, #f97316 0%, #ea580c 100%)"
                              : "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
                        }}
                      >
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                      </div>
                      <div className="ranking-info">
                        <div className="player-name-rank">
                          {player.name}
                          {player.name === multiplayer.myPlayer?.name && " (Bạn)"}
                        </div>
                        <div className="player-stats-mini">
                          <span>💰 {(player.capital / 1000000).toFixed(1)}M</span>
                          <span style={{ color: player.color }}>⚡ {player.power.toFixed(1)}</span>
                          {player.shares.length > 0 && <span>📊 {player.shares.length} cổ phần</span>}
                        </div>
                      </div>
                      <div className="power-display" style={{ color: player.color }}>
                        {player.power.toFixed(0)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* National Metrics Summary */}
            <div className="final-metrics">
              <h3>📊 Chỉ số quốc gia cuối cùng</h3>
              <div className="metrics-grid-final">
                <div className="metric-card-final">
                  <div className="metric-icon-final">🇻🇳</div>
                  <div className="metric-content-final">
                    <div className="metric-label-final">Kiểm soát nội địa</div>
                    <div
                      className="metric-value-final"
                      style={{
                        color:
                          gameState.nationalMetrics.domesticControl >= 70
                            ? "#10b981"
                            : gameState.nationalMetrics.domesticControl >= 40
                            ? "#f59e0b"
                            : "#ef4444",
                      }}
                    >
                      {gameState.nationalMetrics.domesticControl.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="metric-card-final">
                  <div className="metric-icon-final">🛡️</div>
                  <div className="metric-content-final">
                    <div className="metric-label-final">Chủ quyền kinh tế</div>
                    <div
                      className="metric-value-final"
                      style={{
                        color:
                          gameState.nationalMetrics.economicSovereignty >= 70
                            ? "#10b981"
                            : gameState.nationalMetrics.economicSovereignty >= 40
                            ? "#f59e0b"
                            : "#ef4444",
                      }}
                    >
                      {gameState.nationalMetrics.economicSovereignty.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="metric-card-final">
                  <div className="metric-icon-final">🌍</div>
                  <div className="metric-content-final">
                    <div className="metric-label-final">Phụ thuộc ngoại</div>
                    <div
                      className="metric-value-final"
                      style={{
                        color:
                          gameState.nationalMetrics.foreignDependency < 40
                            ? "#10b981"
                            : gameState.nationalMetrics.foreignDependency < 70
                            ? "#f59e0b"
                            : "#ef4444",
                      }}
                    >
                      {gameState.nationalMetrics.foreignDependency.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="metric-card-final">
                  <div className="metric-icon-final">📈</div>
                  <div className="metric-content-final">
                    <div className="metric-label-final">Tăng trưởng GDP</div>
                    <div
                      className="metric-value-final"
                      style={{
                        color:
                          gameState.nationalMetrics.gdpGrowth >= 6
                            ? "#10b981"
                            : gameState.nationalMetrics.gdpGrowth >= 4
                            ? "#f59e0b"
                            : "#ef4444",
                      }}
                    >
                      {gameState.nationalMetrics.gdpGrowth.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="metric-card-final">
                  <div className="metric-icon-final">⚠️</div>
                  <div className="metric-content-final">
                    <div className="metric-label-final">Mức độ độc quyền</div>
                    <div
                      className="metric-value-final"
                      style={{
                        color:
                          gameState.nationalMetrics.monopolyLevel < 40
                            ? "#10b981"
                            : gameState.nationalMetrics.monopolyLevel < 70
                            ? "#f59e0b"
                            : "#ef4444",
                      }}
                    >
                      {gameState.nationalMetrics.monopolyLevel.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="metric-card-final">
                  <div className="metric-icon-final">💰</div>
                  <div className="metric-content-final">
                    <div className="metric-label-final">Ổn định tài chính</div>
                    <div
                      className="metric-value-final"
                      style={{
                        color:
                          gameState.nationalMetrics.financialStability >= 70
                            ? "#10b981"
                            : gameState.nationalMetrics.financialStability >= 40
                            ? "#f59e0b"
                            : "#ef4444",
                      }}
                    >
                      {gameState.nationalMetrics.financialStability.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Overall Assessment */}
              <div className="overall-assessment">
                <h4>📋 Đánh giá tổng thể</h4>
                {gameState.nationalMetrics.domesticControl >= 70 &&
                gameState.nationalMetrics.economicSovereignty >= 65 ? (
                  <p className="assessment-good">
                    ✅ <strong>Xuất sắc!</strong> Việt Nam duy trì được kiểm soát tốt về tài chính và chủ quyền kinh tế.
                  </p>
                ) : gameState.nationalMetrics.domesticControl >= 50 ? (
                  <p className="assessment-ok">
                    ⚠️ <strong>Khá tốt.</strong> Còn một số vấn đề cần cải thiện về chủ quyền kinh tế.
                  </p>
                ) : (
                  <p className="assessment-bad">
                    🚨 <strong>Cần cải thiện.</strong> Chủ quyền kinh tế đang bị đe dọa nghiêm trọng.
                  </p>
                )}

                {gameState.nationalMetrics.foreignDependency >= 60 && (
                  <p className="assessment-bad">
                    🚨 Phụ thuộc vốn ngoại quá cao ({gameState.nationalMetrics.foreignDependency.toFixed(1)}%), nguy cơ
                    mất kiểm soát.
                  </p>
                )}

                {gameState.nationalMetrics.monopolyLevel >= 60 && (
                  <p className="assessment-bad">
                    🚨 Mức độ độc quyền cao ({gameState.nationalMetrics.monopolyLevel.toFixed(1)}%), cần can thiệp.
                  </p>
                )}

                {gameState.nationalMetrics.gdpGrowth >= 6 && (
                  <p className="assessment-good">
                    ✅ Tăng trưởng kinh tế tốt ({gameState.nationalMetrics.gdpGrowth.toFixed(1)}% hàng năm).
                  </p>
                )}
              </div>
            </div>

            <div className="game-over-actions">
              <button className="restart-btn primary" onClick={handleReset}>
                🏠 Về lobby
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .header-info {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .room-badge, .player-badge, .turn-badge, .action-status {
          background: rgba(255, 255, 255, 0.2);
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
        }

        .turn-badge {
          background: rgba(16, 185, 129, 0.3);
        }

        .action-status.acted {
          background: rgba(16, 185, 129, 0.3);
          color: #10b981;
        }

        .action-status.waiting {
          background: rgba(245, 158, 11, 0.3);
          color: #f59e0b;
        }

        .my-player {
          background: #ede9fe !important;
        }

        .multiplayer-chat {
          background: white;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .multiplayer-chat h3 {
          margin: 0 0 12px 0;
          font-size: 14px;
          color: #1f2937;
          font-weight: 600;
        }

        .chat-messages-mini {
          font-size: 12px;
          max-height: 150px;
          overflow-y: auto;
          margin-bottom: 12px;
        }

        .chat-messages-mini::-webkit-scrollbar {
          width: 4px;
        }

        .chat-messages-mini::-webkit-scrollbar-track {
          background: #f3f4f6;
        }

        .chat-messages-mini::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 2px;
        }

        .chat-msg {
          margin-bottom: 8px;
          padding: 6px;
          background: #f9fafb;
          border-radius: 4px;
          line-height: 1.4;
        }

        .chat-msg strong {
          color: #667eea;
        }

        .chat-empty {
          text-align: center;
          padding: 20px;
          color: #9ca3af;
          font-size: 12px;
          font-style: italic;
        }

        .chat-input-container {
          display: flex;
          gap: 8px;
        }

        .chat-input {
          flex: 1;
          padding: 8px 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 13px;
          color: #1f2937;
          background: white;
        }

        .chat-input:focus {
          outline: none;
          border-color: #667eea;
        }

        .chat-input::placeholder {
          color: #9ca3af;
        }

        .chat-send-btn {
          padding: 8px 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .chat-send-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
        }

        .chat-send-btn:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}

function AppMultiplayer() {
  return (
    <MultiplayerProvider>
      <MultiplayerGame />
    </MultiplayerProvider>
  );
}

export default AppMultiplayer;
