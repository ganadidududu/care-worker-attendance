import CalendarDay from './CalendarDay';

/**
 * 날짜 포맷 유틸리티
 */
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 달력 그리드 컴포넌트
 * 월별 달력을 7x6 그리드로 표시
 */
export default function CalendarGrid({ year, month, attendanceMap, onDayClick }) {
  // 요일 헤더
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  // 해당 월의 첫 날과 마지막 날
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  // 첫 날의 요일 (0=일요일)
  const firstDayOfWeek = firstDay.getDay();

  // 마지막 날짜
  const lastDate = lastDay.getDate();

  // 이전 달의 마지막 날
  const prevMonthLastDay = new Date(year, month - 1, 0).getDate();

  // 오늘 날짜
  const today = formatDate(new Date());

  // 달력 날짜 배열 생성 (6주 = 42일)
  const calendarDays = [];

  // 이전 달 날짜들
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month - 2, prevMonthLastDay - i);
    calendarDays.push({
      date,
      isCurrentMonth: false,
    });
  }

  // 현재 달 날짜들
  for (let day = 1; day <= lastDate; day++) {
    const date = new Date(year, month - 1, day);
    calendarDays.push({
      date,
      isCurrentMonth: true,
    });
  }

  // 다음 달 날짜들 (총 42개까지 채우기)
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month, day);
    calendarDays.push({
      date,
      isCurrentMonth: false,
    });
  }

  return (
    <div className="w-full">
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day, index) => (
          <div
            key={index}
            className={`text-center text-base font-bold py-2 ${
              index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-700'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const dateStr = formatDate(day.date);
          const attendances = attendanceMap[dateStr] || [];
          const isToday = dateStr === today;

          return (
            <CalendarDay
              key={index}
              date={day.date}
              attendances={attendances}
              isToday={isToday}
              isCurrentMonth={day.isCurrentMonth}
              onClick={onDayClick}
            />
          );
        })}
      </div>
    </div>
  );
}
