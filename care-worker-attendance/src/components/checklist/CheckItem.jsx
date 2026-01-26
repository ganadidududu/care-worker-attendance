import { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

/**
 * 체크리스트 아이템 컴포넌트
 * 출퇴근 체크 버튼 포함
 */
export default function CheckItem({
  schedule,
  place,
  record,
  onCheckIn,
  onCheckOut,
}) {
  // 출근/퇴근 상태
  const isCheckedIn = record?.checkInTime && !record?.checkOutTime;
  const isCompleted = record?.checkInTime && record?.checkOutTime;

  return (
    <Card
      className={`${
        isCompleted
          ? 'bg-green-50 border-2 border-green-500'
          : isCheckedIn
          ? 'bg-blue-50 border-2 border-blue-500'
          : ''
      }`}
    >
      <div className="space-y-4">
        {/* 장소 정보 */}
        <div>
          <h3 className="text-2xl font-bold mb-2">{place.name}</h3>
          <div className="flex flex-wrap gap-4 text-lg">
            <span className="text-gray-700">
              예정: {schedule.startTime} - {schedule.endTime}
            </span>
            <span className="text-primary-600 font-semibold">
              시급: {place.hourlyRate.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* 실제 출퇴근 시간 */}
        {record && (
          <div className="bg-white rounded-lg p-4 space-y-2">
            {record.checkInTime && (
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-blue-600">
                  출근:
                </span>
                <span className="text-xl font-bold">
                  {record.checkInTime.substring(0, 5)}
                </span>
              </div>
            )}
            {record.checkOutTime && (
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-green-600">
                  퇴근:
                </span>
                <span className="text-xl font-bold">
                  {record.checkOutTime.substring(0, 5)}
                </span>
              </div>
            )}
            {record.workHours > 0 && (
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">근무 시간:</span>
                  <span className="text-xl font-bold text-primary-600">
                    {record.workHours.toFixed(2)}시간
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">급여:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {record.calculatedPay.toLocaleString()}원
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 출퇴근 버튼 */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant={isCheckedIn || isCompleted ? 'secondary' : 'success'}
            disabled={isCheckedIn || isCompleted}
            onClick={onCheckIn}
            fullWidth
          >
            {record?.checkInTime ? '출근 완료 ✓' : '출근 체크'}
          </Button>
          <Button
            variant={isCompleted ? 'secondary' : 'danger'}
            disabled={!isCheckedIn || isCompleted}
            onClick={onCheckOut}
            fullWidth
          >
            {record?.checkOutTime ? '퇴근 완료 ✓' : '퇴근 체크'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
