import React from 'react';
import type { GameEvent } from '../types';

interface EventCardProps {
  event: GameEvent;
  onSelectOption?: (optionId: string) => void;
  onDismiss?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onSelectOption,
  onDismiss
}) => {
  return (
    <div className="event-overlay">
      <div className="event-card">
        <div className="event-header">
          <div className="event-icon">📢</div>
          <h3>{event.title}</h3>
        </div>

        <div className="event-body">
          <p className="event-description">{event.description}</p>

          <div className="event-impact">
            <h4>Tác động:</h4>
            <ul>
              {event.impact.map((impact, index) => (
                <li key={index}>
                  {impact.description}
                  {impact.capitalChange && (
                    <span className={impact.capitalChange > 0 ? 'positive' : 'negative'}>
                      {' '}({impact.capitalChange > 0 ? '+' : ''}
                      {(impact.capitalChange / 1000000).toFixed(1)}M VND)
                    </span>
                  )}
                  {impact.powerChange && (
                    <span className={impact.powerChange > 0 ? 'positive' : 'negative'}>
                      {' '}({impact.powerChange > 0 ? '+' : ''}
                      {impact.powerChange} quyền lực)
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {event.requiresAction && event.options && event.options.length > 0 && (
            <div className="event-options">
              <h4>Lựa chọn:</h4>
              <div className="options-grid">
                {event.options.map((option) => (
                  <button
                    key={option.id}
                    className="option-btn"
                    onClick={() => onSelectOption?.(option.id)}
                  >
                    <div className="option-label">{option.label}</div>
                    <div className="option-impacts">
                      {option.impacts.slice(0, 2).map((impact, idx) => (
                        <div key={idx} className="option-impact">
                          {impact.description}
                        </div>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!event.requiresAction && (
            <button className="dismiss-btn" onClick={onDismiss}>
              Đã hiểu
            </button>
          )}
        </div>
      </div>

      <style>{`
        .event-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          animation: fadeIn 0.3s;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .event-card {
          background: white;
          border-radius: 16px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow: hidden;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
          animation: slideDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes slideDown {
          from { transform: translateY(-100px) scale(0.8); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }

        .event-header {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          padding: 24px;
          text-align: center;
        }

        .event-icon {
          font-size: 48px;
          margin-bottom: 12px;
          animation: bounce 1s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .event-header h3 {
          margin: 0;
          font-size: 22px;
        }

        .event-body {
          padding: 24px;
          overflow-y: auto;
          max-height: calc(90vh - 140px);
        }

        .event-description {
          font-size: 16px;
          line-height: 1.6;
          color: #374151;
          margin: 0 0 20px 0;
        }

        .event-impact,
        .event-options {
          margin-bottom: 20px;
        }

        .event-impact h4,
        .event-options h4 {
          margin: 0 0 12px 0;
          font-size: 16px;
          color: #1f2937;
          font-weight: 600;
        }

        .event-impact ul {
          margin: 0;
          padding-left: 24px;
          color: #4b5563;
          line-height: 1.8;
        }

        .event-impact li {
          margin-bottom: 8px;
        }

        .positive {
          color: #10b981;
          font-weight: 600;
        }

        .negative {
          color: #ef4444;
          font-weight: 600;
        }

        .options-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .option-btn {
          padding: 16px;
          background: #f9fafb;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
        }

        .option-btn:hover {
          background: white;
          border-color: #f59e0b;
          transform: translateX(4px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .option-label {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .option-impacts {
          font-size: 13px;
          color: #6b7280;
          line-height: 1.6;
        }

        .option-impact {
          margin-bottom: 4px;
        }

        .dismiss-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .dismiss-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
      `}</style>
    </div>
  );
};
