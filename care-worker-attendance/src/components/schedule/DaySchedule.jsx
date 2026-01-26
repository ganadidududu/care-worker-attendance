import { useState } from 'react';
import Input from '../common/Input';

/**
 * 요일별 스케줄 설정 컴포넌트
 */
export default function DaySchedule({ dayName, schedule, onChange }) {
  const [isActive, setIsActive] = useState(schedule?.isActive || false);
  const [startTime, setStartTime] = useState(schedule?.startTime || '09:00');
  const [endTime, setEndTime] = useState(schedule?.endTime || '12:00');

  // 활성화/비활성화 토글
  const handleToggle = () => {
    const newIsActive = !isActive;
    setIsActive(newIsActive);
    onChange({ startTime, endTime, isActive: newIsActive });
  };

  // 시작 시간 변경
  const handleStartTimeChange = (e) => {
    const newStartTime = e.target.value;
    setStartTime(newStartTime);
    if (isActive) {
      onChange({ startTime: newStartTime, endTime, isActive });
    }
  };

  // 종료 시간 변경
  const handleEndTimeChange = (e) => {
    const newEndTime = e.target.value;
    setEndTime(newEndTime);
    if (isActive) {
      onChange({ startTime, endTime: newEndTime, isActive });
    }
  };

  return (
    <div className="mb-4 p-4 border-2 border-gray-200 rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-bold">{dayName}</h3>
        <button
          type="button"
          onClick={handleToggle}
          className={`px-6 py-2 rounded-lg font-semibold text-lg transition-colors ${
            isActive
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-600'
          }`}
        >
          {isActive ? '활성' : '휴무'}
        </button>
      </div>

      {isActive && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-base font-semibold mb-1">
              출근 시간
            </label>
            <input
              type="time"
              value={startTime}
              onChange={handleStartTimeChange}
              className="input-large w-full"
            />
          </div>
          <div>
            <label className="block text-base font-semibold mb-1">
              퇴근 시간
            </label>
            <input
              type="time"
              value={endTime}
              onChange={handleEndTimeChange}
              className="input-large w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
