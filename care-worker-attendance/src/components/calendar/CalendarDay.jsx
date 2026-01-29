/**
 * 달력 날짜 셀 컴포넌트
 * 개별 날짜를 표시하고 출근 여부, 공휴일 표시 (하루에 여러 곳 가능)
 */
export default function CalendarDay({ date, attendances, isToday, isCurrentMonth, onClick }) {
  const dayNumber = date.getDate();

  // 출근 여부 확인 (배열)
  const hasAttendance = attendances && attendances.length > 0;
  const hasHoliday = attendances && attendances.some((a) => a.isHoliday);

  // 총 시간 계산
  const totalHours = hasAttendance
    ? attendances.reduce((sum, a) => sum + a.hours, 0)
    : 0;

  return (
    <button
      onClick={() => onClick(date)}
      className={`
        min-h-[60px] p-2 rounded-lg border-2 transition-all touch-target
        ${
          isCurrentMonth
            ? 'border-gray-200 hover:border-primary-400 hover:bg-primary-50'
            : 'border-transparent text-gray-300'
        }
        ${isToday ? 'bg-primary-100 border-primary-500' : 'bg-white'}
        ${hasHoliday ? 'bg-red-50 border-red-300' : ''}
        ${hasAttendance && !hasHoliday ? 'bg-green-50 border-green-300' : ''}
      `}
    >
      <div className="flex flex-col items-center justify-center">
        {/* 날짜 숫자 */}
        <span
          className={`text-lg font-bold mb-1 ${
            isCurrentMonth ? 'text-gray-800' : 'text-gray-300'
          } ${isToday ? 'text-primary-600' : ''}`}
        >
          {dayNumber}
        </span>

        {/* 출근 표시 */}
        {hasAttendance && (
          <div className="flex flex-col items-center">
            <span className="text-sm">
              {hasHoliday ? '🎉' : '✓'}
              {attendances.length > 1 && ` ×${attendances.length}`}
            </span>
            {/* 총 근무 시간 표시 */}
            {totalHours > 0 && (
              <span className="text-xs text-gray-600 mt-1">
                {totalHours}h
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}
