import { v4 as uuidv4 } from 'uuid';
import { useApp } from '../context/AppContext';

/**
 * 날짜 포맷 유틸리티 (타임존 이슈 방지)
 * @param {Date} date - Date 객체
 * @returns {string} YYYY-MM-DD 형식 문자열
 */
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 달력 기반 출퇴근 관리를 위한 커스텀 훅
 * 간단한 출근 여부 체크 및 수동 시간 입력
 */
export function useCalendarAttendance() {
  const { attendance, setAttendance, places } = useApp();

  /**
   * 특정 날짜의 모든 출퇴근 기록 가져오기 (하루에 여러 곳 가능)
   * @param {string} date - YYYY-MM-DD 형식 날짜
   * @returns {Array} 출퇴근 기록 배열
   */
  const getAttendancesByDate = (date) => {
    const records = attendance.filter((a) => a.date === date && a.worked);
    return records.map((record) => {
      const place = places.find((p) => p.id === record.placeId);
      return { ...record, place };
    });
  };

  /**
   * 새로운 출퇴근 기록 추가 (하루에 여러 개 가능)
   * @param {string} date - YYYY-MM-DD 형식 날짜
   * @param {Object} data - { placeId, hours, additionalAllowance, isHoliday }
   * @returns {Object} 생성된 기록
   */
  const addAttendanceForDate = (date, data) => {
    const { placeId, hours, additionalAllowance = 0, isHoliday = false } = data;

    // 일급 계산
    let dailyPay = 0;
    if (placeId && hours > 0) {
      const place = places.find((p) => p.id === placeId);
      if (place) {
        const hourlyRate = place.hourlyRate || 0;
        const multiplier = isHoliday ? 1.5 : 1.0;
        dailyPay = Math.round(hourlyRate * hours * multiplier + additionalAllowance);
      }
    }

    // 새 기록 추가
    const newRecord = {
      id: uuidv4(),
      date,
      worked: true,
      placeId,
      hours,
      additionalAllowance,
      isHoliday,
      dailyPay,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setAttendance([...attendance, newRecord]);
    return newRecord;
  };

  /**
   * 기존 출퇴근 기록 수정
   * @param {string} id - 기록 ID
   * @param {Object} data - { placeId, hours, additionalAllowance, isHoliday }
   * @returns {Object} 수정된 기록
   */
  const updateAttendance = (id, data) => {
    const { placeId, hours, additionalAllowance = 0, isHoliday = false } = data;

    // 일급 계산
    let dailyPay = 0;
    if (placeId && hours > 0) {
      const place = places.find((p) => p.id === placeId);
      if (place) {
        const hourlyRate = place.hourlyRate || 0;
        const multiplier = isHoliday ? 1.5 : 1.0;
        dailyPay = Math.round(hourlyRate * hours * multiplier + additionalAllowance);
      }
    }

    const newAttendance = attendance.map((record) =>
      record.id === id
        ? {
            ...record,
            placeId,
            hours,
            additionalAllowance,
            isHoliday,
            dailyPay,
            updatedAt: new Date().toISOString(),
          }
        : record
    );

    setAttendance(newAttendance);
    return newAttendance.find((r) => r.id === id);
  };

  /**
   * 특정 출퇴근 기록 삭제 (ID로)
   * @param {string} id - 기록 ID
   */
  const deleteAttendance = (id) => {
    setAttendance(attendance.filter((a) => a.id !== id));
  };

  /**
   * 특정 월의 모든 출퇴근 기록 가져오기
   * @param {number} year - 년도
   * @param {number} month - 월 (1-12)
   * @returns {Array} 출퇴근 기록 배열
   */
  const getMonthAttendance = (year, month) => {
    const startDate = formatDate(new Date(year, month - 1, 1));
    const endDate = formatDate(new Date(year, month, 0));

    return attendance
      .filter((a) => a.date >= startDate && a.date <= endDate && a.worked)
      .map((record) => {
        const place = places.find((p) => p.id === record.placeId);
        return { ...record, place };
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  /**
   * 특정 월의 총계 계산
   * @param {number} year - 년도
   * @param {number} month - 월 (1-12)
   * @returns {Object} { totalDays, totalHours, totalPay, byPlace }
   */
  const calculateMonthTotals = (year, month) => {
    const monthRecords = getMonthAttendance(year, month);

    const totalDays = monthRecords.length;
    const totalHours = monthRecords.reduce((sum, r) => sum + r.hours, 0);
    const totalPay = monthRecords.reduce((sum, r) => sum + r.dailyPay, 0);

    // 장소별 통계
    const byPlace = monthRecords.reduce((acc, record) => {
      const placeId = record.placeId;
      if (!acc[placeId]) {
        acc[placeId] = {
          place: record.place,
          days: 0,
          hours: 0,
          pay: 0,
        };
      }
      acc[placeId].days += 1;
      acc[placeId].hours += record.hours;
      acc[placeId].pay += record.dailyPay;
      return acc;
    }, {});

    return {
      totalDays,
      totalHours,
      totalPay,
      byPlace: Object.values(byPlace).filter((stat) => stat.place),
    };
  };

  return {
    attendance,
    getAttendancesByDate,
    addAttendanceForDate,
    updateAttendance,
    deleteAttendance,
    getMonthAttendance,
    calculateMonthTotals,
  };
}
