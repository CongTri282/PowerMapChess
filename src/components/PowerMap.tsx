import React, { useState, useRef, useEffect } from 'react';
import type { Player, CapitalFlow } from '../types';
import { PlayerType } from '../types';
import { formatCurrency, getSectorName } from '../utils/playerUtils';

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
        const opacity = 1 - (index / 20) * 0.6; // Dòng cũ mờ dần nhiều hơn
        
        // Vẽ đường cong thay vì đường thẳng
        const midX = (fromPlayer.position.x + toPlayer.position.x) / 2;
        const midY = (fromPlayer.position.y + toPlayer.position.y) / 2;
        const controlX = midX + (Math.random() - 0.5) * 50;
        const controlY = midY - 50; // Cong lên trên
        
        ctx.beginPath();
        ctx.moveTo(fromPlayer.position.x, fromPlayer.position.y);
        ctx.quadraticCurveTo(controlX, controlY, toPlayer.position.x, toPlayer.position.y);
        
        // Màu sắc theo loại flow với độ sáng cao hơn
        const colors = {
          INVESTMENT: `rgba(34, 197, 94, ${opacity})`,
          SHARE_PURCHASE: `rgba(239, 68, 68, ${opacity})`,
          COOPERATION: `rgba(59, 130, 246, ${opacity})`,
          TAX: `rgba(168, 85, 247, ${opacity})`
        };
        
        ctx.strokeStyle = colors[flow.type] || `rgba(156, 163, 175, ${opacity})`;
        ctx.lineWidth = Math.max(2, Math.min(flow.amount / 800000, 6));
        ctx.setLineDash([8, 6]);
        ctx.shadowColor = colors[flow.type] || 'rgba(156, 163, 175, 0.5)';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // Vẽ mũi tên lớn hơn
        const angle = Math.atan2(
          toPlayer.position.y - midY,
          toPlayer.position.x - midX
        );
        
        const arrowSize = 12;
        const arrowDistance = 50;
        const arrowX = toPlayer.position.x - Math.cos(angle) * arrowDistance;
        const arrowY = toPlayer.position.y - Math.sin(angle) * arrowDistance;
        
        ctx.setLineDash([]);
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
          const baseSize = 65;
          const size = isSelected ? baseSize + 15 : isHovered ? baseSize + 5 : baseSize;
          
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
                backgroundColor: `${player.color}20`,
                boxShadow: isSelected 
                  ? `0 0 25px ${player.color}80, 0 0 40px ${player.color}40`
                  : isHovered
                  ? `0 0 15px ${player.color}60`
                  : `0 2px 8px rgba(0,0,0,0.3)`
              }}
              onClick={() => onPlayerSelect(player)}
              onMouseEnter={() => setHoveredPlayer(player.id)}
              onMouseLeave={() => setHoveredPlayer(null)}
            >
              <div className="player-icon">{getPlayerIcon(player.type)}</div>
              
              {/* Player name label */}
              <div className="player-label" style={{ 
                color: player.color,
                fontWeight: isSelected || isHovered ? 700 : 600
              }}>
                {player.name.length > 12 ? player.name.substring(0, 10) + '...' : player.name}
              </div>
              
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
                    {player.sector && <div>Ngành: {getSectorName(player.sector)}</div>}
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
          width: 100%;
          max-width: 1200px;
          height: 700px;
          background: 
            radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%),
            linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 
            0 4px 6px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .power-map-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none;
          opacity: 0.3;
        }

        .power-map-container::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: 
            radial-gradient(circle, rgba(99, 102, 241, 0.05) 1px, transparent 1px),
            radial-gradient(circle, rgba(168, 85, 247, 0.05) 1px, transparent 1px);
          background-size: 80px 80px, 120px 120px;
          background-position: 0 0, 40px 40px;
          animation: backgroundMove 60s linear infinite;
          pointer-events: none;
          opacity: 0.4;
        }

        @keyframes backgroundMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(80px, 80px);
          }
        }

        .capital-flows-canvas {
          position: absolute;
          top: 0;
          left: 0;
          pointer-events: none;
          width: 100%;
          height: 100%;
        }

        .players-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 10;
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
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 10;
          backdrop-filter: blur(8px);
          box-shadow: 
            0 4px 12px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .player-node::before {
          content: '';
          position: absolute;
          top: -5px;
          left: -5px;
          right: -5px;
          bottom: -5px;
          border-radius: 50%;
          background: inherit;
          opacity: 0;
          filter: blur(10px);
          transition: opacity 0.3s;
          z-index: -1;
        }

        .player-node:hover::before {
          opacity: 0.6;
        }

        .player-node:hover {
          transform: scale(1.08);
          z-index: 20;
        }

        .player-node.selected {
          z-index: 25;
          border-width: 4px;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { 
            transform: scale(1);
          }
          50% { 
            transform: scale(1.05);
          }
        }

        .player-icon {
          font-size: 28px;
          margin-bottom: 2px;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }

        .player-label {
          position: absolute;
          bottom: -22px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 10px;
          font-weight: 600;
          text-align: center;
          white-space: nowrap;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%);
          padding: 3px 10px;
          border-radius: 12px;
          pointer-events: none;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 
            0 2px 8px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .power-bar {
          width: 85%;
          height: 5px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 3px;
          overflow: hidden;
          margin-top: 3px;
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.3);
        }

        .power-fill {
          height: 100%;
          transition: width 0.5s ease;
          box-shadow: 0 0 8px currentColor;
        }

        .player-tooltip {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-top: 28px;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%);
          color: white;
          padding: 14px 16px;
          border-radius: 10px;
          white-space: nowrap;
          font-size: 13px;
          pointer-events: none;
          z-index: 30;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          min-width: 180px;
        }

        .tooltip-header {
          border-bottom: 2px solid rgba(255, 255, 255, 0.15);
          padding-bottom: 8px;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .tooltip-header strong {
          color: #fff;
          font-weight: 700;
        }

        .tooltip-body > div {
          margin: 6px 0;
          display: flex;
          justify-content: space-between;
          gap: 12px;
          color: rgba(255, 255, 255, 0.9);
        }

        .tooltip-body > div:first-child {
          color: #10b981;
          font-weight: 600;
        }

        .map-legend {
          position: absolute;
          bottom: 20px;
          right: 20px;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%);
          color: white;
          padding: 18px 20px;
          border-radius: 12px;
          font-size: 13px;
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 
            0 8px 20px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .map-legend::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
          pointer-events: none;
        }

        .map-legend h4 {
          margin: 0 0 14px 0;
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.5px;
          position: relative;
          z-index: 1;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .legend-item {
          display: flex;
          align-items: center;
          margin: 10px 0;
          transition: transform 0.2s;
          position: relative;
          z-index: 1;
        }

        .legend-item:hover {
          transform: translateX(4px);
        }

        .legend-line {
          width: 35px;
          height: 4px;
          margin-right: 12px;
          border-radius: 2px;
          box-shadow: 
            0 0 10px currentColor,
            0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .legend-item span {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.9);
        }
      `}</style>
    </div>
  );
};
