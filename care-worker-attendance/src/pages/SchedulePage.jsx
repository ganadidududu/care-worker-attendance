import { useState } from 'react';
import { usePlaces } from '../hooks/usePlaces';
import { useSchedule } from '../hooks/useSchedule';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import DaySchedule from '../components/schedule/DaySchedule';

/**
 * 스케줄 설정 페이지
 * 장소별 요일별 출퇴근 시간 설정
 */
export default function SchedulePage() {
  const { places } = usePlaces();
  const { schedules, setScheduleForDay } = useSchedule();
  const [selectedPlace, setSelectedPlace] = useState(null);

  // 요일 목록
  const weekDays = [
    { id: 1, name: '월요일' },
    { id: 2, name: '화요일' },
    { id: 3, name: '수요일' },
    { id: 4, name: '목요일' },
    { id: 5, name: '금요일' },
    { id: 6, name: '토요일' },
    { id: 0, name: '일요일' },
  ];

  // 장소 선택 시
  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
  };

  // 요일별 스케줄 변경
  const handleScheduleChange = (dayOfWeek, scheduleData) => {
    if (selectedPlace) {
      setScheduleForDay(selectedPlace.id, dayOfWeek, scheduleData);
    }
  };

  // 선택된 장소의 스케줄 가져오기
  const getScheduleForDay = (dayOfWeek) => {
    if (!selectedPlace) return null;
    return schedules.find(
      (s) => s.placeId === selectedPlace.id && s.dayOfWeek === dayOfWeek
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-4xl font-bold mb-6">스케줄 설정</h1>

      {/* 장소가 없을 때 */}
      {places.length === 0 && (
        <Card>
          <p className="text-xl text-gray-600 text-center">
            먼저 방문 장소를 등록해주세요
          </p>
        </Card>
      )}

      {/* 장소 선택 */}
      {places.length > 0 && !selectedPlace && (
        <div>
          <h2 className="text-2xl font-bold mb-4">장소를 선택하세요</h2>
          <div className="space-y-3">
            {places.map((place) => (
              <Card
                key={place.id}
                onClick={() => handlePlaceSelect(place)}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold">{place.name}</h3>
                    <p className="text-lg text-primary-600">
                      시급: {place.hourlyRate.toLocaleString()}원
                    </p>
                  </div>
                  <span className="text-2xl">→</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 선택된 장소의 스케줄 설정 */}
      {selectedPlace && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="secondary"
              onClick={() => setSelectedPlace(null)}
              className="px-6 py-3"
            >
              ← 뒤로
            </Button>
            <h2 className="text-2xl font-bold">{selectedPlace.name}</h2>
          </div>

          <Card className="mb-4">
            <p className="text-lg text-gray-700">
              요일별로 출퇴근 시간을 설정하세요
            </p>
          </Card>

          {/* 요일별 스케줄 */}
          {weekDays.map((day) => (
            <DaySchedule
              key={day.id}
              dayName={day.name}
              schedule={getScheduleForDay(day.id)}
              onChange={(scheduleData) =>
                handleScheduleChange(day.id, scheduleData)
              }
            />
          ))}

          <div className="mt-6">
            <Button
              variant="primary"
              fullWidth
              onClick={() => setSelectedPlace(null)}
            >
              완료
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
