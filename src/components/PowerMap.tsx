import React, { useState, useRef, useEffect } from 'react';
import type { Player, CapitalFlow } from '../types';
import { PlayerType } from '../types';
import { formatCurrency } from '../utils/playerUtils';

interface PowerMapProps {
  players: Player[];
  capitalFlows: CapitalFlow[];
  onPlayerSelect: (player: Player) => void;
  selectedPlayer?: Player;
}

export const PowerMap: React.FC<PowerMapProps> = ({
  players,
  capitalFlows,
  onPlayerSelect,
  selectedPlayer
}) => {
  const [hoveredPlayer, setHoveredPlayer] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Vẽ capital flows trên canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Vẽ các dòng vốn
    capitalFlows.slice(-20).forEach((flow, index) => {
      const fromPlayer = players.find(p => p.id === flow.from);
      const toPlayer = players.find(p => p.id === flow.to);

      if (fromPlayer && toPlayer) {
        const opacity = 1 - (index / 20) * 0.5; // Dòng cũ mờ dần
        
        ctx.beginPath();
        ctx.moveTo(fromPlayer.position.x, fromPlayer.position.y);
        ctx.lineTo(toPlayer.position.x, toPlayer.position.y);
        
        // Màu sắc theo loại flow
        const colors = {
          INVESTMENT: `rgba(34, 197, 94, ${opacity})`,
          SHARE_PURCHASE: `rgba(239, 68, 68, ${opacity})`,
          COOPERATION: `rgba(59, 130, 246, ${opacity})`,
          TAX: `rgba(168, 85, 247, ${opacity})`
        };
        
        ctx.strokeStyle = colors[flow.type] || `rgba(156, 163, 175, ${opacity})`;
        ctx.lineWidth = Math.min(flow.amount / 1000000, 5);
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        
        // Vẽ mũi tên
        const angle = Math.atan2(
          toPlayer.position.y - fromPlayer.position.y,
          toPlayer.position.x - fromPlayer.position.x
        );
        
        const arrowSize = 10;
        const arrowX = toPlayer.position.x - Math.cos(angle) * 40;
        const arrowY = toPlayer.position.y - Math.sin(angle) * 40;
        
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(
          arrowX - arrowSize * Math.cos(angle - Math.PI / 6),
          arrowY - arrowSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          arrowX - arrowSize * Math.cos(angle + Math.PI / 6),
          arrowY - arrowSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fill();
      }
    });
  }, [capitalFlows, players]);

  const getPlayerIcon = (type: PlayerType): string => {
    switch (type) {
      case PlayerType.BANK:
        return '🏦';
      case PlayerType.ENTERPRISE:
        return '🏢';
      case PlayerType.GOVERNMENT:
        return '🏛️';
      default:
        return '📊';
    }
  };

  return (
    <div ref={mapRef} className="power-map-container">
      <canvas
        ref={canvasRef}
        width={1200}
        height={700}
        className="capital-flows-canvas"
      />
      
      <div className="players-layer">
        {players.map(player => {
          const isSelected = selectedPlayer?.id === player.id;
          const isHovered = hoveredPlayer === player.id;
          const size = isSelected ? 80 : isHovered ? 70 : 60;
          
          return (
            <div
              key={player.id}
              className={`player-node ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
              style={{
                left: player.position.x - size / 2,
                top: player.position.y - size / 2,
                width: size,
                height: size,
                borderColor: player.color,
                backgroundColor: `${player.color}15`
              }}
              onClick={() => onPlayerSelect(player)}
              onMouseEnter={() => setHoveredPlayer(player.id)}
              onMouseLeave={() => setHoveredPlayer(null)}
            >
              <div className="player-icon">{getPlayerIcon(player.type)}</div>
              
              {/* Power bar */}
              <div className="power-bar">
                <div
                  className="power-fill"
                  style={{
                    width: `${player.power}%`,
                    backgroundColor: player.color
                  }}
                />
              </div>
              
              {/* Tooltip */}
              {isHovered && (
                <div className="player-tooltip">
                  <div className="tooltip-header">
                    <strong>{player.name}</strong>
                  </div>
                  <div className="tooltip-body">
                    <div>Vốn: {formatCurrency(player.capital)}</div>
                    <div>Quyền lực: {player.power.toFixed(1)}/100</div>
                    {player.sector && <div>Ngành: {player.sector}</div>}
                    {player.shares.length > 0 && (
                      <div>Cổ phần: {player.shares.length} DN</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="map-legend">
        <h4>Chú thích</h4>
        <div className="legend-item">
          <div className="legend-line" style={{ background: 'rgba(34, 197, 94, 0.8)' }} />
          <span>Đầu tư</span>
        </div>
        <div className="legend-item">
          <div className="legend-line" style={{ background: 'rgba(239, 68, 68, 0.8)' }} />
          <span>Mua cổ phần</span>
        </div>
        <div className="legend-item">
          <div className="legend-line" style={{ background: 'rgba(59, 130, 246, 0.8)' }} />
          <span>Hợp tác</span>
        </div>
        <div className="legend-item">
          <div className="legend-line" style={{ background: 'rgba(168, 85, 247, 0.8)' }} />
          <span>Thuế</span>
        </div>
      </div>

      <style>{`
        .power-map-container {
          position: relative;
          width: 1200px;
          height: 700px;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .capital-flows-canvas {
          position: absolute;
          top: 0;
          left: 0;
          pointer-events: none;
        }

        .players-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .player-node {
          position: absolute;
          border-radius: 50%;
          border: 3px solid;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .player-node:hover {
          transform: scale(1.1);
          z-index: 20;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        }

        .player-node.selected {
          z-index: 25;
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 30px rgba(255, 255, 255, 0.5); }
          50% { box-shadow: 0 0 40px rgba(255, 255, 255, 0.8); }
        }

        .player-icon {
          font-size: 24px;
          margin-bottom: 4px;
        }

        .power-bar {
          width: 80%;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          overflow: hidden;
          margin-top: 4px;
        }

        .power-fill {
          height: 100%;
          transition: width 0.5s ease;
        }

        .player-tooltip {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-top: 10px;
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 12px;
          border-radius: 8px;
          white-space: nowrap;
          font-size: 12px;
          pointer-events: none;
          z-index: 30;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        }

        .tooltip-header {
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          padding-bottom: 6px;
          margin-bottom: 6px;
        }

        .tooltip-body > div {
          margin: 4px 0;
        }

        .map-legend {
          position: absolute;
          bottom: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 16px;
          border-radius: 8px;
          font-size: 12px;
        }

        .map-legend h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: bold;
        }

        .legend-item {
          display: flex;
          align-items: center;
          margin: 8px 0;
        }

        .legend-line {
          width: 30px;
          height: 3px;
          margin-right: 8px;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
};
