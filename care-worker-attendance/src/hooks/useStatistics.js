import { useApp } from '../context/AppContext';

/**
 * 통계 계산을 위한 커스텀 훅
 */
export function useStatistics() {
  const { attendance, places } = useApp();

  /**
   * 주간 통계 계산
   */
  const calculateWeeklyStats = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = 일요일
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // 타임존 문제 해결: toISOString 대신 로컬 날짜 사용
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const startDate = formatDate(startOfWeek);
    const endDate = formatDate(endOfWeek);

    const weekRecords = attendance.filter(
      (record) => record.date >= startDate && record.date <= endDate && record.checkOutTime
    );

    const totalHours = weekRecords.reduce((sum, r) => sum + r.workHours, 0);
    const totalPay = weekRecords.reduce((sum, r) => sum + r.calculatedPay, 0);

    // 장소별 통계
    const byPlace = weekRecords.reduce((acc, record) => {
      const placeId = record.placeId;
      if (!acc[placeId]) {
        const place = places.find((p) => p.id === placeId);
        acc[placeId] = {
          place,
          hours: 0,
          pay: 0,
          visits: 0,
        };
      }
      acc[placeId].hours += record.workHours;
      acc[placeId].pay += record.calculatedPay;
      acc[placeId].visits += 1;
      return acc;
    }, {});

    return {
      startDate,
      endDate,
      totalHours,
      totalPay,
      recordCount: weekRecords.length,
      byPlace: Object.values(byPlace).filter((stat) => stat.place),
    };
  };

  /**
   * 월간 통계 계산
   */
  const calculateMonthlyStats = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);

    // 타임존 문제 해결: toISOString 대신 로컬 날짜 사용
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const startDate = formatDate(startOfMonth);
    const endDate = formatDate(endOfMonth);

    const monthRecords = attendance.filter(
      (record) => record.date >= startDate && record.date <= endDate && record.checkOutTime
    );

    const totalHours = monthRecords.reduce((sum, r) => sum + r.workHours, 0);
    const totalPay = monthRecords.reduce((sum, r) => sum + r.calculatedPay, 0);

    // 장소별 통계
    const byPlace = monthRecords.reduce((acc, record) => {
      const placeId = record.placeId;
      if (!acc[placeId]) {
        const place = places.find((p) => p.id === placeId);
        acc[placeId] = {
          place,
          hours: 0,
          pay: 0,
          visits: 0,
        };
      }
      acc[placeId].hours += record.workHours;
      acc[placeId].pay += record.calculatedPay;
      acc[placeId].visits += 1;
      return acc;
    }, {});

    // 일별 통계 (그래프용)
    const byDay = monthRecords.reduce((acc, record) => {
      const day = record.date;
      if (!acc[day]) {
        acc[day] = {
          date: day,
          hours: 0,
          pay: 0,
          visits: 0,
        };
      }
      acc[day].hours += record.workHours;
      acc[day].pay += record.calculatedPay;
      acc[day].visits += 1;
      return acc;
    }, {});

    return {
      year,
      month: month + 1,
      startDate,
      endDate,
      totalHours,
      totalPay,
      recordCount: monthRecords.length,
      byPlace: Object.values(byPlace).filter((stat) => stat.place),
      byDay: Object.values(byDay).sort((a, b) => a.date.localeCompare(b.date)),
    };
  };

  /**
   * 날짜 범위로 통계 계산
   */
  const calculateRangeStats = (startDate, endDate) => {
    const rangeRecords = attendance.filter(
      (record) => record.date >= startDate && record.date <= endDate && record.checkOutTime
    );

    const totalHours = rangeRecords.reduce((sum, r) => sum + r.workHours, 0);
    const totalPay = rangeRecords.reduce((sum, r) => sum + r.calculatedPay, 0);

    return {
      startDate,
      endDate,
      totalHours,
      totalPay,
      recordCount: rangeRecords.length,
    };
  };

  return {
    calculateWeeklyStats,
    calculateMonthlyStats,
    calculateRangeStats,
  };
}
