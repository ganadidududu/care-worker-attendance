/**
 * 달력 날짜 셀 컴포넌트
 * 개별 날짜를 표시하고 출근 여부, 공휴일 표시
 */
export default function CalendarDay({ date, attendance, isToday, isCurrentMonth, onClick }) {
  const dayNumber = date.getDate();

  // 출근 여부 확인
  const hasAttendance = attendance && attendance.worked;
  const isHoliday = attendance && attendance.isHoliday;

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
        ${isHoliday ? 'bg-red-50 border-red-300' : ''}
        ${hasAttendance && !isHoliday ? 'bg-green-50 border-green-300' : ''}
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
          <span className="text-sm">
            {isHoliday ? '🎉' : '✓'}
          </span>
        )}

        {/* 근무 시간 표시 (있으면) */}
        {hasAttendance && attendance.hours > 0 && (
          <span className="text-xs text-gray-600 mt-1">
            {attendance.hours}h
          </span>
        )}
      </div>
    </button>
  );
}
