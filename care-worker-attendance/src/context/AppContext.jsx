import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Context 생성
const AppContext = createContext();

/**
 * 전역 상태 관리 Provider
 * 장소, 출퇴근 기록 데이터를 관리합니다
 */
export const AppProvider = ({ children }) => {
  // 장소 데이터
  const [places, setPlaces] = useLocalStorage('care_places', []);

  // 출퇴근 기록 데이터 (v2 - 달력 기반 시스템)
  const [attendance, setAttendance] = useLocalStorage('care_attendance_v2', []);

  const value = {
    places,
    setPlaces,
    attendance,
    setAttendance,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/**
 * App Context를 사용하기 위한 커스텀 훅
 */
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
