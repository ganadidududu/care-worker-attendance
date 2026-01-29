import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePlaces } from '../hooks/usePlaces';
import { useCalendarAttendance } from '../hooks/useCalendarAttendance';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

/**
 * 홈 페이지 - 대시보드
 * 오늘 날짜, 시간, 오늘 출근 정보 표시
 */
export default function HomePage() {
  const { places } = usePlaces();
  const { getAttendanceByDate } = useCalendarAttendance();
  const [currentTime, setCurrentTime] = useState(new Date());

  // 오늘 날짜 (YYYY-MM-DD)
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = formatDate(new Date());
  const todayAttendance = getAttendanceByDate(todayStr);

  // 시간 업데이트 (1초마다)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-4xl font-bold mb-6">출퇴근 관리</h1>

      {/* 현재 날짜 및 시간 */}
      <Card className="mb-6">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-2">
            {currentTime.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long',
            })}
          </p>
          <p className="text-5xl font-bold text-primary-600">
            {currentTime.toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </p>
        </div>
      </Card>

      {/* 오늘 출근 정보 */}
      <Card className="mb-6 bg-blue-50">
        <h2 className="text-2xl font-bold mb-4">오늘 근무</h2>
        {!todayAttendance || !todayAttendance.worked ? (
          <p className="text-lg text-gray-600">오늘은 출근 기록이 없습니다</p>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-lg">장소:</span>
              <span className="text-xl font-bold text-gray-900">
                {todayAttendance.place?.name || '(삭제된 장소)'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg">근무 시간:</span>
              <span className="text-3xl font-bold text-primary-600">
                {todayAttendance.hours}시간
              </span>
            </div>
            {todayAttendance.isHoliday && (
              <div className="flex justify-between items-center">
                <span className="text-lg text-red-600">공휴일 가산:</span>
                <span className="text-xl font-bold text-red-600">1.5배</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-3 border-t">
              <span className="text-xl font-bold">일급:</span>
              <span className="text-3xl font-bold text-green-600">
                {todayAttendance.dailyPay.toLocaleString()}원
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* 빠른 이동 버튼 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link to="/calendar">
          <Button variant="success" fullWidth>
            근무 달력
          </Button>
        </Link>
        <Link to="/statistics">
          <Button variant="primary" fullWidth>
            통계 보기
          </Button>
        </Link>
      </div>

      {/* 등록된 장소 */}
      <Card className="mb-6">
        <h2 className="text-2xl font-bold mb-4">등록된 장소</h2>
        <p className="text-4xl font-bold text-primary-600">{places.length}곳</p>
        {places.length > 0 && (
          <div className="mt-4 space-y-2">
            {places.map((place) => (
              <div key={place.id} className="text-lg text-gray-700">
                • {place.name} (시급: {place.hourlyRate.toLocaleString()}원)
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* 장소 관리하기 버튼 */}
      {places.length === 0 && (
        <Link to="/places">
          <Button variant="primary" fullWidth>
            장소 등록하기
          </Button>
        </Link>
      )}
    </div>
  );
}
