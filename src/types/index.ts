// Các loại chủ thể trong game
export const PlayerType = {
  BANK: 'BANK', // Ngân hàng/Quỹ đầu tư
  ENTERPRISE: 'ENTERPRISE', // Doanh nghiệp
  GOVERNMENT: 'GOVERNMENT' // Chính phủ Việt Nam
} as const;
export type PlayerType = typeof PlayerType[keyof typeof PlayerType];

// Các loại hành động cho mỗi chủ thể
export const ActionType = {
  // Ngân hàng/Quỹ đầu tư
  INVEST_CAPITAL: 'INVEST_CAPITAL',
  BUY_SHARES: 'BUY_SHARES',
  DEVELOP_FINTECH: 'DEVELOP_FINTECH',
  MARKET_MANIPULATION: 'MARKET_MANIPULATION',
  
  // Doanh nghiệp
  COOPERATE_CAPITAL: 'COOPERATE_CAPITAL',
  EXPAND_SCALE: 'EXPAND_SCALE',
  SELL_SHARES: 'SELL_SHARES',
  RESIST_TAKEOVER: 'RESIST_TAKEOVER',
  
  // Chính phủ
  ENACT_LAW: 'ENACT_LAW',
  CONTROL_FOREIGN_CAPITAL: 'CONTROL_FOREIGN_CAPITAL',
  PROTECT_KEY_SECTOR: 'PROTECT_KEY_SECTOR',
  APPLY_SPECIAL_TAX: 'APPLY_SPECIAL_TAX'
} as const;
export type ActionType = typeof ActionType[keyof typeof ActionType];

// Ngành nghề trọng yếu
export const Sector = {
  BANKING: 'BANKING',
  FINTECH: 'FINTECH',
  MANUFACTURING: 'MANUFACTURING',
  TECHNOLOGY: 'TECHNOLOGY',
  ENERGY: 'ENERGY',
  AGRICULTURE: 'AGRICULTURE',
  RETAIL: 'RETAIL',
  REAL_ESTATE: 'REAL_ESTATE'
} as const;
export type Sector = typeof Sector[keyof typeof Sector];

// Loại vốn
export const CapitalType = {
  DOMESTIC: 'DOMESTIC', // Vốn trong nước
  FOREIGN: 'FOREIGN' // Vốn nước ngoài
} as const;
export type CapitalType = typeof CapitalType[keyof typeof CapitalType];

// Interface cho người chơi
export interface Player {
  id: string;
  name: string;
  type: PlayerType;
  capitalType: CapitalType;
  capital: number; // Vốn hiện tại
  power: number; // Quyền lực (0-100)
  sector?: Sector; // Ngành nghề (cho doanh nghiệp)
  shares: ShareHolding[]; // Cổ phần nắm giữ
  position: Position; // Vị trí trên bản đồ
  color: string; // Màu đại diện
}

// Cổ phần
export interface ShareHolding {
  enterpriseId: string;
  percentage: number; // Phần trăm cổ phần
  value: number; // Giá trị
}

// Vị trí trên bản đồ
export interface Position {
  x: number;
  y: number;
}

// Hành động trong game
export interface Action {
  id: string;
  playerId: string;
  type: ActionType;
  target?: string; // ID của đối tượng bị tác động
  amount?: number; // Số tiền/phần trăm
  sector?: Sector;
  timestamp: number;
  description: string;
}

// Dòng vốn
export interface CapitalFlow {
  id: string;
  from: string; // Player ID
  to: string; // Player ID
  amount: number;
  type: 'INVESTMENT' | 'SHARE_PURCHASE' | 'COOPERATION' | 'TAX';
  timestamp: number;
}

// Sự kiện ngẫu nhiên
export interface GameEvent {
  id: string;
  title: string;
  description: string;
  impact: EventImpact[];
  requiresAction?: boolean;
  options?: EventOption[];
  timestamp: number;
}

// Ảnh hưởng của sự kiện
export interface EventImpact {
  playerType?: PlayerType;
  sector?: Sector;
  capitalChange?: number;
  powerChange?: number;
  description: string;
}

// Lựa chọn trong sự kiện
export interface EventOption {
  id: string;
  label: string;
  impacts: EventImpact[];
}

// Chỉ số quốc gia
export interface NationalMetrics {
  domesticControl: number; // Mức độ kiểm soát trong nước (0-100)
  economicSovereignty: number; // Chủ quyền kinh tế (0-100)
  foreignDependency: number; // Phụ thuộc nước ngoài (0-100)
  monopolyLevel: number; // Mức độ độc quyền (0-100)
  gdpGrowth: number; // Tăng trưởng GDP
  financialStability: number; // Ổn định tài chính (0-100)
}

// Trạng thái game
export interface GameState {
  players: Player[];
  actions: Action[];
  capitalFlows: CapitalFlow[];
  events: GameEvent[];
  currentTurn: number;
  maxTurns: number;
  nationalMetrics: NationalMetrics;
  isGameOver: boolean;
  winner?: string;
  actionsPerTurn: number; // Số lần hành động tối đa mỗi lượt
  playersActedThisTurn: string[]; // Danh sách ID người chơi đã hành động lượt này
}

// Phân tích AI
export interface AIAnalysis {
  actionId: string;
  consequences: string[];
  powerShift: PowerShift[];
  nationalImpact: NationalImpactAnalysis;
  recommendations: string[];
}

// Thay đổi quyền lực
export interface PowerShift {
  playerId: string;
  playerName: string;
  oldPower: number;
  newPower: number;
  change: number;
}

// Phân tích tác động quốc gia
export interface NationalImpactAnalysis {
  domesticControlChange: number;
  sovereigntyChange: number;
  monopolyChange: number;
  overallImpact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  explanation: string;
}

// Kết quả game
export interface GameResult {
  winner: Player;
  powerRankings: PowerRanking[];
  nationalMetrics: NationalMetrics;
  keyEvents: GameEvent[];
  lessons: string[];
  summary: string;
}

// Xếp hạng quyền lực
export interface PowerRanking {
  rank: number;
  player: Player;
  finalPower: number;
  capitalGrowth: number;
  influence: number;
}
