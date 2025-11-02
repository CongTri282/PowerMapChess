import type { Player, Position } from '../types';
import { PlayerType, CapitalType, Sector } from '../types';

// Màu sắc cho các loại player
export const PLAYER_COLORS = {
  BANK_DOMESTIC: '#2563eb', // Blue
  BANK_FOREIGN: '#dc2626', // Red
  ENTERPRISE_DOMESTIC: '#16a34a', // Green
  ENTERPRISE_FOREIGN: '#ea580c', // Orange
  GOVERNMENT: '#7c3aed' // Purple
};

// Tên ngành tiếng Việt
export const SECTOR_NAMES: Record<Sector, string> = {
  [Sector.BANKING]: 'Ngân hàng',
  [Sector.FINTECH]: 'Công nghệ tài chính',
  [Sector.MANUFACTURING]: 'Sản xuất',
  [Sector.TECHNOLOGY]: 'Công nghệ',
  [Sector.ENERGY]: 'Năng lượng',
  [Sector.AGRICULTURE]: 'Nông nghiệp',
  [Sector.RETAIL]: 'Bán lẻ',
  [Sector.REAL_ESTATE]: 'Bất động sản'
};

// Helper function để lấy tên ngành tiếng Việt
export function getSectorName(sector?: Sector): string {
  if (!sector) return '';
  return SECTOR_NAMES[sector] || sector;
}

// Tạo player mới
export function createPlayer(
  id: string,
  name: string,
  type: PlayerType,
  capitalType: CapitalType,
  capital: number,
  sector?: Sector
): Player {
  const colorKey = `${type}_${capitalType}` as keyof typeof PLAYER_COLORS;
  
  return {
    id,
    name,
    type,
    capitalType,
    capital,
    power: 50, // Bắt đầu với power = 50
    sector,
    shares: [],
    position: { x: 600, y: 350 }, // Default position, will be overridden
    color: PLAYER_COLORS[colorKey] || '#6b7280'
  };
}

// Tạo vị trí ngẫu nhiên trên bản đồ với collision detection
export function generateRandomPosition(existingPositions: Position[] = [], minDistance: number = 100): Position {
  const mapWidth = 1100; // Giảm từ 900 để có margin
  const mapHeight = 600; // Giảm từ 500 để có margin
  const margin = 80;
  const maxAttempts = 50;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const newPos: Position = {
      x: Math.random() * mapWidth + margin,
      y: Math.random() * mapHeight + margin
    };
    
    // Kiểm tra khoảng cách với các vị trí đã có
    let tooClose = false;
    for (const existingPos of existingPositions) {
      const distance = Math.sqrt(
        Math.pow(newPos.x - existingPos.x, 2) + 
        Math.pow(newPos.y - existingPos.y, 2)
      );
      if (distance < minDistance) {
        tooClose = true;
        break;
      }
    }
    
    if (!tooClose) {
      return newPos;
    }
  }
  
  // Nếu không tìm được vị trí tốt, trả về vị trí ngẫu nhiên
  return {
    x: Math.random() * mapWidth + margin,
    y: Math.random() * mapHeight + margin
  };
}

// Tạo vị trí theo cluster cho các nhóm player
export function generateClusteredPosition(
  playerType: PlayerType,
  index: number,
  totalInType: number
): Position {
  const mapWidth = 1200;
  const mapHeight = 700;
  
  // Định nghĩa vùng trung tâm cho từng loại
  const clusterCenters = {
    [PlayerType.GOVERNMENT]: { x: mapWidth * 0.5, y: mapHeight * 0.3 },
    [PlayerType.BANK]: { x: mapWidth * 0.3, y: mapHeight * 0.5 },
    [PlayerType.ENTERPRISE]: { x: mapWidth * 0.7, y: mapHeight * 0.6 }
  };
  
  const center = clusterCenters[playerType] || { x: mapWidth * 0.5, y: mapHeight * 0.5 };
  
  // Tạo vị trí theo vòng tròn xung quanh trung tâm
  const radius = 150 + (Math.floor(index / 6) * 80); // Tăng radius cho mỗi vòng
  const angleStep = (Math.PI * 2) / Math.min(totalInType, 6);
  const angle = angleStep * (index % 6) + (Math.random() - 0.5) * 0.3; // Random nhẹ
  
  return {
    x: Math.max(80, Math.min(mapWidth - 80, center.x + Math.cos(angle) * radius)),
    y: Math.max(80, Math.min(mapHeight - 80, center.y + Math.sin(angle) * radius))
  };
}

// Tạo danh sách players mẫu với vị trí phân bố tốt hơn
export function createSamplePlayers(count: number = 20): Player[] {
  const players: Player[] = [];
  const positions: Position[] = [];
  
  // Đếm số lượng từng loại để tính cluster
  const typeCounts = {
    [PlayerType.GOVERNMENT]: 0,
    [PlayerType.BANK]: 0,
    [PlayerType.ENTERPRISE]: 0
  };
  
  // 1 Chính phủ
  const govPlayer = createPlayer(
    'gov_1',
    'Chính phủ Việt Nam',
    PlayerType.GOVERNMENT,
    CapitalType.DOMESTIC,
    100000000
  );
  govPlayer.position = generateClusteredPosition(PlayerType.GOVERNMENT, typeCounts[PlayerType.GOVERNMENT]++, 1);
  positions.push(govPlayer.position);
  players.push(govPlayer);
  
  // 3-4 Ngân hàng/Quỹ nước ngoài
  const foreignBanks = [
    { name: 'Goldman Sachs Vietnam', capital: 50000000 },
    { name: 'JP Morgan Fund', capital: 45000000 },
    { name: 'Singapore Investment Corp', capital: 60000000 },
    { name: 'Korean Development Bank', capital: 40000000 }
  ];
  
  foreignBanks.slice(0, Math.min(4, Math.floor(count * 0.2))).forEach((bank, i) => {
    const player = createPlayer(
      `bank_foreign_${i + 1}`,
      bank.name,
      PlayerType.BANK,
      CapitalType.FOREIGN,
      bank.capital
    );
    player.position = generateClusteredPosition(PlayerType.BANK, typeCounts[PlayerType.BANK]++, 7);
    positions.push(player.position);
    players.push(player);
  });
  
  // 2-3 Ngân hàng trong nước
  const domesticBanks = [
    { name: 'Vietcombank', capital: 35000000 },
    { name: 'BIDV', capital: 32000000 },
    { name: 'VietinBank', capital: 30000000 }
  ];
  
  domesticBanks.slice(0, Math.min(3, Math.floor(count * 0.15))).forEach((bank, i) => {
    const player = createPlayer(
      `bank_domestic_${i + 1}`,
      bank.name,
      PlayerType.BANK,
      CapitalType.DOMESTIC,
      bank.capital
    );
    player.position = generateClusteredPosition(PlayerType.BANK, typeCounts[PlayerType.BANK]++, 7);
    positions.push(player.position);
    players.push(player);
  });
  
  // 5-7 Doanh nghiệp trong nước
  const domesticEnterprises = [
    { name: 'Vingroup', sector: Sector.REAL_ESTATE, capital: 25000000 },
    { name: 'FPT Corporation', sector: Sector.TECHNOLOGY, capital: 20000000 },
    { name: 'Viettel', sector: Sector.TECHNOLOGY, capital: 28000000 },
    { name: 'VinFast', sector: Sector.MANUFACTURING, capital: 22000000 },
    { name: 'Masan Group', sector: Sector.RETAIL, capital: 18000000 },
    { name: 'Hòa Phát', sector: Sector.MANUFACTURING, capital: 15000000 },
    { name: 'MoMo', sector: Sector.FINTECH, capital: 12000000 }
  ];
  
  const domesticEntCount = Math.min(7, Math.floor(count * 0.35));
  domesticEnterprises.slice(0, domesticEntCount).forEach((ent, i) => {
    const player = createPlayer(
      `ent_domestic_${i + 1}`,
      ent.name,
      PlayerType.ENTERPRISE,
      CapitalType.DOMESTIC,
      ent.capital,
      ent.sector
    );
    player.position = generateClusteredPosition(PlayerType.ENTERPRISE, typeCounts[PlayerType.ENTERPRISE]++, domesticEntCount + 6);
    positions.push(player.position);
    players.push(player);
  });
  
  // 4-6 Doanh nghiệp có vốn ngoại
  const foreignEnterprises = [
    { name: 'Samsung Vietnam', sector: Sector.TECHNOLOGY, capital: 35000000 },
    { name: 'Intel Vietnam', sector: Sector.TECHNOLOGY, capital: 30000000 },
    { name: 'Grab Vietnam', sector: Sector.FINTECH, capital: 18000000 },
    { name: 'Lazada Vietnam', sector: Sector.RETAIL, capital: 16000000 },
    { name: 'AIA Vietnam', sector: Sector.BANKING, capital: 20000000 },
    { name: 'Nestlé Vietnam', sector: Sector.MANUFACTURING, capital: 14000000 }
  ];
  
  const remainingSlots = count - players.length;
  foreignEnterprises.slice(0, remainingSlots).forEach((ent, i) => {
    const player = createPlayer(
      `ent_foreign_${i + 1}`,
      ent.name,
      PlayerType.ENTERPRISE,
      CapitalType.FOREIGN,
      ent.capital,
      ent.sector
    );
    player.position = generateClusteredPosition(PlayerType.ENTERPRISE, typeCounts[PlayerType.ENTERPRISE]++, domesticEntCount + remainingSlots);
    positions.push(player.position);
    players.push(player);
  });
  
  return players;
}

// Tính tổng vốn theo loại
export function calculateCapitalByType(players: Player[]): {
  domestic: number;
  foreign: number;
  domesticPercentage: number;
  foreignPercentage: number;
} {
  const domestic = players
    .filter(p => p.capitalType === CapitalType.DOMESTIC)
    .reduce((sum, p) => sum + p.capital, 0);
    
  const foreign = players
    .filter(p => p.capitalType === CapitalType.FOREIGN)
    .reduce((sum, p) => sum + p.capital, 0);
    
  const total = domestic + foreign;
  
  return {
    domestic,
    foreign,
    domesticPercentage: total > 0 ? (domestic / total) * 100 : 0,
    foreignPercentage: total > 0 ? (foreign / total) * 100 : 0
  };
}

// Tính market share theo sector
export function calculateMarketShare(players: Player[], sector: Sector): {
  domestic: number;
  foreign: number;
} {
  const sectorPlayers = players.filter(
    p => p.type === PlayerType.ENTERPRISE && p.sector === sector
  );
  
  const totalCapital = sectorPlayers.reduce((sum, p) => sum + p.capital, 0);
  
  const domesticCapital = sectorPlayers
    .filter(p => p.capitalType === CapitalType.DOMESTIC)
    .reduce((sum, p) => sum + p.capital, 0);
    
  const foreignCapital = sectorPlayers
    .filter(p => p.capitalType === CapitalType.FOREIGN)
    .reduce((sum, p) => sum + p.capital, 0);
  
  return {
    domestic: totalCapital > 0 ? (domesticCapital / totalCapital) * 100 : 0,
    foreign: totalCapital > 0 ? (foreignCapital / totalCapital) * 100 : 0
  };
}

// Format số tiền
export function formatCurrency(amount: number): string {
  if (amount >= 1000000000) {
    return `${(amount / 1000000000).toFixed(1)}B VND`;
  } else if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M VND`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K VND`;
  }
  return `${amount.toFixed(0)} VND`;
}

// Format phần trăm
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}
