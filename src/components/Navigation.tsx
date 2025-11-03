import './Navigation.css';

interface NavigationProps {
  currentPage: 'game' | 'theory' | 'ai-usage';
  onPageChange: (page: 'game' | 'theory' | 'ai-usage') => void;
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <span className="nav-title">Tư bản tài chính và quyền lực mềm của độc quyền</span>
        </div>

        <ul className="nav-menu">
          <li>
            <button
              className={`nav-link ${currentPage === 'game' ? 'active' : ''}`}
              onClick={() => onPageChange('game')}
            >
              <span className="nav-link-icon">🎮</span>
              <span className="nav-link-text">Trò chơi</span>
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${currentPage === 'theory' ? 'active' : ''}`}
              onClick={() => onPageChange('theory')}
            >
              <span className="nav-link-icon">📚</span>
              <span className="nav-link-text">Lí thuyết</span>
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${currentPage === 'ai-usage' ? 'active' : ''}`}
              onClick={() => onPageChange('ai-usage')}
            >
              <span className="nav-link-icon">🤖</span>
              <span className="nav-link-text">Sử dụng AI</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
