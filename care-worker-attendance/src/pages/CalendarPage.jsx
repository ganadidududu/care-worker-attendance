import { useState, useMemo } from 'react';
import CalendarGrid from '../components/calendar/CalendarGrid';
import DayDetailModal from '../components/calendar/DayDetailModal';
import MonthSummary from '../components/calendar/MonthSummary';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useCalendarAttendance } from '../hooks/useCalendarAttendance';

/**
 * 달력 페이지 (메인 출퇴근 관리)
 * 월별 달력에서 날짜를 선택하여 출퇴근 기록 입력
 */
export default function CalendarPage() {
  const { attendance, calculateMonthTotals } = useCalendarAttendance();

  // 현재 표시 중인 년월
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // 1-12

  // 선택된 날짜 (모달용)
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 이전 달로 이동
  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 2, 1));
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth, 1));
  };

  // 오늘로 이동
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // 날짜 클릭 핸들러
  const handleDayClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  // 모달 닫기 핸들러
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  // 현재 월의 출퇴근 데이터를 맵으로 변환 (날짜별 배열)
  const attendanceMap = useMemo(() => {
    const map = {};
    attendance
      .filter((record) => record.worked)
      .forEach((record) => {
        if (!map[record.date]) {
          map[record.date] = [];
        }
        map[record.date].push(record);
      });
    return map;
  }, [attendance]);

  // 현재 월의 총계 계산
  const monthTotals = useMemo(() => {
    return calculateMonthTotals(currentYear, currentMonth);
  }, [currentYear, currentMonth, attendance]);

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-4xl font-bold mb-6">근무 달력</h1>

      {/* 월 네비게이션 */}
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <Button variant="secondary" onClick={goToPrevMonth} className="px-6 py-3">
            ◀
          </Button>

          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold">
              {currentYear}년 {currentMonth}월
            </h2>
            <button
              onClick={goToToday}
              className="text-base text-primary-600 hover:text-primary-700 mt-1"
            >
              오늘로
            </button>
          </div>

          <Button variant="secondary" onClick={goToNextMonth} className="px-6 py-3">
            ▶
          </Button>
        </div>
      </Card>

      {/* 달력 그리드 */}
      <Card className="mb-6">
        <CalendarGrid
          year={currentYear}
          month={currentMonth}
          attendanceMap={attendanceMap}
          onDayClick={handleDayClick}
        />
      </Card>

      {/* 월별 요약 */}
      <MonthSummary year={currentYear} month={currentMonth} totals={monthTotals} />

      {/* 안내 메시지 */}
      {monthTotals.totalDays === 0 && (
        <Card className="mt-6 bg-blue-50">
          <p className="text-lg text-center text-gray-700">
            달력에서 날짜를 선택하여 출근 기록을 입력하세요
          </p>
        </Card>
      )}

      {/* 날짜 상세 모달 */}
      <DayDetailModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        date={selectedDate}
      />
    </div>
  );
}
