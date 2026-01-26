import { Link, useLocation } from 'react-router-dom';

/**
 * 하단 네비게이션 바
 * 큰 아이콘과 명확한 라벨
 */
export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '홈', icon: '🏠' },
    { path: '/checklist', label: '체크', icon: '✅' },
    { path: '/statistics', label: '통계', icon: '📊' },
    { path: '/places', label: '장소', icon: '📍' },
    { path: '/settings', label: '설정', icon: '⚙️' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg safe-area-bottom">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex-1 flex flex-col items-center py-3 min-h-touch ${
              location.pathname === item.path
                ? 'text-primary-600'
                : 'text-gray-500'
            }`}
          >
            <span className="text-3xl mb-1">{item.icon}</span>
            <span className="text-sm font-semibold">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
