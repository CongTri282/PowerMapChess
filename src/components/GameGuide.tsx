import React, { useState } from 'react';
import './GameGuide.css';

interface GameGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const GameGuide: React.FC<GameGuideProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: '🏠 Màn Hình Chính',
      content: (
        <>
          <h4>Bước 1: Nhập tên và chọn chế độ chơi</h4>
          <div className="tutorial-image">
            <div className="mock-screen lobby-mock">
              <div className="mock-header">Power Map Chess 🎯</div>
              <div className="mock-content">
                <div className="mock-input">
                  <label>👤 Nhập tên của bạn:</label>
                  <input type="text" placeholder="Tên người chơi" value="Player1" readOnly />
                </div>
                <div className="mock-buttons">
                  <button className="mock-btn create">🎮 Tạo phòng mới</button>
                  <button className="mock-btn join">🚪 Tham gia phòng</button>
                  <button className="mock-btn guide">📖 Hướng dẫn chơi</button>
                </div>
              </div>
            </div>
          </div>
          <div className="tutorial-steps">
            <div className="step-item">
              <span className="step-number">1</span>
              <div className="step-text">
                <strong>Nhập tên người chơi</strong>
                <p>Điền tên của bạn vào ô input (bắt buộc)</p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">2</span>
              <div className="step-text">
                <strong>Chọn "Tạo phòng mới"</strong>
                <p>Nếu bạn muốn làm chủ phòng và mời bạn bè</p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">3</span>
              <div className="step-text">
                <strong>Hoặc "Tham gia phòng"</strong>
                <p>Nếu bạn muốn vào phòng có sẵn</p>
              </div>
            </div>
          </div>
        </>
      )
    },
    {
      title: '🎮 Tạo Phòng Chơi',
      content: (
        <>
          <h4>Bước 2: Tạo phòng và đợi người chơi</h4>
          <div className="tutorial-image">
            <div className="mock-screen room-mock">
              <div className="mock-header">Phòng: ROOM-ABC123</div>
              <div className="mock-content room-content">
                <div className="mock-players">
                  <div className="mock-player-card host">
                    <span className="player-name">👑 Player1 (Host)</span>
                    <select className="player-type-select">
                      <option>Chính phủ</option>
                      <option>Ngân hàng nội</option>
                      <option>Ngân hàng ngoại</option>
                    </select>
                    <button className="ready-btn ready">✓ Sẵn sàng</button>
                  </div>
                  <div className="mock-player-card">
                    <span className="player-name">Player2</span>
                    <select className="player-type-select">
                      <option>Doanh nghiệp nội</option>
                    </select>
                    <button className="ready-btn">Chưa sẵn sàng</button>
                  </div>
                </div>
                <button className="mock-start-btn disabled">Bắt đầu game (Đợi tất cả sẵn sàng)</button>
              </div>
            </div>
          </div>
          <div className="tutorial-steps">
            <div className="step-item">
              <span className="step-number">1</span>
              <div className="step-text">
                <strong>Chia sẻ mã phòng</strong>
                <p>Gửi mã phòng (VD: ROOM-ABC123) cho bạn bè</p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">2</span>
              <div className="step-text">
                <strong>Chọn vai trò</strong>
                <p>Mỗi người chọn 1 trong 5 loại: Chính phủ, Ngân hàng nội/ngoại, DN nội/ngoại</p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">3</span>
              <div className="step-text">
                <strong>Nhấn "Sẵn sàng"</strong>
                <p>Khi tất cả người chơi sẵn sàng (≥2 người), Host có thể bắt đầu</p>
              </div>
            </div>
          </div>
        </>
      )
    },
    {
      title: '🗺️ Màn Hình Game - Bản Đồ',
      content: (
        <>
          <h4>Bước 3: Hiểu giao diện game</h4>
          <div className="tutorial-image">
            <div className="mock-screen game-mock">
              <div className="mock-game-header">
                <span className="mock-turn">Lượt 1/10</span>
                <span className="mock-role">Vai trò: Player1 (GOVERNMENT)</span>
                <span className="mock-status waiting">⏳ Chưa hành động</span>
              </div>
              <div className="mock-game-layout">
                <div className="mock-dashboard">
                  <div className="mock-metric">
                    <div className="metric-label">Kiểm soát nội địa</div>
                    <div className="metric-value good">70%</div>
                  </div>
                  <div className="mock-metric">
                    <div className="metric-label">Chủ quyền kinh tế</div>
                    <div className="metric-value good">65%</div>
                  </div>
                  <div className="mock-metric">
                    <div className="metric-label">Tăng trưởng GDP</div>
                    <div className="metric-value good">6.5%</div>
                  </div>
                </div>
                <div className="mock-map">
                  <div className="mock-node government" style={{top: '30%', left: '20%'}}>
                    <span>🏛️ Chính phủ</span>
                  </div>
                  <div className="mock-node bank" style={{top: '50%', left: '50%'}}>
                    <span>🏦 Ngân hàng A</span>
                  </div>
                  <div className="mock-node enterprise" style={{top: '70%', left: '30%'}}>
                    <span>🏭 DN Sản xuất</span>
                  </div>
                  <svg className="mock-flow">
                    <line x1="20%" y1="30%" x2="50%" y2="50%" stroke="#3b82f6" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="tutorial-steps">
            <div className="step-item">
              <span className="step-number">1</span>
              <div className="step-text">
                <strong>Xem chỉ số quốc gia</strong>
                <p>6 chỉ số ở trên cùng: Kiểm soát nội địa, Chủ quyền kinh tế, Phụ thuộc nước ngoài, Độc quyền, GDP, Ổn định tài chính</p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">2</span>
              <div className="step-text">
                <strong>Quan sát bản đồ</strong>
                <p>Các node là người chơi, màu sắc khác nhau theo loại. Đường kẻ là dòng vốn</p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">3</span>
              <div className="step-text">
                <strong>Theo dõi lượt chơi</strong>
                <p>Góc trên bên phải hiển thị lượt hiện tại và trạng thái hành động của bạn</p>
              </div>
            </div>
          </div>
        </>
      )
    },
    {
      title: '⚡ Thực Hiện Hành Động',
      content: (
        <>
          <h4>Bước 4: Chọn và thực hiện hành động</h4>
          <div className="tutorial-image">
            <div className="mock-screen action-mock">
              <div className="mock-action-panel">
                <h3>Panel Hành Động</h3>
                <div className="mock-player-info">
                  <div className="info-row">
                    <span>👤 Player1</span>
                    <span className="role-badge government">Chính phủ</span>
                  </div>
                  <div className="info-row">
                    <span>💰 Vốn: 500,000đ</span>
                    <span>⚡ Quyền lực: 45.0</span>
                  </div>
                </div>
                <div className="mock-action-select">
                  <label>Chọn hành động:</label>
                  <select className="action-dropdown">
                    <option>Ban hành luật</option>
                    <option>Kiểm soát vốn ngoại</option>
                    <option>Bảo vệ ngành trọng yếu</option>
                  </select>
                </div>
                <div className="mock-sector-select">
                  <label>Chọn ngành:</label>
                  <select className="sector-dropdown">
                    <option>Ngân hàng</option>
                    <option>Công nghệ</option>
                    <option>Sản xuất</option>
                  </select>
                </div>
                <button className="mock-submit-btn">✓ Xác nhận hành động</button>
                <div className="mock-description">
                  📝 Player1 thực hiện: Ban hành luật trong ngành Ngân hàng
                </div>
              </div>
            </div>
          </div>
          <div className="tutorial-steps">
            <div className="step-item">
              <span className="step-number">1</span>
              <div className="step-text">
                <strong>Xem thông tin của bạn</strong>
                <p>Kiểm tra vốn và quyền lực hiện tại</p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">2</span>
              <div className="step-text">
                <strong>Chọn hành động phù hợp</strong>
                <p>Mỗi vai trò có các hành động riêng biệt</p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">3</span>
              <div className="step-text">
                <strong>Chọn tham số (nếu cần)</strong>
                <p>Một số hành động cần chọn mục tiêu, ngành, hoặc số tiền</p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">4</span>
              <div className="step-text">
                <strong>Xác nhận hành động</strong>
                <p>Nhấn "✓ Xác nhận" và chờ người chơi khác</p>
              </div>
            </div>
          </div>
        </>
      )
    },
    {
      title: '📊 Các Loại Hành Động',
      content: (
        <>
          <h4>Bước 5: Hiểu các hành động của từng vai trò</h4>
          <div className="action-types-grid">
            <div className="action-type-card government-card">
              <h5>🏛️ Chính Phủ</h5>
              <ul>
                <li><strong>Ban hành luật:</strong> Điều tiết ngành cụ thể</li>
                <li><strong>Kiểm soát vốn ngoại:</strong> Hạn chế ảnh hưởng nước ngoài</li>
                <li><strong>Bảo vệ ngành trọng yếu:</strong> Tăng kiểm soát nội địa</li>
                <li><strong>Kiềm chế độc quyền:</strong> Giảm monopoly</li>
              </ul>
            </div>
            <div className="action-type-card bank-card">
              <h5>🏦 Ngân Hàng</h5>
              <ul>
                <li><strong>Cho vay:</strong> Cho người chơi khác vay với lãi suất</li>
                <li><strong>Mua cổ phần:</strong> Nắm quyền kiểm soát DN</li>
                <li><strong>Thao túng thị trường:</strong> Tác động giá trong ngành</li>
                <li><strong>Đầu tư mở rộng:</strong> Tăng vốn và quyền lực</li>
              </ul>
            </div>
            <div className="action-type-card enterprise-card">
              <h5>🏭 Doanh Nghiệp</h5>
              <ul>
                <li><strong>Đầu tư mở rộng:</strong> Tăng quy mô sản xuất</li>
                <li><strong>Mua lại đối thủ:</strong> Hợp nhất để tăng quyền lực</li>
                <li><strong>Thu hút vốn:</strong> Gọi vốn từ ngân hàng/đầu tư</li>
                <li><strong>Vận động hành lang:</strong> Ảnh hưởng chính sách</li>
              </ul>
            </div>
          </div>
          <div className="tutorial-note">
            <strong>💡 Lưu ý:</strong> Mỗi lượt bạn chỉ được thực hiện MỘT hành động duy nhất. 
            Hãy suy nghĩ kỹ trước khi quyết định!
          </div>
        </>
      )
    },
    {
      title: '🎲 Sự Kiện và Lượt Chơi',
      content: (
        <>
          <h4>Bước 6: Hiểu về sự kiện và tiến trình game</h4>
          <div className="tutorial-image">
            <div className="mock-screen event-mock">
              <div className="mock-event-card">
                <div className="event-header">
                  <span className="event-icon">⚠️</span>
                  <h4>Sự Kiện: Khủng hoảng tài chính</h4>
                </div>
                <div className="event-body">
                  <p>Thị trường chứng khoán sụt giảm mạnh, ảnh hưởng đến toàn bộ hệ thống tài chính</p>
                  <div className="event-impact">
                    <strong>Tác động:</strong>
                    <ul>
                      <li>Ngành Ngân hàng: -15% vốn</li>
                      <li>Ổn định tài chính: -10 điểm</li>
                      <li>Phụ thuộc nước ngoài: +5 điểm</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tutorial-steps">
            <div className="step-item">
              <span className="step-number">1</span>
              <div className="step-text">
                <strong>Sự kiện xuất hiện mỗi 3 lượt</strong>
                <p>Các sự kiện ngẫu nhiên sẽ ảnh hưởng đến thị trường</p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">2</span>
              <div className="step-text">
                <strong>Đọc kỹ tác động</strong>
                <p>Sự kiện có thể ảnh hưởng đến vốn, quyền lực, hoặc chỉ số quốc gia</p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">3</span>
              <div className="step-text">
                <strong>Điều chỉnh chiến lược</strong>
                <p>Dựa vào sự kiện để thay đổi kế hoạch hành động</p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">4</span>
              <div className="step-text">
                <strong>Chờ Host chuyển lượt</strong>
                <p>Sau khi tất cả hành động, Host nhấn "⏭️ Lượt tiếp theo"</p>
              </div>
            </div>
          </div>
        </>
      )
    },
    {
      title: '🏆 Kết Thúc Game',
      content: (
        <>
          <h4>Bước 7: Xem kết quả và xếp hạng</h4>
          <div className="tutorial-image">
            <div className="mock-screen result-mock">
              <div className="mock-result-panel">
                <h3>🎉 Game Kết Thúc!</h3>
                <div className="mock-rankings">
                  <div className="rank-item gold">
                    <span className="rank-medal">🥇</span>
                    <div className="rank-info">
                      <strong>Player1</strong>
                      <span className="rank-role">Chính phủ</span>
                    </div>
                    <div className="rank-stats">
                      <div>💰 850,000đ</div>
                      <div>⚡ 78.5 quyền lực</div>
                    </div>
                  </div>
                  <div className="rank-item silver">
                    <span className="rank-medal">🥈</span>
                    <div className="rank-info">
                      <strong>Player2</strong>
                      <span className="rank-role">Ngân hàng nội</span>
                    </div>
                    <div className="rank-stats">
                      <div>💰 720,000đ</div>
                      <div>⚡ 65.2 quyền lực</div>
                    </div>
                  </div>
                  <div className="rank-item bronze">
                    <span className="rank-medal">🥉</span>
                    <div className="rank-info">
                      <strong>Player3</strong>
                      <span className="rank-role">DN nội địa</span>
                    </div>
                    <div className="rank-stats">
                      <div>💰 680,000đ</div>
                      <div>⚡ 58.0 quyền lực</div>
                    </div>
                  </div>
                </div>
                <div className="mock-final-metrics">
                  <h4>📊 Chỉ Số Quốc Gia Cuối Cùng</h4>
                  <div className="metric-row good">Kiểm soát nội địa: 75%</div>
                  <div className="metric-row good">Chủ quyền kinh tế: 68%</div>
                  <div className="metric-row ok">Tăng trưởng GDP: 5.8%</div>
                </div>
              </div>
            </div>
          </div>
          <div className="tutorial-steps">
            <div className="step-item">
              <span className="step-number">1</span>
              <div className="step-text">
                <strong>Xếp hạng theo quyền lực</strong>
                <p>Người chơi được sắp xếp từ cao đến thấp theo điểm quyền lực</p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">2</span>
              <div className="step-text">
                <strong>Xem thống kê chi tiết</strong>
                <p>Kiểm tra vốn cuối, quyền lực và các chỉ số quốc gia</p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">3</span>
              <div className="step-text">
                <strong>Đánh giá tổng thể</strong>
                <p>Game đánh giá tình hình quốc gia: Tốt, Trung bình, hoặc Cần cải thiện</p>
              </div>
            </div>
          </div>
        </>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="guide-overlay" onClick={onClose}>
      <div className="guide-modal tutorial-mode" onClick={(e) => e.stopPropagation()}>
        <div className="guide-header">
          <h2>📚 Hướng Dẫn Chơi Game - Từng Bước</h2>
          <button className="guide-close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="guide-content tutorial-content">
          {/* Progress indicator */}
          <div className="tutorial-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{width: `${((currentStep + 1) / steps.length) * 100}%`}}
              />
            </div>
            <div className="progress-text">
              Bước {currentStep + 1} / {steps.length}
            </div>
          </div>

          {/* Current step content */}
          <div className="tutorial-step">
            <h3>{steps[currentStep].title}</h3>
            {steps[currentStep].content}
          </div>
        </div>

        <div className="guide-footer tutorial-footer">
          <button 
            className="nav-btn prev" 
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            ← Trước
          </button>
          
          <div className="step-dots">
            {steps.map((_, index) => (
              <span 
                key={index}
                className={`dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                onClick={() => setCurrentStep(index)}
              />
            ))}
          </div>

          {currentStep < steps.length - 1 ? (
            <button className="nav-btn next" onClick={nextStep}>
              Tiếp →
            </button>
          ) : (
            <button className="nav-btn finish" onClick={onClose}>
              Hoàn Thành! 🎉
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameGuide;
