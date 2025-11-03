import { useReducer, useState, useEffect } from "react";
import { PowerMap } from "./components/PowerMap";
import { ActionPanel } from "./components/ActionPanel";
import { Dashboard } from "./components/Dashboard";
import { AnalysisPanel } from "./components/AnalysisPanel";
import { EventCard } from "./components/EventCard";
import { AIUsagePage } from "./components/AIUsage";
import {
  gameReducer,
  initialGameState,
  analyzeAction,
} from "./context/GameContext";
import { createSamplePlayers } from "./utils/playerUtils";
import { getRandomEvent, calculateEventImpact } from "./utils/events";
import type { Player, Action, AIAnalysis, GameEvent } from "./types";
import "./App.css";

function App() {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<AIAnalysis | null>(
    null
  );
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerCount, setPlayerCount] = useState(20);
  const [showAIUsage, setShowAIUsage] = useState(false);

  // Khởi tạo game
  const startGame = () => {
    const players = createSamplePlayers(playerCount);
    dispatch({ type: "INIT_GAME", payload: { players } });
    setSelectedPlayer(players[0]);
    setGameStarted(true);
  };

  // Random event mỗi 3 turns
  useEffect(() => {
    if (
      gameStarted &&
      gameState.currentTurn % 3 === 0 &&
      gameState.currentTurn > 0
    ) {
      const event = getRandomEvent();
      setCurrentEvent(event);
      dispatch({ type: "TRIGGER_EVENT", payload: event });
    }
  }, [gameState.currentTurn, gameStarted]);

  // Xử lý action
  const handlePerformAction = (action: Action) => {
    // Phân tích trước khi thực hiện
    const analysis = analyzeAction(gameState, action);

    // Thực hiện action
    dispatch({ type: "PERFORM_ACTION", payload: action });

    // Hiển thị phân tích
    setCurrentAnalysis(analysis);

    // Cập nhật metrics dựa trên analysis
    dispatch({
      type: "UPDATE_METRICS",
      payload: {
        domesticControl:
          gameState.nationalMetrics.domesticControl +
          analysis.nationalImpact.domesticControlChange,
        economicSovereignty:
          gameState.nationalMetrics.economicSovereignty +
          analysis.nationalImpact.sovereigntyChange,
        monopolyLevel:
          gameState.nationalMetrics.monopolyLevel +
          analysis.nationalImpact.monopolyChange,
      },
    });
  };

  // Xử lý event option
  const handleEventOption = (optionId: string) => {
    if (!currentEvent) return;

    const impacts = calculateEventImpact(currentEvent, optionId);

    // Apply impacts (simplified)
    impacts.forEach((impact) => {
      if (impact.capitalChange || impact.powerChange) {
        dispatch({
          type: "UPDATE_METRICS",
          payload: {
            domesticControl:
              gameState.nationalMetrics.domesticControl +
              (impact.powerChange || 0) * 0.5,
          },
        });
      }
    });

    setCurrentEvent(null);
  };

  // Next turn
  const handleNextTurn = () => {
    dispatch({ type: "NEXT_TURN" });
  };

  // Reset game
  const handleReset = () => {
    dispatch({ type: "RESET_GAME" });
    setGameStarted(false);
    setSelectedPlayer(null);
    setCurrentAnalysis(null);
    setCurrentEvent(null);
  };

  const handleAIUsage = () => setShowAIUsage(true);

  if (showAIUsage) {
    return <AIUsagePage onClose={() => setShowAIUsage(false)} />;
  }

  if (!gameStarted) {
    return (
      <div className="welcome-screen">
        <div className="welcome-content">
          <h1>🗺️ Bản đồ Quyền lực Tài chính</h1>
          <p className="subtitle">
            Mô phỏng tương tác về hệ sinh thái tài chính Việt Nam
          </p>

          <div className="welcome-description">
            <p>
              Vào vai các chủ thể trong hệ sinh thái tài chính (doanh nghiệp,
              ngân hàng/quỹ đầu tư, nhà nước), thực hiện các nước đi về kinh
              tế-tài chính, và theo dõi ảnh hưởng đến quyền lực và lợi ích quốc
              gia.
            </p>
          </div>

          <div className="player-count-selector">
            <label>Số lượng người chơi:</label>
            <input
              type="range"
              min="10"
              max="30"
              value={playerCount}
              onChange={(e) => setPlayerCount(Number(e.target.value))}
            />
            <span className="count-display">{playerCount} người chơi</span>
          </div>

          <button className="start-button" onClick={startGame}>
            Bắt đầu trò chơi
          </button>

          <div className="game-info">
            <div className="info-section">
              <h3>🎮 Cách chơi</h3>
              <ul>
                <li>Chọn người chơi trên bản đồ</li>
                <li>Thực hiện các hành động dựa trên vai trò</li>
                <li>Theo dõi phân tích AI về hệ quả</li>
                <li>Quản lý chỉ số quốc gia</li>
              </ul>
            </div>

            <div className="info-section">
              <h3>🏦 Vai trò</h3>
              <ul>
                <li>
                  <strong>Ngân hàng/Quỹ:</strong> Đầu tư, mua cổ phần, phát
                  triển fintech
                </li>
                <li>
                  <strong>Doanh nghiệp:</strong> Hợp tác vốn, mở rộng, chống
                  thâu tóm
                </li>
                <li>
                  <strong>Chính phủ:</strong> Ban hành luật, kiểm soát vốn, bảo
                  vệ ngành
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get current player data (updated from state)
  const currentPlayer = selectedPlayer
    ? gameState.players.find((p) => p.id === selectedPlayer.id) ||
      selectedPlayer
    : null;

  return (
    <div className="app">
      <header className="app-header">
        <h1>🗺️ Bản đồ Quyền lực Tài chính</h1>
        <div className="header-actions">
          <button className="header-btn" onClick={handleNextTurn}>
            ⏭️ Lượt tiếp theo
          </button>
          <button className="header-btn reset" onClick={handleReset}>
            🔄 Bắt đầu lại
          </button>
          <button className="header-btn" onClick={handleAIUsage}>
            🤖 Về AI
          </button>
        </div>
      </header>

      <div className="game-layout">
        <div className="left-panel">
          <Dashboard
            metrics={gameState.nationalMetrics}
            currentTurn={gameState.currentTurn}
            maxTurns={gameState.maxTurns}
          />

          {currentPlayer && (
            <div className="action-panel-container">
              <ActionPanel
                player={currentPlayer}
                allPlayers={gameState.players}
                onPerformAction={handlePerformAction}
              />
            </div>
          )}
        </div>

        <div className="center-panel">
          <PowerMap
            players={gameState.players}
            capitalFlows={gameState.capitalFlows}
            onPlayerSelect={(player) => setSelectedPlayer(player)}
            selectedPlayer={currentPlayer || undefined}
          />
        </div>

        <div className="right-panel">
          <div className="players-list">
            <h3>Người chơi ({gameState.players.length})</h3>
            <div className="players-scroll">
              {gameState.players.map((player) => (
                <div
                  key={player.id}
                  className={`player-item ${
                    currentPlayer?.id === player.id ? "selected" : ""
                  }`}
                  onClick={() => setSelectedPlayer(player)}
                  style={{ borderLeftColor: player.color }}
                >
                  <div className="player-name">{player.name}</div>
                  <div className="player-power">
                    <div className="power-bar-small">
                      <div
                        className="power-fill-small"
                        style={{
                          width: `${player.power}%`,
                          backgroundColor: player.color,
                        }}
                      />
                    </div>
                    <span>{player.power.toFixed(0)}</span>
                  </div>
                </div>
              ))}
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
                    <div className="action-description">
                      {action.description}
                    </div>
                    <div className="action-time">
                      {new Date(action.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Overlays */}
      {currentAnalysis && (
        <AnalysisPanel
          analysis={currentAnalysis}
          onClose={() => setCurrentAnalysis(null)}
        />
      )}

      {currentEvent && (
        <EventCard
          event={currentEvent}
          onSelectOption={handleEventOption}
          onDismiss={() => setCurrentEvent(null)}
        />
      )}

      {gameState.isGameOver && (
        <div className="game-over-overlay">
          <div className="game-over-panel">
            <h2>🎉 Trò chơi kết thúc!</h2>
            <p>Đã hoàn thành {gameState.maxTurns} lượt chơi</p>
            <div className="final-metrics">
              <h3>Kết quả cuối cùng:</h3>
              <div className="metric">
                Kiểm soát nội địa:{" "}
                <strong>
                  {gameState.nationalMetrics.domesticControl.toFixed(1)}%
                </strong>
              </div>
              <div className="metric">
                Chủ quyền kinh tế:{" "}
                <strong>
                  {gameState.nationalMetrics.economicSovereignty.toFixed(1)}%
                </strong>
              </div>
              <div className="metric">
                Phụ thuộc ngoại:{" "}
                <strong>
                  {gameState.nationalMetrics.foreignDependency.toFixed(1)}%
                </strong>
              </div>
            </div>
            <button className="restart-btn" onClick={handleReset}>
              Chơi lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
