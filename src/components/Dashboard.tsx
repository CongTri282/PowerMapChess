import React from 'react';
import type { NationalMetrics } from '../types';
import { formatPercentage } from '../utils/playerUtils';

interface DashboardProps {
  metrics: NationalMetrics;
  currentTurn: number;
  maxTurns: number;
}

export const Dashboard: React.FC<DashboardProps> = ({
  metrics,
  currentTurn,
  maxTurns
}) => {
  const getMetricColor = (value: number, reversed = false): string => {
    if (reversed) {
      if (value >= 70) return '#ef4444';
      if (value >= 40) return '#f59e0b';
      return '#10b981';
    }
    if (value >= 70) return '#10b981';
    if (value >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const getGrowthColor = (value: number): string => {
    if (value >= 6) return '#10b981';
    if (value >= 4) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Chỉ số Quốc gia</h2>
        <div className="turn-indicator">
          Lượt {currentTurn}/{maxTurns}
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">🇻🇳</div>
          <div className="metric-content">
            <div className="metric-label">Kiểm soát nội địa</div>
            <div className="metric-value" style={{ color: getMetricColor(metrics.domesticControl) }}>
              {formatPercentage(metrics.domesticControl)}
            </div>
            <div className="metric-bar">
              <div
                className="metric-fill"
                style={{
                  width: `${metrics.domesticControl}%`,
                  backgroundColor: getMetricColor(metrics.domesticControl)
                }}
              />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🛡️</div>
          <div className="metric-content">
            <div className="metric-label">Chủ quyền kinh tế</div>
            <div className="metric-value" style={{ color: getMetricColor(metrics.economicSovereignty) }}>
              {formatPercentage(metrics.economicSovereignty)}
            </div>
            <div className="metric-bar">
              <div
                className="metric-fill"
                style={{
                  width: `${metrics.economicSovereignty}%`,
                  backgroundColor: getMetricColor(metrics.economicSovereignty)
                }}
              />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🌍</div>
          <div className="metric-content">
            <div className="metric-label">Phụ thuộc ngoại</div>
            <div className="metric-value" style={{ color: getMetricColor(metrics.foreignDependency, true) }}>
              {formatPercentage(metrics.foreignDependency)}
            </div>
            <div className="metric-bar">
              <div
                className="metric-fill"
                style={{
                  width: `${metrics.foreignDependency}%`,
                  backgroundColor: getMetricColor(metrics.foreignDependency, true)
                }}
              />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⚠️</div>
          <div className="metric-content">
            <div className="metric-label">Mức độ độc quyền</div>
            <div className="metric-value" style={{ color: getMetricColor(metrics.monopolyLevel, true) }}>
              {formatPercentage(metrics.monopolyLevel)}
            </div>
            <div className="metric-bar">
              <div
                className="metric-fill"
                style={{
                  width: `${metrics.monopolyLevel}%`,
                  backgroundColor: getMetricColor(metrics.monopolyLevel, true)
                }}
              />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <div className="metric-label">Tăng trưởng GDP</div>
            <div className="metric-value" style={{ color: getGrowthColor(metrics.gdpGrowth) }}>
              {metrics.gdpGrowth.toFixed(1)}%
            </div>
            <div className="metric-description">% hàng năm</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <div className="metric-label">Ổn định tài chính</div>
            <div className="metric-value" style={{ color: getMetricColor(metrics.financialStability) }}>
              {formatPercentage(metrics.financialStability)}
            </div>
            <div className="metric-bar">
              <div
                className="metric-fill"
                style={{
                  width: `${metrics.financialStability}%`,
                  backgroundColor: getMetricColor(metrics.financialStability)
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="metrics-summary">
        <h3>Tóm tắt tình hình</h3>
        <div className="summary-text">
          {metrics.domesticControl >= 70 && metrics.economicSovereignty >= 65 ? (
            <p className="positive">
              ✅ Việt Nam duy trì được kiểm soát tốt về tài chính và chủ quyền kinh tế.
            </p>
          ) : (
            <p className="warning">
              ⚠️ Cần tăng cường các biện pháp bảo vệ chủ quyền kinh tế.
            </p>
          )}
          
          {metrics.monopolyLevel >= 60 && (
            <p className="negative">
              🚨 Mức độ độc quyền cao, cần can thiệp để bảo vệ cạnh tranh.
            </p>
          )}
          
          {metrics.foreignDependency >= 60 && (
            <p className="negative">
              🚨 Phụ thuộc vốn ngoại quá cao, nguy cơ mất kiểm soát.
            </p>
          )}
          
          {metrics.gdpGrowth >= 6 ? (
            <p className="positive">
              ✅ Tăng trưởng kinh tế tốt.
            </p>
          ) : (
            <p className="warning">
              ⚠️ Tăng trưởng kinh tế cần được cải thiện.
            </p>
          )}
        </div>
      </div>

      <style>{`
        .dashboard {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .dashboard-header h2 {
          margin: 0;
          font-size: 24px;
          color: #1f2937;
        }

        .turn-indicator {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 14px;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .metric-card {
          background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          gap: 12px;
        }

        .metric-icon {
          font-size: 32px;
          line-height: 1;
        }

        .metric-content {
          flex: 1;
        }

        .metric-label {
          font-size: 12px;
          color: #6b7280;
          font-weight: 600;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .metric-value {
          font-size: 28px;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 8px;
        }

        .metric-bar {
          height: 6px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .metric-fill {
          height: 100%;
          transition: width 0.5s ease, background-color 0.3s;
          border-radius: 3px;
        }

        .metric-description {
          font-size: 11px;
          color: #9ca3af;
          margin-top: 4px;
        }

        .metrics-summary {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 16px;
          border-radius: 8px;
        }

        .metrics-summary h3 {
          margin: 0 0 12px 0;
          font-size: 16px;
          color: #92400e;
        }

        .summary-text p {
          margin: 8px 0;
          font-size: 14px;
          line-height: 1.6;
        }

        .summary-text p.positive {
          color: #065f46;
        }

        .summary-text p.warning {
          color: #92400e;
        }

        .summary-text p.negative {
          color: #991b1b;
        }

        @media (max-width: 1200px) {
          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .metrics-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
