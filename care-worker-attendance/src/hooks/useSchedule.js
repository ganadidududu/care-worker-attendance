import { v4 as uuidv4 } from 'uuid';
import { useApp } from '../context/AppContext';

/**
 * 스케줄 관리를 위한 커스텀 훅
 * 요일별 출퇴근 시간 설정 기능
 */
export function useSchedule() {
  const { schedules, setSchedules } = useApp();

  /**
   * 새 스케줄 추가
   * @param {Object} scheduleData - { placeId, dayOfWeek, startTime, endTime, isActive }
   */
  const addSchedule = (scheduleData) => {
    const newSchedule = {
      id: uuidv4(),
      ...scheduleData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSchedules([...schedules, newSchedule]);
    return newSchedule;
  };

  /**
   * 스케줄 수정
   * @param {string} id - 스케줄 ID
   * @param {Object} updates - 수정할 데이터
   */
  const updateSchedule = (id, updates) => {
    setSchedules(
      schedules.map((schedule) =>
        schedule.id === id
          ? { ...schedule, ...updates, updatedAt: new Date().toISOString() }
          : schedule
      )
    );
  };

  /**
   * 스케줄 삭제
   * @param {string} id - 스케줄 ID
   */
  const deleteSchedule = (id) => {
    setSchedules(schedules.filter((schedule) => schedule.id !== id));
  };

  /**
   * 특정 장소의 스케줄 가져오기
   * @param {string} placeId - 장소 ID
   */
  const getSchedulesByPlace = (placeId) => {
    return schedules.filter((schedule) => schedule.placeId === placeId);
  };

  /**
   * 특정 요일의 모든 스케줄 가져오기
   * @param {number} dayOfWeek - 요일 (0=일요일, 1=월요일, ..., 6=토요일)
   */
  const getSchedulesByDay = (dayOfWeek) => {
    return schedules.filter(
      (schedule) => schedule.dayOfWeek === dayOfWeek && schedule.isActive
    );
  };

  /**
   * 오늘의 활성 스케줄 가져오기 (장소 정보 포함)
   * @param {Array} places - 장소 목록
   */
  const getTodaySchedules = (places) => {
    const today = new Date().getDay(); // 0=일요일, 1=월요일, ..., 6=토요일
    const todaySchedules = schedules.filter(
      (schedule) => schedule.dayOfWeek === today && schedule.isActive
    );

    // 장소 정보와 결합하고 시작 시간 순으로 정렬
    return todaySchedules
      .map((schedule) => ({
        ...schedule,
        place: places.find((p) => p.id === schedule.placeId),
      }))
      .filter((s) => s.place) // 장소가 삭제된 스케줄 제외
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  /**
   * 특정 장소와 요일의 스케줄 업데이트 (있으면 수정, 없으면 추가)
   * @param {string} placeId - 장소 ID
   * @param {number} dayOfWeek - 요일
   * @param {Object} scheduleData - { startTime, endTime, isActive }
   */
  const setScheduleForDay = (placeId, dayOfWeek, scheduleData) => {
    const existing = schedules.find(
      (s) => s.placeId === placeId && s.dayOfWeek === dayOfWeek
    );

    if (existing) {
      updateSchedule(existing.id, scheduleData);
    } else {
      addSchedule({
        placeId,
        dayOfWeek,
        ...scheduleData,
      });
    }
  };

  return {
    schedules,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    getSchedulesByPlace,
    getSchedulesByDay,
    getTodaySchedules,
    setScheduleForDay,
  };
}
