import type { GameEvent, EventImpact } from '../types';
import { PlayerType, Sector } from '../types';

// Danh sách sự kiện thực tế từ Việt Nam
export const vietnamEvents: GameEvent[] = [
  {
    id: 'event_fintech_boom',
    title: 'Fintech bùng nổ tại Việt Nam',
    description: 'Các công ty fintech trong và ngoài nước đổ xô vào thị trường Việt Nam, tạo ra làn sóng chuyển đổi số trong ngành tài chính.',
    impact: [
      {
        playerType: PlayerType.BANK,
        capitalChange: -500000,
        powerChange: -5,
        description: 'Ngân hàng truyền thống mất thị phần vào tay fintech'
      },
      {
        sector: Sector.FINTECH,
        capitalChange: 1000000,
        powerChange: 10,
        description: 'Công ty fintech tăng trưởng mạnh'
      }
    ],
    requiresAction: false,
    timestamp: Date.now()
  },
  {
    id: 'event_foreign_takeover',
    title: 'Quỹ ngoại mua lại doanh nghiệp lớn',
    description: 'Một quỹ đầu tư nước ngoài thâu tóm thành công một doanh nghiệp Việt Nam trong ngành công nghệ.',
    impact: [
      {
        capitalChange: -2000000,
        powerChange: -10,
        description: 'Doanh nghiệp Việt mất quyền kiểm soát'
      }
    ],
    requiresAction: true,
    options: [
      {
        id: 'accept',
        label: 'Chấp nhận thương vụ',
        impacts: [
          {
            description: 'Doanh nghiệp nhận vốn lớn nhưng mất độc lập',
            capitalChange: 2000000,
            powerChange: -15
          }
        ]
      },
      {
        id: 'resist',
        label: 'Kháng cự thâu tóm',
        impacts: [
          {
            description: 'Doanh nghiệp giữ được độc lập nhưng tốn kém',
            capitalChange: -500000,
            powerChange: 5
          }
        ]
      },
      {
        id: 'government_intervene',
        label: 'Chính phủ can thiệp',
        impacts: [
          {
            playerType: PlayerType.GOVERNMENT,
            description: 'Chính phủ ban hành quy định bảo vệ doanh nghiệp'
          }
        ]
      }
    ],
    timestamp: Date.now()
  },
  {
    id: 'event_new_banking_law',
    title: 'Luật Ngân hàng mới được ban hành',
    description: 'Chính phủ ban hành luật mới hạn chế tỷ lệ sở hữu nước ngoài trong ngành ngân hàng.',
    impact: [
      {
        playerType: PlayerType.GOVERNMENT,
        powerChange: 10,
        description: 'Chính phủ tăng kiểm soát ngành tài chính'
      },
      {
        capitalChange: -1000000,
        powerChange: -8,
        description: 'Vốn nước ngoài bị hạn chế'
      }
    ],
    requiresAction: false,
    timestamp: Date.now()
  },
  {
    id: 'event_stock_crash',
    title: 'Thị trường chứng khoán sụt giảm mạnh',
    description: 'VN-Index giảm 10% trong một tuần do lo ngại về tình hình kinh tế toàn cầu.',
    impact: [
      {
        capitalChange: -800000,
        powerChange: -5,
        description: 'Tất cả các chủ thể đều chịu tổn thất'
      }
    ],
    requiresAction: true,
    options: [
      {
        id: 'buy_dip',
        label: 'Mua đáy (Bank/Fund)',
        impacts: [
          {
            playerType: PlayerType.BANK,
            capitalChange: -1000000,
            powerChange: 15,
            description: 'Mua cổ phiếu giá thấp, tăng kiểm soát dài hạn'
          }
        ]
      },
      {
        id: 'stabilize',
        label: 'Bơm thanh khoản (Chính phủ)',
        impacts: [
          {
            playerType: PlayerType.GOVERNMENT,
            description: 'NHNN bơm tiền ổn định thị trường',
            powerChange: 5
          }
        ]
      },
      {
        id: 'wait',
        label: 'Chờ đợi',
        impacts: [
          {
            description: 'Không hành động, chịu tổn thất',
            capitalChange: -500000
          }
        ]
      }
    ],
    timestamp: Date.now()
  },
  {
    id: 'event_digital_bank',
    title: 'Ngân hàng số được cấp phép',
    description: 'NHNN cấp phép cho ngân hàng số đầu tiên hoạt động tại Việt Nam.',
    impact: [
      {
        sector: Sector.BANKING,
        capitalChange: 1500000,
        powerChange: 8,
        description: 'Ngân hàng số thu hút khách hàng trẻ'
      },
      {
        sector: Sector.BANKING,
        playerType: PlayerType.BANK,
        capitalChange: -600000,
        powerChange: -4,
        description: 'Ngân hàng truyền thống mất khách hàng'
      }
    ],
    requiresAction: false,
    timestamp: Date.now()
  },
  {
    id: 'event_trade_war',
    title: 'Căng thẳng thương mại gia tăng',
    description: 'Chiến tranh thương mại giữa các cường quốc ảnh hưởng đến chuỗi cung ứng toàn cầu.',
    impact: [
      {
        sector: Sector.MANUFACTURING,
        capitalChange: -1200000,
        powerChange: -6,
        description: 'Doanh nghiệp sản xuất gặp khó khăn'
      },
      {
        sector: Sector.TECHNOLOGY,
        capitalChange: 800000,
        powerChange: 5,
        description: 'Một số doanh nghiệp công nghệ hưởng lợi từ dịch chuyển đầu tư'
      }
    ],
    requiresAction: true,
    options: [
      {
        id: 'diversify',
        label: 'Đa dạng hóa thị trường',
        impacts: [
          {
            capitalChange: -400000,
            powerChange: 8,
            description: 'Đầu tư mở rộng sang thị trường mới'
          }
        ]
      },
      {
        id: 'lobby',
        label: 'Vận động chính sách',
        impacts: [
          {
            playerType: PlayerType.GOVERNMENT,
            description: 'Chính phủ đàm phán FTA mới',
            powerChange: 6
          }
        ]
      }
    ],
    timestamp: Date.now()
  },
  {
    id: 'event_crypto_regulation',
    title: 'Quy định về tiền điện tử',
    description: 'Chính phủ ban hành khung pháp lý cho giao dịch và đầu tư tiền điện tử.',
    impact: [
      {
        sector: Sector.FINTECH,
        powerChange: 10,
        description: 'Fintech crypto được hợp pháp hóa'
      },
      {
        playerType: PlayerType.GOVERNMENT,
        powerChange: 5,
        description: 'Chính phủ kiểm soát thị trường tài sản số'
      }
    ],
    requiresAction: false,
    timestamp: Date.now()
  },
  {
    id: 'event_merger',
    title: 'Sáp nhập ngân hàng lớn',
    description: 'Hai ngân hàng thương mại lớn thông báo sáp nhập, tạo ra gã khổng lồ ngân hàng.',
    impact: [
      {
        sector: Sector.BANKING,
        capitalChange: 3000000,
        powerChange: 20,
        description: 'Ngân hàng sau sáp nhập trở nên rất mạnh'
      }
    ],
    requiresAction: true,
    options: [
      {
        id: 'approve',
        label: 'Phê duyệt (Chính phủ)',
        impacts: [
          {
            description: 'Tạo ra ngân hàng cạnh tranh quốc tế nhưng tăng độc quyền',
            powerChange: -5
          }
        ]
      },
      {
        id: 'reject',
        label: 'Từ chối vì lo ngại độc quyền',
        impacts: [
          {
            playerType: PlayerType.GOVERNMENT,
            description: 'Bảo vệ cạnh tranh nhưng làm yếu đi ngành ngân hàng',
            powerChange: 5
          }
        ]
      }
    ],
    timestamp: Date.now()
  },
  {
    id: 'event_cybersecurity_breach',
    title: 'Rò rỉ dữ liệu khách hàng',
    description: 'Một ngân hàng lớn bị tấn công mạng, dữ liệu hàng triệu khách hàng bị đánh cắp.',
    impact: [
      {
        sector: Sector.BANKING,
        capitalChange: -2000000,
        powerChange: -15,
        description: 'Ngân hàng mất uy tín và khách hàng'
      }
    ],
    requiresAction: true,
    options: [
      {
        id: 'invest_security',
        label: 'Đầu tư an ninh mạng',
        impacts: [
          {
            capitalChange: -1000000,
            powerChange: 10,
            description: 'Khôi phục niềm tin nhờ hệ thống bảo mật tốt'
          }
        ]
      },
      {
        id: 'cover_up',
        label: 'Che giấu sự cố',
        impacts: [
          {
            powerChange: -20,
            description: 'Khi sự thật phơi bày, thiệt hại nặng nề hơn'
          }
        ]
      }
    ],
    timestamp: Date.now()
  },
  {
    id: 'event_green_finance',
    title: 'Phát triển tài chính xanh',
    description: 'Chính phủ khuyến khích đầu tư vào các dự án tài chính xanh và bền vững.',
    impact: [
      {
        sector: Sector.ENERGY,
        capitalChange: 1500000,
        powerChange: 12,
        description: 'Doanh nghiệp năng lượng sạch phát triển'
      },
      {
        playerType: PlayerType.GOVERNMENT,
        powerChange: 8,
        description: 'Chính phủ dẫn dắt chuyển đổi xanh'
      }
    ],
    requiresAction: false,
    timestamp: Date.now()
  }
];

// Hàm random event
export function getRandomEvent(): GameEvent {
  const randomIndex = Math.floor(Math.random() * vietnamEvents.length);
  return {
    ...vietnamEvents[randomIndex],
    id: `${vietnamEvents[randomIndex].id}_${Date.now()}`,
    timestamp: Date.now()
  };
}

// Hàm tính toán impact của event
export function calculateEventImpact(
  event: GameEvent,
  optionId?: string
): EventImpact[] {
  if (optionId && event.options) {
    const option = event.options.find(o => o.id === optionId);
    return option?.impacts || event.impact;
  }
  return event.impact;
}
