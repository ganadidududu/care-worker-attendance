import { usePlaces } from '../hooks/usePlaces';
import { useSchedule } from '../hooks/useSchedule';
import { useAttendance } from '../hooks/useAttendance';
import Card from '../components/common/Card';
import CheckItem from '../components/checklist/CheckItem';

/**
 * 체크리스트 페이지
 * 오늘 방문할 장소 목록 및 출퇴근 체크
 */
export default function ChecklistPage() {
  const { places } = usePlaces();
  const { getTodaySchedules } = useSchedule();
  const { checkIn, checkOut, getTodayRecordBySchedule } = useAttendance();

  // 오늘 스케줄 가져오기
  const todaySchedules = getTodaySchedules(places);

  // 출근 체크 핸들러
  const handleCheckIn = (schedule) => {
    checkIn(
      schedule.placeId,
      schedule.id,
      schedule.startTime,
      schedule.endTime
    );
  };

  // 퇴근 체크 핸들러
  const handleCheckOut = (schedule, place) => {
    const record = getTodayRecordBySchedule(schedule.id);
    if (record) {
      checkOut(record.id, place.hourlyRate);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-4xl font-bold mb-6">오늘 체크리스트</h1>

      {/* 오늘 날짜 */}
      <Card className="mb-6 bg-primary-50">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary-700">
            {new Date().toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long',
            })}
          </p>
        </div>
      </Card>

      {/* 스케줄이 없을 때 */}
      {todaySchedules.length === 0 && (
        <Card>
          <div className="text-center py-8">
            <p className="text-xl text-gray-600 mb-4">
              오늘은 등록된 일정이 없습니다
            </p>
            <p className="text-lg text-gray-500">
              스케줄 설정 메뉴에서 주간 일정을 등록하세요
            </p>
          </div>
        </Card>
      )}

      {/* 오늘 스케줄 목록 */}
      <div className="space-y-4">
        {todaySchedules.map((schedule) => (
          <CheckItem
            key={schedule.id}
            schedule={schedule}
            place={schedule.place}
            record={getTodayRecordBySchedule(schedule.id)}
            onCheckIn={() => handleCheckIn(schedule)}
            onCheckOut={() => handleCheckOut(schedule, schedule.place)}
          />
        ))}
      </div>

      {/* 오늘 요약 */}
      {todaySchedules.length > 0 && (
        <Card className="mt-6 bg-gray-50">
          <h2 className="text-xl font-bold mb-3">오늘 요약</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-lg">
              <span>총 방문 예정:</span>
              <span className="font-bold">{todaySchedules.length}곳</span>
            </div>
            <div className="flex justify-between text-lg">
              <span>완료:</span>
              <span className="font-bold text-green-600">
                {
                  todaySchedules.filter((s) => {
                    const record = getTodayRecordBySchedule(s.id);
                    return record?.checkOutTime;
                  }).length
                }
                곳
              </span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
