import { v4 as uuidv4 } from 'uuid';
import { useApp } from '../context/AppContext';

/**
 * 출퇴근 기록 관리를 위한 커스텀 훅
 */
export function useAttendance() {
  const { attendance, setAttendance } = useApp();

  /**
   * 출근 체크
   * @param {string} placeId - 장소 ID
   * @param {string} scheduleId - 스케줄 ID
   * @param {string} scheduledStart - 예정된 시작 시간
   * @param {string} scheduledEnd - 예정된 종료 시간
   */
  const checkIn = (placeId, scheduleId, scheduledStart, scheduledEnd) => {
    const now = new Date();
    const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const time = now.toTimeString().split(' ')[0]; // HH:MM:SS

    const newRecord = {
      id: uuidv4(),
      placeId,
      scheduleId,
      date,
      checkInTime: time,
      checkOutTime: null,
      scheduledStart,
      scheduledEnd,
      workHours: 0,
      calculatedPay: 0,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    setAttendance([...attendance, newRecord]);
    return newRecord;
  };

  /**
   * 퇴근 체크 및 급여 계산
   * @param {string} recordId - 출퇴근 기록 ID
   * @param {number} hourlyRate - 시급
   */
  const checkOut = (recordId, hourlyRate) => {
    const now = new Date();
    const time = now.toTimeString().split(' ')[0]; // HH:MM:SS

    setAttendance(
      attendance.map((record) => {
        if (record.id === recordId) {
          const workHours = calculateWorkHours(record.checkInTime, time);
          const calculatedPay = Math.round(workHours * hourlyRate);

          return {
            ...record,
            checkOutTime: time,
            workHours,
            calculatedPay,
            updatedAt: now.toISOString(),
          };
        }
        return record;
      })
    );
  };

  /**
   * 근무 시간 계산 (시간 단위)
   * @param {string} checkInTime - 출근 시간 (HH:MM:SS)
   * @param {string} checkOutTime - 퇴근 시간 (HH:MM:SS)
   */
  const calculateWorkHours = (checkInTime, checkOutTime) => {
    const [inHour, inMin, inSec] = checkInTime.split(':').map(Number);
    const [outHour, outMin, outSec] = checkOutTime.split(':').map(Number);

    const inMinutes = inHour * 60 + inMin + inSec / 60;
    const outMinutes = outHour * 60 + outMin + outSec / 60;

    const workMinutes = outMinutes - inMinutes;
    return workMinutes / 60; // 시간 단위로 반환
  };

  /**
   * 오늘 출퇴근 기록 가져오기
   */
  const getTodayRecords = () => {
    const today = new Date().toISOString().split('T')[0];
    return attendance.filter((record) => record.date === today);
  };

  /**
   * 특정 스케줄의 오늘 기록 찾기
   * @param {string} scheduleId - 스케줄 ID
   */
  const getTodayRecordBySchedule = (scheduleId) => {
    const today = new Date().toISOString().split('T')[0];
    return attendance.find(
      (record) => record.scheduleId === scheduleId && record.date === today
    );
  };

  /**
   * 날짜 범위로 기록 가져오기
   * @param {string} startDate - 시작 날짜 (YYYY-MM-DD)
   * @param {string} endDate - 종료 날짜 (YYYY-MM-DD)
   */
  const getRecordsByDateRange = (startDate, endDate) => {
    return attendance.filter(
      (record) => record.date >= startDate && record.date <= endDate
    );
  };

  return {
    attendance,
    checkIn,
    checkOut,
    getTodayRecords,
    getTodayRecordBySchedule,
    getRecordsByDateRange,
    calculateWorkHours,
  };
}
