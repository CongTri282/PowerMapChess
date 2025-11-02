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
  maxTurns: 20,
  nationalMetrics: {
    domesticControl: 70,
    economicSovereignty: 65,
    foreignDependency: 35,
    monopolyLevel: 40,
    gdpGrowth: 6.5,
    financialStability: 75
  },
  isGameOver: false
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
      
      return {
        ...updatedState,
        actions: [...updatedState.actions, newAction]
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
        isGameOver
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
          
          newState.players = newState.players.map(p => {
            if (p.id === player.id) {
              if (existingShare) {
                return {
                  ...p,
                  capital: p.capital - action.amount!,
                  power: Math.min(p.power + sharePercentage * 0.1, 100),
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
                  power: Math.min(p.power + sharePercentage * 0.1, 100),
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
      newState.players = newState.players.map(p => {
        if (p.id === player.id) {
          return {
            ...p,
            capital: p.capital - (action.amount || 1000000),
            power: Math.min(p.power + 5, 100)
          };
        }
        return p;
      });
      break;
    }

    case ActionType.MARKET_MANIPULATION: {
      newState.players = newState.players.map(p => {
        if (p.id === player.id) {
          return {
            ...p,
            power: Math.min(p.power + 3, 100)
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
      newState.players = newState.players.map(p => {
        if (p.id === player.id) {
          return {
            ...p,
            capital: p.capital - (action.amount || 500000),
            power: Math.min(p.power + 4, 100)
          };
        }
        return p;
      });
      
      newState.nationalMetrics = {
        ...newState.nationalMetrics,
        gdpGrowth: newState.nationalMetrics.gdpGrowth + 0.2
      };
      break;
    }

    case ActionType.RESIST_TAKEOVER: {
      if (action.target) {
        const attacker = newState.players.find(p => p.id === action.target);
        if (attacker) {
          newState.players = newState.players.map(p => {
            if (p.id === player.id) {
              return {
                ...p,
                capital: p.capital - (action.amount || 300000),
                power: Math.min(p.power + 3, 100)
              };
            }
            if (p.id === action.target) {
              // Giảm shares của attacker
              return {
                ...p,
                power: Math.max(p.power - 2, 0),
                shares: p.shares.map(s =>
                  s.enterpriseId === player.id
                    ? { ...s, percentage: Math.max(s.percentage - 10, 0) }
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
      newState.nationalMetrics = {
        ...newState.nationalMetrics,
        economicSovereignty: Math.min(newState.nationalMetrics.economicSovereignty + 5, 100),
        foreignDependency: Math.max(newState.nationalMetrics.foreignDependency - 5, 0)
      };
      
      // Giảm power của foreign capital
      newState.players = newState.players.map(p => {
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
        newState.nationalMetrics = {
          ...newState.nationalMetrics,
          domesticControl: Math.min(newState.nationalMetrics.domesticControl + 5, 100)
        };
        
        // Tăng power cho domestic enterprises trong sector
        newState.players = newState.players.map(p => {
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
      
      // Thu thuế từ foreign capital
      newState.players = newState.players.map(p => {
        if (p.capitalType === CapitalType.FOREIGN && p.type === PlayerType.BANK) {
          const tax = p.capital * (taxAmount / 100);
          return {
            ...p,
            capital: p.capital - tax,
            power: Math.max(p.power - 2, 0)
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
      consequences.push(
        `${player.name} thao túng thị trường ngành ${action.sector}`,
        'Ổn định tài chính giảm, rủi ro hệ thống tăng',
        'Doanh nghiệp nhỏ trong ngành bị ảnh hưởng tiêu cực'
      );
      
      nationalImpact = {
        domesticControlChange: 0,
        sovereigntyChange: -2,
        monopolyChange: 3,
        overallImpact: 'NEGATIVE',
        explanation: 'Thao túng thị trường gây mất ổn định, tăng độc quyền'
      };
      
      recommendations.push(
        'Chính phủ cần tăng cường giám sát thị trường',
        'Xem xét biện pháp trừng phạt hành vi thao túng',
        'Bảo vệ doanh nghiệp vừa và nhỏ'
      );
      break;
    }

    case ActionType.PROTECT_KEY_SECTOR: {
      consequences.push(
        `Chính phủ bảo vệ ngành ${action.sector}`,
        'Doanh nghiệp trong nước được củng cố vị thế',
        'Vốn nước ngoài bị hạn chế trong ngành này'
      );
      
      nationalImpact = {
        domesticControlChange: 5,
        sovereigntyChange: 5,
        monopolyChange: -2,
        overallImpact: 'POSITIVE',
        explanation: 'Bảo vệ ngành trọng yếu, tăng chủ quyền kinh tế'
      };
      
      recommendations.push(
        'Tiếp tục hỗ trợ doanh nghiệp trong nước phát triển công nghệ',
        'Cân bằng giữa bảo vệ và thu hút FDI chất lượng cao'
      );
      break;
    }

    case ActionType.ENACT_LAW:
    case ActionType.CONTROL_FOREIGN_CAPITAL: {
      consequences.push(
        'Chính phủ tăng cường kiểm soát vốn nước ngoài',
        'Chủ quyền kinh tế được củng cố',
        'Có thể ảnh hưởng đến thu hút đầu tư ngắn hạn'
      );
      
      nationalImpact = {
        domesticControlChange: 4,
        sovereigntyChange: 5,
        monopolyChange: -1,
        overallImpact: 'POSITIVE',
        explanation: 'Tăng kiểm soát quốc gia, bảo vệ lợi ích dài hạn'
      };
      
      recommendations.push(
        'Đảm bảo tính minh bạch và dự đoán được của chính sách',
        'Tạo môi trường kinh doanh công bằng cho tất cả các chủ thể'
      );
      break;
    }

    case ActionType.RESIST_TAKEOVER: {
      const attacker = state.players.find(p => p.id === action.target);
      consequences.push(
        `${player.name} chống lại thâu tóm từ ${attacker?.name}`,
        'Doanh nghiệp trong nước bảo vệ được độc lập'
      );
      
      nationalImpact = {
        domesticControlChange: 3,
        sovereigntyChange: 2,
        monopolyChange: -1,
        overallImpact: 'POSITIVE',
        explanation: 'Doanh nghiệp tự bảo vệ, giữ vững kiểm soát trong nước'
      };
      
      recommendations.push(
        'Chính phủ nên hỗ trợ pháp lý cho doanh nghiệp chống thâu tóm'
      );
      break;
    }

    default: {
      nationalImpact = {
        domesticControlChange: 0,
        sovereigntyChange: 0,
        monopolyChange: 0,
        overallImpact: 'NEUTRAL',
        explanation: 'Tác động nhỏ đến cấu trúc kinh tế quốc gia'
      };
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
