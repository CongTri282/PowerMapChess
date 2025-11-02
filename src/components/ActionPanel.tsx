import React, { useState } from 'react';
import type { Player, Action } from '../types';
import { PlayerType, ActionType, Sector } from '../types';
import { formatCurrency } from '../utils/playerUtils';

interface ActionPanelProps {
  player: Player;
  allPlayers: Player[];
  onPerformAction: (action: Action) => void;
}

interface ActionConfig {
  type: ActionType;
  label: string;
  needsTarget?: boolean;
  needsAmount?: boolean;
  needsSector?: boolean;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({
  player,
  allPlayers,
  onPerformAction
}) => {
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);
  const [targetId, setTargetId] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);

  const getBankActions = (): ActionConfig[] => [
    { type: ActionType.INVEST_CAPITAL, label: 'Đầu tư vốn', needsTarget: true, needsAmount: true },
    { type: ActionType.BUY_SHARES, label: 'Mua cổ phần', needsTarget: true, needsAmount: true },
    { type: ActionType.DEVELOP_FINTECH, label: 'Phát triển Fintech', needsAmount: true },
    { type: ActionType.MARKET_MANIPULATION, label: 'Thao túng thị trường', needsSector: true }
  ];

  const getEnterpriseActions = (): ActionConfig[] => [
    { type: ActionType.COOPERATE_CAPITAL, label: 'Hợp tác vốn', needsTarget: true, needsAmount: true },
    { type: ActionType.EXPAND_SCALE, label: 'Mở rộng quy mô', needsAmount: true },
    { type: ActionType.SELL_SHARES, label: 'Bán cổ phần', needsTarget: true, needsAmount: true },
    { type: ActionType.RESIST_TAKEOVER, label: 'Chống thâu tóm', needsTarget: true, needsAmount: true }
  ];

  const getGovernmentActions = (): ActionConfig[] => [
    { type: ActionType.ENACT_LAW, label: 'Ban hành luật', needsSector: true },
    { type: ActionType.CONTROL_FOREIGN_CAPITAL, label: 'Kiểm soát vốn ngoại', needsSector: true },
    { type: ActionType.PROTECT_KEY_SECTOR, label: 'Bảo vệ ngành trọng yếu', needsSector: true },
    { type: ActionType.APPLY_SPECIAL_TAX, label: 'Áp thuế đặc biệt', needsAmount: true }
  ];

  const getAvailableActions = () => {
    switch (player.type) {
      case PlayerType.BANK:
        return getBankActions();
      case PlayerType.ENTERPRISE:
        return getEnterpriseActions();
      case PlayerType.GOVERNMENT:
        return getGovernmentActions();
      default:
        return [];
    }
  };

  const getTargetPlayers = () => {
    const currentAction = getAvailableActions().find(a => a.type === selectedAction) as ActionConfig | undefined;
    if (!currentAction || !currentAction.needsTarget) return [];

    switch (selectedAction) {
      case ActionType.INVEST_CAPITAL:
      case ActionType.BUY_SHARES:
        return allPlayers.filter(p => p.type === PlayerType.ENTERPRISE && p.id !== player.id);
      case ActionType.COOPERATE_CAPITAL:
        return allPlayers.filter(p => p.type === PlayerType.BANK && p.id !== player.id);
      case ActionType.RESIST_TAKEOVER:
        return allPlayers.filter(p => 
          p.type === PlayerType.BANK && 
          p.shares.some(s => s.enterpriseId === player.id)
        );
      case ActionType.SELL_SHARES:
        return allPlayers.filter(p => p.type === PlayerType.BANK && p.id !== player.id);
      default:
        return [];
    }
  };

  const handleSubmit = () => {
    if (!selectedAction) return;

    const action: Action = {
      id: `action_${Date.now()}`,
      playerId: player.id,
      type: selectedAction,
      target: targetId || undefined,
      amount: amount || undefined,
      sector: selectedSector || undefined,
      timestamp: Date.now(),
      description: getActionDescription()
    };

    onPerformAction(action);
    
    // Reset form
    setSelectedAction(null);
    setTargetId('');
    setAmount(0);
    setSelectedSector(null);
  };

  const getActionDescription = (): string => {
    const actionLabels = getAvailableActions();
    const actionLabel = actionLabels.find(a => a.type === selectedAction)?.label || '';
    const targetPlayer = allPlayers.find(p => p.id === targetId);
    
    let desc = `${player.name} thực hiện: ${actionLabel}`;
    if (targetPlayer) desc += ` → ${targetPlayer.name}`;
    if (amount) desc += ` (${formatCurrency(amount)})`;
    if (selectedSector) desc += ` trong ngành ${selectedSector}`;
    
    return desc;
  };

  const canSubmit = () => {
    if (!selectedAction) return false;
    
    const action = getAvailableActions().find(a => a.type === selectedAction) as ActionConfig | undefined;
    if (!action) return false;
    
    if (action.needsTarget === true && !targetId) return false;
    if (action.needsAmount === true && (!amount || amount <= 0)) return false;
    if (action.needsSector === true && !selectedSector) return false;
    
    return true;
  };

  return (
    <div className="action-panel">
      <div className="panel-header">
        <h3>Hành động - {player.name}</h3>
        <div className="player-stats">
          <div>Vốn: {formatCurrency(player.capital)}</div>
          <div>Quyền lực: {player.power.toFixed(1)}/100</div>
        </div>
      </div>

      <div className="panel-body">
        <div className="action-selection">
          <label>Chọn hành động:</label>
          <div className="action-buttons">
            {getAvailableActions().map(action => (
              <button
                key={action.type}
                className={`action-btn ${selectedAction === action.type ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedAction(action.type);
                  setTargetId('');
                  setAmount(0);
                  setSelectedSector(null);
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {selectedAction && (
          <div className="action-params">
            {(getAvailableActions().find(a => a.type === selectedAction) as ActionConfig)?.needsTarget && (
              <div className="param-group">
                <label>Chọn đối tượng:</label>
                <select
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="param-select"
                >
                  <option value="">-- Chọn --</option>
                  {getTargetPlayers().map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({formatCurrency(p.capital)})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(getAvailableActions().find(a => a.type === selectedAction) as ActionConfig)?.needsAmount && (
              <div className="param-group">
                <label>Số tiền:</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="param-input"
                  placeholder="Nhập số tiền..."
                  min="0"
                  max={player.capital}
                  step="100000"
                />
                <div className="amount-suggestions">
                  <button onClick={() => setAmount(player.capital * 0.1)}>10%</button>
                  <button onClick={() => setAmount(player.capital * 0.25)}>25%</button>
                  <button onClick={() => setAmount(player.capital * 0.5)}>50%</button>
                </div>
              </div>
            )}

            {(getAvailableActions().find(a => a.type === selectedAction) as ActionConfig)?.needsSector && (
              <div className="param-group">
                <label>Chọn ngành:</label>
                <select
                  value={selectedSector || ''}
                  onChange={(e) => setSelectedSector(e.target.value as Sector)}
                  className="param-select"
                >
                  <option value="">-- Chọn ngành --</option>
                  {Object.values(Sector).map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={!canSubmit()}
        >
          Thực hiện nước đi
        </button>
      </div>

      <style>{`
        .action-panel {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .panel-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
        }

        .panel-header h3 {
          margin: 0 0 12px 0;
          font-size: 20px;
        }

        .player-stats {
          display: flex;
          gap: 20px;
          font-size: 14px;
          opacity: 0.9;
        }

        .panel-body {
          padding: 20px;
        }

        .action-selection {
          margin-bottom: 20px;
        }

        .action-selection label {
          display: block;
          margin-bottom: 12px;
          font-weight: 600;
          color: #374151;
        }

        .action-buttons {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .action-btn {
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .action-btn:hover {
          border-color: #667eea;
          background: #f3f4f6;
        }

        .action-btn.selected {
          border-color: #667eea;
          background: #667eea;
          color: white;
        }

        .action-params {
          background: #f9fafb;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .param-group {
          margin-bottom: 16px;
        }

        .param-group:last-child {
          margin-bottom: 0;
        }

        .param-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .param-select,
        .param-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          background: white;
        }

        .param-select:focus,
        .param-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .amount-suggestions {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }

        .amount-suggestions button {
          padding: 6px 12px;
          border: 1px solid #d1d5db;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
        }

        .amount-suggestions button:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .submit-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }

        .submit-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
};
