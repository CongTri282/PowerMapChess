import React from 'react';
import type { AIAnalysis } from '../types';

interface AnalysisPanelProps {
  analysis: AIAnalysis | null;
  onClose: () => void;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ analysis, onClose }) => {
  if (!analysis) return null;

  const getImpactIcon = (impact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'): string => {
    switch (impact) {
      case 'POSITIVE':
        return '✅';
      case 'NEGATIVE':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  const getImpactColor = (impact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'): string => {
    switch (impact) {
      case 'POSITIVE':
        return '#10b981';
      case 'NEGATIVE':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="analysis-overlay">
      <div className="analysis-panel">
        <div className="analysis-header">
          <h3>Phân tích AI - Hệ quả nước đi</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="analysis-content">
          {/* Hệ quả */}
          <section className="analysis-section">
            <h4>📊 Hệ quả trực tiếp</h4>
            <ul className="consequences-list">
              {analysis.consequences.map((consequence, index) => (
                <li key={index}>{consequence}</li>
              ))}
            </ul>
          </section>

          {/* Thay đổi quyền lực */}
          {analysis.powerShift.length > 0 && (
            <section className="analysis-section">
              <h4>⚡ Thay đổi quyền lực</h4>
              <div className="power-shifts">
                {analysis.powerShift.map((shift, index) => (
                  <div key={index} className="power-shift-item">
                    <div className="shift-player">{shift.playerName}</div>
                    <div className="shift-bar">
                      <div className="shift-old" style={{ width: `${shift.oldPower}%` }}>
                        {shift.oldPower.toFixed(1)}
                      </div>
                      <div 
                        className="shift-arrow"
                        style={{ color: shift.change >= 0 ? '#10b981' : '#ef4444' }}
                      >
                        {shift.change >= 0 ? '↗' : '↘'}
                      </div>
                      <div className="shift-new" style={{ width: `${shift.newPower}%` }}>
                        {shift.newPower.toFixed(1)}
                      </div>
                    </div>
                    <div 
                      className="shift-value"
                      style={{ color: shift.change >= 0 ? '#10b981' : '#ef4444' }}
                    >
                      {shift.change >= 0 ? '+' : ''}{shift.change.toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Tác động quốc gia */}
          <section className="analysis-section">
            <h4>
              {getImpactIcon(analysis.nationalImpact.overallImpact)} 
              {' '}Tác động đến lợi ích quốc gia
            </h4>
            <div 
              className="national-impact"
              style={{ 
                borderLeftColor: getImpactColor(analysis.nationalImpact.overallImpact) 
              }}
            >
              <p className="impact-explanation">
                {analysis.nationalImpact.explanation}
              </p>
              <div className="impact-metrics">
                <div className="impact-metric">
                  <span>Kiểm soát nội địa:</span>
                  <span style={{ 
                    color: analysis.nationalImpact.domesticControlChange >= 0 ? '#10b981' : '#ef4444' 
                  }}>
                    {analysis.nationalImpact.domesticControlChange >= 0 ? '+' : ''}
                    {analysis.nationalImpact.domesticControlChange.toFixed(1)}%
                  </span>
                </div>
                <div className="impact-metric">
                  <span>Chủ quyền kinh tế:</span>
                  <span style={{ 
                    color: analysis.nationalImpact.sovereigntyChange >= 0 ? '#10b981' : '#ef4444' 
                  }}>
                    {analysis.nationalImpact.sovereigntyChange >= 0 ? '+' : ''}
                    {analysis.nationalImpact.sovereigntyChange.toFixed(1)}%
                  </span>
                </div>
                <div className="impact-metric">
                  <span>Độc quyền:</span>
                  <span style={{ 
                    color: analysis.nationalImpact.monopolyChange <= 0 ? '#10b981' : '#ef4444' 
                  }}>
                    {analysis.nationalImpact.monopolyChange >= 0 ? '+' : ''}
                    {analysis.nationalImpact.monopolyChange.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Khuyến nghị */}
          {analysis.recommendations.length > 0 && (
            <section className="analysis-section">
              <h4>💡 Khuyến nghị chính sách</h4>
              <ul className="recommendations-list">
                {analysis.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="analysis-footer">
          <button className="action-btn" onClick={onClose}>
            Đã hiểu
          </button>
        </div>
      </div>

      <style>{`
        .analysis-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .analysis-panel {
          background: white;
          border-radius: 16px;
          width: 90%;
          max-width: 700px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          animation: slideUp 0.3s;
        }

        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .analysis-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          border-bottom: 2px solid #e5e7eb;
        }

        .analysis-header h3 {
          margin: 0;
          font-size: 20px;
          color: #1f2937;
        }

        .close-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: #f3f4f6;
          border-radius: 50%;
          cursor: pointer;
          font-size: 18px;
          color: #6b7280;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: #e5e7eb;
          color: #1f2937;
        }

        .analysis-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }

        .analysis-section {
          margin-bottom: 24px;
        }

        .analysis-section:last-child {
          margin-bottom: 0;
        }

        .analysis-section h4 {
          margin: 0 0 12px 0;
          font-size: 16px;
          color: #374151;
          font-weight: 600;
        }

        .consequences-list,
        .recommendations-list {
          margin: 0;
          padding-left: 24px;
          color: #4b5563;
          line-height: 1.8;
        }

        .consequences-list li,
        .recommendations-list li {
          margin-bottom: 8px;
        }

        .power-shifts {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .power-shift-item {
          display: grid;
          grid-template-columns: 150px 1fr 60px;
          gap: 12px;
          align-items: center;
          padding: 12px;
          background: #f9fafb;
          border-radius: 8px;
        }

        .shift-player {
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }

        .shift-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
        }

        .shift-old,
        .shift-new {
          padding: 4px 8px;
          background: #e5e7eb;
          border-radius: 4px;
          font-weight: 600;
        }

        .shift-arrow {
          font-size: 18px;
          font-weight: bold;
        }

        .shift-value {
          text-align: right;
          font-weight: 700;
          font-size: 16px;
        }

        .national-impact {
          background: #f9fafb;
          padding: 16px;
          border-radius: 8px;
          border-left: 4px solid;
        }

        .impact-explanation {
          margin: 0 0 16px 0;
          color: #374151;
          line-height: 1.6;
          font-size: 15px;
        }

        .impact-metrics {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .impact-metric {
          display: flex;
          justify-content: space-between;
          padding: 8px 12px;
          background: white;
          border-radius: 6px;
          font-size: 14px;
        }

        .impact-metric span:first-child {
          color: #6b7280;
        }

        .impact-metric span:last-child {
          font-weight: 700;
        }

        .analysis-footer {
          padding: 20px 24px;
          border-top: 2px solid #e5e7eb;
        }

        .action-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
      `}</style>
    </div>
  );
};
