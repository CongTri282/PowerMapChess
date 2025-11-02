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
    position: generateRandomPosition(),
    color: PLAYER_COLORS[colorKey] || '#6b7280'
  };
}

// Tạo vị trí ngẫu nhiên trên bản đồ
export function generateRandomPosition(): Position {
  return {
    x: Math.random() * 800 + 100,
    y: Math.random() * 400 + 100
  };
}

// Tạo danh sách players mẫu
export function createSamplePlayers(count: number = 20): Player[] {
  const players: Player[] = [];
  
  // 1 Chính phủ
  players.push(
    createPlayer(
      'gov_1',
      'Chính phủ Việt Nam',
      PlayerType.GOVERNMENT,
      CapitalType.DOMESTIC,
      100000000
    )
  );
  
  // 3-4 Ngân hàng/Quỹ nước ngoài
  const foreignBanks = [
    { name: 'Goldman Sachs Vietnam', capital: 50000000 },
    { name: 'JP Morgan Fund', capital: 45000000 },
    { name: 'Singapore Investment Corp', capital: 60000000 },
    { name: 'Korean Development Bank', capital: 40000000 }
  ];
  
  foreignBanks.slice(0, Math.min(4, Math.floor(count * 0.2))).forEach((bank, i) => {
    players.push(
      createPlayer(
        `bank_foreign_${i + 1}`,
        bank.name,
        PlayerType.BANK,
        CapitalType.FOREIGN,
        bank.capital
      )
    );
  });
  
  // 2-3 Ngân hàng trong nước
  const domesticBanks = [
    { name: 'Vietcombank', capital: 35000000 },
    { name: 'BIDV', capital: 32000000 },
    { name: 'VietinBank', capital: 30000000 }
  ];
  
  domesticBanks.slice(0, Math.min(3, Math.floor(count * 0.15))).forEach((bank, i) => {
    players.push(
      createPlayer(
        `bank_domestic_${i + 1}`,
        bank.name,
        PlayerType.BANK,
        CapitalType.DOMESTIC,
        bank.capital
      )
    );
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
    players.push(
      createPlayer(
        `ent_domestic_${i + 1}`,
        ent.name,
        PlayerType.ENTERPRISE,
        CapitalType.DOMESTIC,
        ent.capital,
        ent.sector
      )
    );
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
    players.push(
      createPlayer(
        `ent_foreign_${i + 1}`,
        ent.name,
        PlayerType.ENTERPRISE,
        CapitalType.FOREIGN,
        ent.capital,
        ent.sector
      )
    );
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
