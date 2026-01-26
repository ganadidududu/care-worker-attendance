import { v4 as uuidv4 } from 'uuid';
import { useApp } from '../context/AppContext';

/**
 * 장소 관리를 위한 커스텀 훅
 * CRUD 기능을 제공합니다
 */
export function usePlaces() {
  const { places, setPlaces } = useApp();

  /**
   * 새 장소 추가
   * @param {Object} placeData - 장소 데이터 (name, hourlyRate, memo)
   * @returns {Object} 생성된 장소 객체
   */
  const addPlace = (placeData) => {
    const newPlace = {
      id: uuidv4(),
      ...placeData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPlaces([...places, newPlace]);
    return newPlace;
  };

  /**
   * 장소 정보 수정
   * @param {string} id - 장소 ID
   * @param {Object} updates - 수정할 데이터
   */
  const updatePlace = (id, updates) => {
    setPlaces(
      places.map((place) =>
        place.id === id
          ? { ...place, ...updates, updatedAt: new Date().toISOString() }
          : place
      )
    );
  };

  /**
   * 장소 삭제
   * @param {string} id - 장소 ID
   */
  const deletePlace = (id) => {
    setPlaces(places.filter((place) => place.id !== id));
  };

  /**
   * ID로 장소 찾기
   * @param {string} id - 장소 ID
   * @returns {Object|undefined} 찾은 장소 또는 undefined
   */
  const getPlaceById = (id) => {
    return places.find((place) => place.id === id);
  };

  return { places, addPlace, updatePlace, deletePlace, getPlaceById };
}
