import { useState } from 'react';
import { Navigation } from './components/Navigation';
// import App from './App';
import { TheoryPage } from './pages/TheoryPage';
import { AIUsagePage } from './pages/AIUsagePage';
import AppMultiplayer from './AppMultiplayer';

type PageType = 'game' | 'theory' | 'ai-usage';

export function MainLayout() {
  const [currentPage, setCurrentPage] = useState<PageType>('game');

  return (
    <div className="main-layout">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />

      <main className="page-content">
        {currentPage === 'game' && <AppMultiplayer />}
        {currentPage === 'theory' && <TheoryPage />}
        {currentPage === 'ai-usage' && <AIUsagePage />}
      </main>
    </div>
  );
}
