import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePlaces } from '../hooks/usePlaces';
import { useSchedule } from '../hooks/useSchedule';
import { useAttendance } from '../hooks/useAttendance';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

/**
 * 홈 페이지 - 대시보드
 * 오늘 날짜, 시간, 오늘 일정 표시
 */
export default function HomePage() {
  const { places } = usePlaces();
  const { getTodaySchedules } = useSchedule();
  const { getTodayRecords } = useAttendance();
  const [currentTime, setCurrentTime] = useState(new Date());

  // 오늘 스케줄
  const todaySchedules = getTodaySchedules(places);
  const todayRecords = getTodayRecords();

  // 완료된 일정 개수
  const completedCount = todayRecords.filter((r) => r.checkOutTime).length;

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

      {/* 오늘 일정 요약 */}
      <Card className="mb-6 bg-blue-50">
        <h2 className="text-2xl font-bold mb-4">오늘 일정</h2>
        {todaySchedules.length === 0 ? (
          <p className="text-lg text-gray-600">오늘은 등록된 일정이 없습니다</p>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-lg">총 방문 예정:</span>
              <span className="text-3xl font-bold text-primary-600">
                {todaySchedules.length}곳
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg">완료:</span>
              <span className="text-3xl font-bold text-green-600">
                {completedCount}곳
              </span>
            </div>
            <div className="pt-3 border-t space-y-2">
              {todaySchedules.map((schedule) => (
                <div key={schedule.id} className="text-base text-gray-700">
                  • {schedule.place.name} ({schedule.startTime} -{' '}
                  {schedule.endTime})
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* 빠른 이동 버튼 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link to="/checklist">
          <Button variant="success" fullWidth>
            체크리스트
          </Button>
        </Link>
        <Link to="/schedule">
          <Button variant="primary" fullWidth>
            스케줄 설정
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
