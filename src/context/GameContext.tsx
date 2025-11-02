import type {
  Player,
  Action,
  GameState,
  CapitalFlow,
  GameEvent,
  NationalMetrics,
  AIAnalysis,
  PowerShift,
  NationalImpactAnalysis
} from '../types';
import {
  PlayerType,
  CapitalType,
  ActionType
} from '../types';

// Action types cho reducer
export type GameAction =
  | { type: 'INIT_GAME'; payload: { players: Player[] } }
  | { type: 'ADD_PLAYER'; payload: Player }
  | { type: 'REMOVE_PLAYER'; payload: string }
  | { type: 'PERFORM_ACTION'; payload: Action }
  | { type: 'ADD_CAPITAL_FLOW'; payload: CapitalFlow }
  | { type: 'TRIGGER_EVENT'; payload: GameEvent }
  | { type: 'NEXT_TURN' }
  | { type: 'UPDATE_METRICS'; payload: Partial<NationalMetrics> }
  | { type: 'END_GAME'; payload?: string }
  | { type: 'RESET_GAME' };

// Initial state
export const initialGameState: GameState = {
  players: [],
  actions: [],
  capitalFlows: [],
  events: [],
  currentTurn: 1,
  maxTurns: 10,
  nationalMetrics: {
    domesticControl: 70,
    economicSovereignty: 65,
    foreignDependency: 35,
    monopolyLevel: 40,
    gdpGrowth: 6.5,
    financialStability: 75
  },
  isGameOver: false,
  actionsPerTurn: 1, // Mỗi người chơi chỉ được 1 hành động mỗi lượt
  playersActedThisTurn: []
};

// Game reducer
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'INIT_GAME':
      return {
        ...initialGameState,
        players: action.payload.players
      };

    case 'ADD_PLAYER':
      return {
        ...state,
        players: [...state.players, action.payload]
      };

    case 'REMOVE_PLAYER':
      return {
        ...state,
        players: state.players.filter(p => p.id !== action.payload)
      };

    case 'PERFORM_ACTION': {
      const newAction = action.payload;
      const updatedState = applyActionEffects(state, newAction);
      
      // Track player đã thực hiện action
      const playersActed = state.playersActedThisTurn.includes(newAction.playerId)
        ? state.playersActedThisTurn
        : [...state.playersActedThisTurn, newAction.playerId];
      
      return {
        ...updatedState,
        actions: [...updatedState.actions, newAction],
        playersActedThisTurn: playersActed
      };
    }

    case 'ADD_CAPITAL_FLOW':
      return {
        ...state,
        capitalFlows: [...state.capitalFlows, action.payload]
      };

    case 'TRIGGER_EVENT':
      return {
        ...state,
        events: [...state.events, action.payload]
      };

    case 'NEXT_TURN':
      const nextTurn = state.currentTurn + 1;
      const isGameOver = nextTurn > state.maxTurns;
      
      return {
        ...state,
        currentTurn: nextTurn,
        isGameOver,
        playersActedThisTurn: [] // Reset danh sách người đã hành động
      };

    case 'UPDATE_METRICS':
      return {
        ...state,
        nationalMetrics: {
          ...state.nationalMetrics,
          ...action.payload
        }
      };

    case 'END_GAME':
      return {
        ...state,
        isGameOver: true,
        winner: action.payload
      };

    case 'RESET_GAME':
      return initialGameState;

    default:
      return state;
  }
}

// Apply effects của action lên game state
function applyActionEffects(state: GameState, action: Action): GameState {
  let newState = { ...state };
  const player = newState.players.find(p => p.id === action.playerId);
  
  if (!player) return state;

  switch (action.type) {
    case ActionType.INVEST_CAPITAL:
    case ActionType.BUY_SHARES: {
      if (action.target && action.amount) {
        const target = newState.players.find(p => p.id === action.target);
        if (target && target.type === PlayerType.ENTERPRISE) {
          // Tạo capital flow
          const flow: CapitalFlow = {
            id: `flow_${Date.now()}`,
            from: player.id,
            to: action.target,
            amount: action.amount,
            type: action.type === ActionType.INVEST_CAPITAL ? 'INVESTMENT' : 'SHARE_PURCHASE',
            timestamp: Date.now()
          };
          newState.capitalFlows.push(flow);

          // Cập nhật shares
          const sharePercentage = Math.min((action.amount / target.capital) * 100, 100);
          const existingShare = player.shares.find(s => s.enterpriseId === action.target);
          
          // Bank/Fintech tăng power khi đầu tư
          const investorPowerGain = sharePercentage * 0.15; // Tăng từ 0.1 lên 0.15
          
          newState.players = newState.players.map(p => {
            if (p.id === player.id) {
              if (existingShare) {
                return {
                  ...p,
                  capital: p.capital - action.amount!,
                  power: Math.min(p.power + investorPowerGain, 100),
                  shares: p.shares.map(s =>
                    s.enterpriseId === action.target
                      ? { ...s, percentage: s.percentage + sharePercentage, value: s.value + action.amount! }
                      : s
                  )
                };
              } else {
                return {
                  ...p,
                  capital: p.capital - action.amount!,
                  power: Math.min(p.power + investorPowerGain, 100),
                  shares: [...p.shares, { enterpriseId: action.target!, percentage: sharePercentage, value: action.amount! }]
                };
              }
            }
            if (p.id === action.target) {
              return {
                ...p,
                capital: p.capital + action.amount!,
                power: p.power - sharePercentage * 0.05
              };
            }
            return p;
          });

          // Cập nhật metrics
          if (player.capitalType === CapitalType.FOREIGN) {
            newState.nationalMetrics = {
              ...newState.nationalMetrics,
              foreignDependency: Math.min(newState.nationalMetrics.foreignDependency + sharePercentage * 0.05, 100),
              domesticControl: Math.max(newState.nationalMetrics.domesticControl - sharePercentage * 0.05, 0)
            };
          }
        }
      }
      break;
    }

    case ActionType.DEVELOP_FINTECH: {
      const devCost = action.amount || 500000; // Giảm từ 1M xuống 500k
      newState.players = newState.players.map(p => {
        if (p.id === player.id) {
          return {
            ...p,
            capital: p.capital - devCost,
            power: Math.min(p.power + 6, 100) // Tăng từ 5 lên 6
          };
        }
        return p;
      });
      
      // Thêm tác động tích cực đến GDP nếu là domestic
      if (player.capitalType === CapitalType.DOMESTIC) {
        newState.nationalMetrics = {
          ...newState.nationalMetrics,
          gdpGrowth: newState.nationalMetrics.gdpGrowth + 0.3
        };
      }
      break;
    }

    case ActionType.MARKET_MANIPULATION: {
      const manipulationCost = action.amount || 150000; // Thêm chi phí
      
      newState.players = newState.players.map(p => {
        if (p.id === player.id) {
          return {
            ...p,
            capital: p.capital - manipulationCost,
            power: Math.min(p.power + 4, 100) // Tăng từ 3 lên 4
          };
        }
        if (p.type === PlayerType.ENTERPRISE && p.sector === action.sector) {
          return {
            ...p,
            power: Math.max(p.power - 2, 0)
          };
        }
        return p;
      });
      
      newState.nationalMetrics = {
        ...newState.nationalMetrics,
        financialStability: Math.max(newState.nationalMetrics.financialStability - 3, 0)
      };
      break;
    }

    case ActionType.EXPAND_SCALE: {
      const expansionCost = action.amount || 400000; // Giảm từ 500k xuống 400k
      newState.players = newState.players.map(p => {
        if (p.id === player.id) {
          return {
            ...p,
            capital: p.capital - expansionCost,
            power: Math.min(p.power + 5, 100) // Tăng từ 4 lên 5
          };
        }
        return p;
      });
      
      newState.nationalMetrics = {
        ...newState.nationalMetrics,
        gdpGrowth: newState.nationalMetrics.gdpGrowth + 0.3 // Tăng từ 0.2 lên 0.3
      };
      break;
    }

    case ActionType.RESIST_TAKEOVER: {
      if (action.target) {
        const attacker = newState.players.find(p => p.id === action.target);
        const defenseCost = action.amount || 250000; // Giảm từ 300k xuống 250k
        if (attacker) {
          newState.players = newState.players.map(p => {
            if (p.id === player.id) {
              return {
                ...p,
                capital: p.capital - defenseCost,
                power: Math.min(p.power + 4, 100) // Tăng từ 3 lên 4
              };
            }
            if (p.id === action.target) {
              // Giảm shares của attacker
              return {
                ...p,
                power: Math.max(p.power - 3, 0), // Tăng penalty từ -2 lên -3
                shares: p.shares.map(s =>
                  s.enterpriseId === player.id
                    ? { ...s, percentage: Math.max(s.percentage - 15, 0) } // Tăng từ -10 lên -15
                    : s
                )
              };
            }
            return p;
          });
        }
      }
      break;
    }

    case ActionType.ENACT_LAW:
    case ActionType.CONTROL_FOREIGN_CAPITAL: {
      const lawCost = action.amount || 200000; // Chi phí ban hành luật
      
      newState.nationalMetrics = {
        ...newState.nationalMetrics,
        economicSovereignty: Math.min(newState.nationalMetrics.economicSovereignty + 5, 100),
        foreignDependency: Math.max(newState.nationalMetrics.foreignDependency - 5, 0)
      };
      
      // Tăng power cho Chính phủ nhưng trừ chi phí
      newState.players = newState.players.map(p => {
        if (p.id === player.id && p.type === PlayerType.GOVERNMENT) {
          return {
            ...p,
            capital: p.capital - lawCost,
            power: Math.min(p.power + 6, 100)
          };
        }
        // Giảm power của foreign capital
        if (p.capitalType === CapitalType.FOREIGN) {
          return {
            ...p,
            power: Math.max(p.power - 3, 0)
          };
        }
        return p;
      });
      break;
    }

    case ActionType.PROTECT_KEY_SECTOR: {
      if (action.sector) {
        const protectionCost = action.amount || 300000; // Chi phí bảo vệ ngành
        
        newState.nationalMetrics = {
          ...newState.nationalMetrics,
          domesticControl: Math.min(newState.nationalMetrics.domesticControl + 5, 100)
        };
        
        // Tăng power cho Chính phủ và domestic enterprises trong sector
        newState.players = newState.players.map(p => {
          if (p.id === player.id && p.type === PlayerType.GOVERNMENT) {
            return {
              ...p,
              capital: p.capital - protectionCost,
              power: Math.min(p.power + 5, 100)
            };
          }
          if (p.type === PlayerType.ENTERPRISE && 
              p.sector === action.sector && 
              p.capitalType === CapitalType.DOMESTIC) {
            return {
              ...p,
              power: Math.min(p.power + 4, 100)
            };
          }
          return p;
        });
      }
      break;
    }

    case ActionType.APPLY_SPECIAL_TAX: {
      const taxAmount = action.amount || 0;
      const totalTaxCollected = newState.players.reduce((total, p) => {
        if (p.capitalType === CapitalType.FOREIGN && p.type === PlayerType.BANK) {
          return total + (p.capital * (taxAmount / 100));
        }
        return total;
      }, 0);
      
      // Thu thuế từ foreign capital và chuyển cho Chính phủ
      newState.players = newState.players.map(p => {
        if (p.capitalType === CapitalType.FOREIGN && p.type === PlayerType.BANK) {
          const tax = p.capital * (taxAmount / 100);
          return {
            ...p,
            capital: p.capital - tax,
            power: Math.max(p.power - 2, 0)
          };
        }
        // Chính phủ nhận tiền thuế và tăng power
        if (p.id === player.id && p.type === PlayerType.GOVERNMENT) {
          return {
            ...p,
            capital: p.capital + totalTaxCollected,
            power: Math.min(p.power + 4, 100)
          };
        }
        return p;
      });
      
      newState.nationalMetrics = {
        ...newState.nationalMetrics,
        economicSovereignty: Math.min(newState.nationalMetrics.economicSovereignty + 3, 100)
      };
      break;
    }

    case ActionType.COOPERATE_CAPITAL: {
      if (action.target && action.amount) {
        const partner = newState.players.find(p => p.id === action.target);
        const cooperationCost = action.amount;
        
        if (partner) {
          newState.players = newState.players.map(p => {
            if (p.id === player.id) {
              return {
                ...p,
                capital: p.capital - cooperationCost,
                power: Math.min(p.power + 5, 100) // Cả 2 bên đều tăng power
              };
            }
            if (p.id === action.target) {
              return {
                ...p,
                capital: p.capital + cooperationCost,
                power: Math.min(p.power + 3, 100)
              };
            }
            return p;
          });
          
          // Tăng GDP nếu cả 2 đều domestic
          if (player.capitalType === CapitalType.DOMESTIC && partner.capitalType === CapitalType.DOMESTIC) {
            newState.nationalMetrics = {
              ...newState.nationalMetrics,
              gdpGrowth: newState.nationalMetrics.gdpGrowth + 0.4,
              domesticControl: Math.min(newState.nationalMetrics.domesticControl + 2, 100)
            };
          }
        }
      }
      break;
    }

    case ActionType.SELL_SHARES: {
      if (action.target && action.amount) {
        const buyer = newState.players.find(p => p.id === action.target);
        
        if (buyer) {
          const shareValue = action.amount;
          
          newState.players = newState.players.map(p => {
            if (p.id === player.id) {
              // Người bán nhận tiền, mất power
              return {
                ...p,
                capital: p.capital + shareValue,
                power: Math.max(p.power - 4, 0)
              };
            }
            if (p.id === action.target) {
              // Người mua mất tiền, tăng power
              return {
                ...p,
                capital: p.capital - shareValue,
                power: Math.min(p.power + 5, 100)
              };
            }
            return p;
          });
          
          // Nếu bán cho nước ngoài, giảm domestic control
          if (player.capitalType === CapitalType.DOMESTIC && buyer.capitalType === CapitalType.FOREIGN) {
            newState.nationalMetrics = {
              ...newState.nationalMetrics,
              domesticControl: Math.max(newState.nationalMetrics.domesticControl - 3, 0),
              foreignDependency: Math.min(newState.nationalMetrics.foreignDependency + 3, 100)
            };
          }
        }
      }
      break;
    }
  }

  return newState;
}

// Phân tích AI cho action
export function analyzeAction(state: GameState, action: Action): AIAnalysis {
  const player = state.players.find(p => p.id === action.playerId);
  if (!player) {
    return {
      actionId: action.id,
      consequences: [],
      powerShift: [],
      nationalImpact: {
        domesticControlChange: 0,
        sovereigntyChange: 0,
        monopolyChange: 0,
        overallImpact: 'NEUTRAL',
        explanation: 'Không tìm thấy người chơi'
      },
      recommendations: []
    };
  }

  const consequences: string[] = [];
  const powerShift: PowerShift[] = [];
  let nationalImpact: NationalImpactAnalysis = {
    domesticControlChange: 0,
    sovereigntyChange: 0,
    monopolyChange: 0,
    overallImpact: 'NEUTRAL',
    explanation: ''
  };
  const recommendations: string[] = [];

  switch (action.type) {
    case ActionType.BUY_SHARES: {
      const target = state.players.find(p => p.id === action.target);
      if (target && action.amount) {
        const sharePercentage = (action.amount / target.capital) * 100;
        
        consequences.push(
          `${player.name} mua ${sharePercentage.toFixed(1)}% cổ phần của ${target.name}`,
          `Quyền lực của ${player.name} tăng, kiểm soát tăng lên ${target.name}`
        );

        if (player.capitalType === CapitalType.FOREIGN) {
          consequences.push(
            `Vốn nước ngoài gia tăng kiểm soát doanh nghiệp Việt Nam`,
            `Nguy cơ mất chủ quyền kinh tế trong ngành ${target.sector}`
          );
          
          nationalImpact = {
            domesticControlChange: -sharePercentage * 0.05,
            sovereigntyChange: -sharePercentage * 0.03,
            monopolyChange: sharePercentage * 0.02,
            overallImpact: 'NEGATIVE',
            explanation: 'Vốn nước ngoài tăng kiểm soát, giảm chủ quyền kinh tế quốc gia'
          };
          
          recommendations.push(
            'Chính phủ nên xem xét ban hành quy định hạn chế sở hữu nước ngoài',
            'Hỗ trợ doanh nghiệp trong nước tăng vốn để chống thâu tóm'
          );
        } else {
          nationalImpact = {
            domesticControlChange: 0,
            sovereigntyChange: 0,
            monopolyChange: sharePercentage * 0.02,
            overallImpact: 'NEUTRAL',
            explanation: 'Tái cấu trúc sở hữu trong nội bộ, cần theo dõi mức độ độc quyền'
          };
          
          recommendations.push(
            'Giám sát để tránh hình thành độc quyền trong nước'
          );
        }
        
        powerShift.push({
          playerId: player.id,
          playerName: player.name,
          oldPower: player.power,
          newPower: player.power + sharePercentage * 0.1,
          change: sharePercentage * 0.1
        });
      }
      break;
    }

    case ActionType.MARKET_MANIPULATION: {
      const manipulationCost = action.amount || 150000;
      consequences.push(
        `${player.name} chi ${(manipulationCost / 1000000).toFixed(1)} triệu thao túng thị trường ngành ${action.sector}`,
        `Quyền lực tăng +4 điểm`,
        'Doanh nghiệp cạnh tranh trong ngành mất -2 power',
        'Ổn định tài chính giảm -3 điểm',
        'Doanh nghiệp nhỏ trong ngành bị ảnh hưởng tiêu cực'
      );
      
      nationalImpact = {
        domesticControlChange: 0,
        sovereigntyChange: -2,
        monopolyChange: 3,
        overallImpact: 'NEGATIVE',
        explanation: 'Thao túng thị trường gây mất ổn định, tăng độc quyền và rủi ro hệ thống'
      };
      
      powerShift.push({
        playerId: player.id,
        playerName: player.name,
        oldPower: player.power,
        newPower: player.power + 4,
        change: 4
      });
      
      recommendations.push(
        'Chính phủ cần tăng cường giám sát thị trường',
        'Xem xét biện pháp trừng phạt hành vi thao túng',
        'Bảo vệ doanh nghiệp vừa và nhỏ'
      );
      break;
    }

    case ActionType.PROTECT_KEY_SECTOR: {
      consequences.push(
        `Chính phủ chi ${((action.amount || 300000) / 1000000).toFixed(1)} triệu để bảo vệ ngành ${action.sector}`,
        `Quyền lực Chính phủ tăng +5 điểm`,
        'Doanh nghiệp trong nước được củng cố vị thế (+4 power)',
        'Vốn nước ngoài bị hạn chế trong ngành này'
      );
      
      nationalImpact = {
        domesticControlChange: 5,
        sovereigntyChange: 5,
        monopolyChange: -2,
        overallImpact: 'POSITIVE',
        explanation: 'Bảo vệ ngành trọng yếu, tăng chủ quyền kinh tế và uy tín Chính phủ'
      };
      
      powerShift.push({
        playerId: player.id,
        playerName: player.name,
        oldPower: player.power,
        newPower: player.power + 5,
        change: 5
      });
      
      recommendations.push(
        'Tiếp tục hỗ trợ doanh nghiệp trong nước phát triển công nghệ',
        'Cân bằng giữa bảo vệ và thu hút FDI chất lượng cao'
      );
      break;
    }

    case ActionType.ENACT_LAW:
    case ActionType.CONTROL_FOREIGN_CAPITAL: {
      const lawCost = action.amount || 200000;
      consequences.push(
        `Chính phủ chi ${(lawCost / 1000000).toFixed(1)} triệu để ban hành luật kiểm soát vốn ngoại`,
        `Quyền lực Chính phủ tăng +6 điểm`,
        'Chủ quyền kinh tế được củng cố (+5 điểm)',
        'Vốn nước ngoài bị giảm uy lực (-3 power)',
        'Có thể ảnh hưởng đến thu hút đầu tư ngắn hạn'
      );
      
      nationalImpact = {
        domesticControlChange: 4,
        sovereigntyChange: 5,
        monopolyChange: -1,
        overallImpact: 'POSITIVE',
        explanation: 'Tăng kiểm soát quốc gia và quyền lực Chính phủ, bảo vệ lợi ích dài hạn'
      };
      
      powerShift.push({
        playerId: player.id,
        playerName: player.name,
        oldPower: player.power,
        newPower: player.power + 6,
        change: 6
      });
      
      recommendations.push(
        'Đảm bảo tính minh bạch và dự đoán được của chính sách',
        'Tạo môi trường kinh doanh công bằng cho tất cả các chủ thể'
      );
      break;
    }

    case ActionType.RESIST_TAKEOVER: {
      const attacker = state.players.find(p => p.id === action.target);
      const defenseCost = action.amount || 250000;
      consequences.push(
        `${player.name} chi ${(defenseCost / 1000000).toFixed(1)} triệu chống lại thâu tóm từ ${attacker?.name}`,
        `${player.name} tăng +4 power`,
        `${attacker?.name} mất -3 power và giảm 15% cổ phần`,
        'Doanh nghiệp trong nước bảo vệ được độc lập'
      );
      
      nationalImpact = {
        domesticControlChange: 3,
        sovereigntyChange: 2,
        monopolyChange: -1,
        overallImpact: 'POSITIVE',
        explanation: 'Doanh nghiệp tự bảo vệ thành công, giữ vững kiểm soát trong nước'
      };
      
      if (attacker) {
        powerShift.push(
          {
            playerId: player.id,
            playerName: player.name,
            oldPower: player.power,
            newPower: player.power + 4,
            change: 4
          },
          {
            playerId: attacker.id,
            playerName: attacker.name,
            oldPower: attacker.power,
            newPower: attacker.power - 3,
            change: -3
          }
        );
      }
      
      recommendations.push(
        'Chính phủ nên hỗ trợ pháp lý cho doanh nghiệp chống thâu tóm',
        'Tăng cường giám sát các hoạt động M&A có nguy cơ cao'
      );
      break;
    }

    case ActionType.INVEST_CAPITAL: {
      consequences.push(
        `${player.name} đầu tư vốn vào ngành ${action.sector}`,
        'Quy mô sản xuất tăng, tạo thêm việc làm',
        'Quyền lực và vốn của chủ thể tăng lên'
      );

      if (player.capitalType === CapitalType.DOMESTIC) {
        nationalImpact = {
          domesticControlChange: 3,
          sovereigntyChange: 2,
          monopolyChange: 1,
          overallImpact: 'POSITIVE',
          explanation: 'Vốn trong nước tăng, tăng năng lực kinh tế quốc gia'
        };
        recommendations.push(
          'Hỗ trợ doanh nghiệp nâng cao công nghệ và năng suất',
          'Khuyến khích phát triển bền vững'
        );
      } else {
        nationalImpact = {
          domesticControlChange: -2,
          sovereigntyChange: -1,
          monopolyChange: 2,
          overallImpact: 'NEUTRAL',
          explanation: 'Vốn FDI tăng, cần cân bằng lợi ích quốc gia'
        };
        recommendations.push(
          'Đảm bảo tuân thủ quy định về môi trường',
          'Khuyến khích chuyển giao công nghệ'
        );
      }
      break;
    }

    case ActionType.COOPERATE_CAPITAL: {
      const partner = state.players.find(p => p.id === action.target);
      const cooperationAmount = action.amount || 0;
      if (partner) {
        consequences.push(
          `${player.name} chi ${(cooperationAmount / 1000000).toFixed(1)} triệu hợp tác với ${partner.name}`,
          `${player.name} tăng +5 power, ${partner.name} tăng +3 power`,
          'Sức mạnh tài chính của cả hai tăng lên',
          'Tạo liên minh kinh doanh mạnh mẽ'
        );

        const bothDomestic = player.capitalType === CapitalType.DOMESTIC && partner.capitalType === CapitalType.DOMESTIC;
        
        nationalImpact = {
          domesticControlChange: bothDomestic ? 2 : -1,
          sovereigntyChange: bothDomestic ? 1 : -2,
          monopolyChange: 2,
          overallImpact: bothDomestic ? 'POSITIVE' : 'NEUTRAL',
          explanation: bothDomestic 
            ? 'Liên minh doanh nghiệp trong nước, tăng sức cạnh tranh và GDP (+0.4)'
            : 'Hợp tác xuyên biên giới, cần giám sát quyền kiểm soát'
        };
        
        powerShift.push(
          {
            playerId: player.id,
            playerName: player.name,
            oldPower: player.power,
            newPower: player.power + 5,
            change: 5
          },
          {
            playerId: partner.id,
            playerName: partner.name,
            oldPower: partner.power,
            newPower: partner.power + 3,
            change: 3
          }
        );

        recommendations.push(
          bothDomestic 
            ? 'Hỗ trợ liên minh doanh nghiệp trong nước phát triển' 
            : 'Đảm bảo doanh nghiệp trong nước không bị thâu tóm qua hợp tác'
        );
      }
      break;
    }

    case ActionType.EXPAND_SCALE: {
      const expansionCost = action.amount || 400000;
      consequences.push(
        `${player.name} chi ${(expansionCost / 1000000).toFixed(1)} triệu mở rộng quy mô`,
        `Quyền lực tăng +5 điểm`,
        'Thị phần tăng, năng lực sản xuất mở rộng',
        'GDP tăng +0.3 điểm',
        'Có thể dẫn đến tăng độ tập trung thị trường'
      );

      nationalImpact = {
        domesticControlChange: player.capitalType === CapitalType.DOMESTIC ? 2 : -1,
        sovereigntyChange: player.capitalType === CapitalType.DOMESTIC ? 1 : -1,
        monopolyChange: 3,
        overallImpact: player.capitalType === CapitalType.DOMESTIC ? 'POSITIVE' : 'NEUTRAL',
        explanation: player.capitalType === CapitalType.DOMESTIC
          ? 'Doanh nghiệp trong nước lớn mạnh, thúc đẩy kinh tế nhưng cần kiểm soát độc quyền'
          : 'Doanh nghiệp FDI mở rộng, cần cân bằng lợi ích'
      };
      
      powerShift.push({
        playerId: player.id,
        playerName: player.name,
        oldPower: player.power,
        newPower: player.power + 5,
        change: 5
      });

      recommendations.push(
        'Giám sát mức độ tập trung thị trường',
        player.capitalType === CapitalType.DOMESTIC
          ? 'Hỗ trợ doanh nghiệp phát triển công nghệ'
          : 'Đảm bảo tuân thủ luật cạnh tranh'
      );
      break;
    }

    case ActionType.SELL_SHARES: {
      const buyer = state.players.find(p => p.id === action.target);
      const shareValue = action.amount || 0;
      if (buyer && shareValue) {
        consequences.push(
          `${player.name} bán cổ phần ${(shareValue / 1000000).toFixed(1)} triệu cho ${buyer.name}`,
          `${player.name} mất -4 power, ${buyer.name} tăng +5 power`,
          'Nhận được vốn ngay nhưng mất quyền kiểm soát',
          'Cấu trúc sở hữu thay đổi'
        );

        powerShift.push(
          {
            playerId: player.id,
            playerName: player.name,
            oldPower: player.power,
            newPower: player.power - 4,
            change: -4
          },
          {
            playerId: buyer.id,
            playerName: buyer.name,
            oldPower: buyer.power,
            newPower: buyer.power + 5,
            change: 5
          }
        );

        if (player.capitalType === CapitalType.DOMESTIC && buyer.capitalType === CapitalType.FOREIGN) {
          nationalImpact = {
            domesticControlChange: -3,
            sovereigntyChange: -4,
            monopolyChange: 1,
            overallImpact: 'NEGATIVE',
            explanation: 'Doanh nghiệp trong nước chuyển quyền kiểm soát sang nước ngoài - nguy cơ mất chủ quyền'
          };
          recommendations.push(
            'Chính phủ cần can thiệp để ngăn chặn mất kiểm soát',
            'Hỗ trợ doanh nghiệp trong nước tìm nguồn vốn thay thế',
            'Áp dụng quy định sở hữu nước ngoài chặt chẽ hơn'
          );
        } else {
          nationalImpact = {
            domesticControlChange: 0,
            sovereigntyChange: 0,
            monopolyChange: 0,
            overallImpact: 'NEUTRAL',
            explanation: 'Tái cấu trúc sở hữu nội bộ, không ảnh hưởng lớn'
          };
          recommendations.push(
            'Đảm bảo tính minh bạch trong giao dịch'
          );
        }
      }
      break;
    }

    case ActionType.DEVELOP_FINTECH: {
      const devCost = action.amount || 500000;
      consequences.push(
        `${player.name} chi ${(devCost / 1000000).toFixed(1)} triệu phát triển công nghệ tài chính`,
        `Quyền lực tăng +6 điểm`,
        'Đổi mới công nghệ, tăng hiệu quả hoạt động',
        player.capitalType === CapitalType.DOMESTIC ? 'GDP tăng +0.3 điểm' : 'Cần giám sát dữ liệu người dùng',
        'Có thể làm thay đổi cảnh quan ngành tài chính'
      );

      nationalImpact = {
        domesticControlChange: player.capitalType === CapitalType.DOMESTIC ? 3 : -2,
        sovereigntyChange: player.capitalType === CapitalType.DOMESTIC ? 2 : -2,
        monopolyChange: 2,
        overallImpact: player.capitalType === CapitalType.DOMESTIC ? 'POSITIVE' : 'NEUTRAL',
        explanation: player.capitalType === CapitalType.DOMESTIC
          ? 'Công nghệ tài chính trong nước phát triển - tốt cho chủ quyền số và tăng trưởng'
          : 'Công ty nước ngoài kiểm soát công nghệ tài chính - cần giám sát chặt chẽ'
      };
      
      powerShift.push({
        playerId: player.id,
        playerName: player.name,
        oldPower: player.power,
        newPower: player.power + 6,
        change: 6
      });

      recommendations.push(
        player.capitalType === CapitalType.DOMESTIC
          ? 'Tiếp tục đầu tư R&D và đào tạo nhân lực'
          : 'Đảm bảo an ninh dữ liệu và bảo vệ thông tin người dùng',
        'Xây dựng khung pháp lý cho Fintech',
        'Khuyến khích sáng tạo nhưng kiểm soát rủi ro'
      );
      break;
    }

    case ActionType.APPLY_SPECIAL_TAX: {
      const taxRate = action.amount || 0;
      const estimatedRevenue = state.players
        .filter(p => p.capitalType === CapitalType.FOREIGN && p.type === PlayerType.BANK)
        .reduce((sum, p) => sum + (p.capital * (taxRate / 100)), 0);
      
      consequences.push(
        `Chính phủ áp thuế ${taxRate}% cho vốn nước ngoài`,
        `Thu được khoảng ${(estimatedRevenue / 1000000).toFixed(1)} triệu từ thuế`,
        `Quyền lực Chính phủ tăng +4 điểm`,
        'Vốn nước ngoài bị giảm uy lực (-2 power)',
        'Có thể ảnh hưởng đến hoạt động của ngân hàng nước ngoài'
      );

      nationalImpact = {
        domesticControlChange: 2,
        sovereigntyChange: 3,
        monopolyChange: -1,
        overallImpact: 'POSITIVE',
        explanation: 'Tăng nguồn thu cho ngân sách và quyền lực Chính phủ, điều tiết thị trường'
      };
      
      powerShift.push({
        playerId: player.id,
        playerName: player.name,
        oldPower: player.power,
        newPower: player.power + 4,
        change: 4
      });

      recommendations.push(
        'Đảm bảo mức thuế hợp lý để không kìm hãm phát triển',
        'Sử dụng nguồn thu để đầu tư phát triển',
        'Minh bạch trong việc sử dụng ngân sách'
      );
      break;
    }

    default: {
      // Nếu không match case nào, vẫn tạo phân tích cơ bản
      consequences.push(
        `${player.name} thực hiện hành động ${action.type}`,
        'Tác động đang được đánh giá'
      );
      
      nationalImpact = {
        domesticControlChange: 0,
        sovereigntyChange: 0,
        monopolyChange: 0,
        overallImpact: 'NEUTRAL',
        explanation: 'Hành động có tác động nhỏ hoặc cần thêm thời gian để đánh giá đầy đủ'
      };
      
      recommendations.push(
        'Tiếp tục theo dõi diễn biến thị trường'
      );
    }
  }

  return {
    actionId: action.id,
    consequences,
    powerShift,
    nationalImpact,
    recommendations
  };
}
