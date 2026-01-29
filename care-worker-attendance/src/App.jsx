import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import HomePage from './pages/HomePage';
import PlacesPage from './pages/PlacesPage';
import CalendarPage from './pages/CalendarPage';
import StatisticsPage from './pages/StatisticsPage';
import SettingsPage from './pages/SettingsPage';
import BottomNav from './components/common/BottomNav';

/**
 * 메인 앱 컴포넌트
 * 라우팅 및 전역 상태 관리 설정
 */
export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="min-h-screen bg-gray-50 pb-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/places" element={<PlacesPage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
          <BottomNav />
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}
