import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { usePlaces } from '../../hooks/usePlaces';
import { useCalendarAttendance } from '../../hooks/useCalendarAttendance';

/**
 * 날짜 상세/입력 모달 컴포넌트
 * 출근 여부, 장소, 근무 시간, 추가 수당, 공휴일 입력
 */
export default function DayDetailModal({ isOpen, onClose, date }) {
  const { places } = usePlaces();
  const { getAttendanceByDate, setAttendanceForDate, deleteAttendanceForDate } =
    useCalendarAttendance();

  // 폼 상태
  const [worked, setWorked] = useState(false);
  const [placeId, setPlaceId] = useState('');
  const [hours, setHours] = useState('');
  const [additionalAllowance, setAdditionalAllowance] = useState('');
  const [isHoliday, setIsHoliday] = useState(false);

  // 날짜 포맷 유틸리티
  const formatDate = (d) => {
    if (!d) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const dateStr = formatDate(date);

  // 기존 데이터 로드
  useEffect(() => {
    if (!date) return;

    const existing = getAttendanceByDate(dateStr);
    if (existing) {
      setWorked(existing.worked);
      setPlaceId(existing.placeId || '');
      setHours(existing.hours > 0 ? String(existing.hours) : '');
      setAdditionalAllowance(
        existing.additionalAllowance > 0 ? String(existing.additionalAllowance) : ''
      );
      setIsHoliday(existing.isHoliday || false);
    } else {
      // 초기화
      setWorked(false);
      setPlaceId(places.length > 0 ? places[0].id : '');
      setHours('');
      setAdditionalAllowance('');
      setIsHoliday(false);
    }
  }, [date, dateStr]);

  // 일급 미리보기 계산
  const calculatePreview = () => {
    if (!worked || !placeId || !hours || Number(hours) <= 0) {
      return 0;
    }

    const place = places.find((p) => p.id === placeId);
    if (!place) return 0;

    const hourlyRate = place.hourlyRate || 0;
    const multiplier = isHoliday ? 1.5 : 1.0;
    const allowance = Number(additionalAllowance) || 0;

    return Math.round(hourlyRate * Number(hours) * multiplier + allowance);
  };

  const previewPay = calculatePreview();

  // 저장 핸들러
  const handleSave = () => {
    if (worked && (!placeId || !hours || Number(hours) <= 0)) {
      alert('출근 시 장소와 근무 시간을 입력해주세요.');
      return;
    }

    setAttendanceForDate(dateStr, {
      worked,
      placeId: worked ? placeId : null,
      hours: worked ? Number(hours) : 0,
      additionalAllowance: worked ? Number(additionalAllowance) || 0 : 0,
      isHoliday: worked ? isHoliday : false,
    });

    onClose();
  };

  // 삭제 핸들러
  const handleDelete = () => {
    if (confirm('이 날짜의 출퇴근 기록을 삭제하시겠습니까?')) {
      deleteAttendanceForDate(dateStr);
      onClose();
    }
  };

  if (!date) return null;

  const existing = getAttendanceByDate(dateStr);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      })}
    >
      <div className="space-y-4">
        {/* 출근 여부 체크박스 */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="worked"
            checked={worked}
            onChange={(e) => setWorked(e.target.checked)}
            className="w-6 h-6 rounded"
          />
          <label htmlFor="worked" className="text-xl font-semibold cursor-pointer">
            출근했음
          </label>
        </div>

        {/* 출근했을 때만 표시 */}
        {worked && (
          <>
            {/* 장소 선택 */}
            <div>
              <label className="block text-lg font-semibold mb-2">장소</label>
              {places.length === 0 ? (
                <p className="text-base text-red-600">
                  등록된 장소가 없습니다. 장소를 먼저 등록해주세요.
                </p>
              ) : (
                <select
                  value={placeId}
                  onChange={(e) => setPlaceId(e.target.value)}
                  className="w-full min-h-[56px] px-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500"
                >
                  {places.map((place) => (
                    <option key={place.id} value={place.id}>
                      {place.name} ({place.hourlyRate.toLocaleString()}원/시간)
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* 근무 시간 */}
            <div>
              <label className="block text-lg font-semibold mb-2">근무 시간</label>
              <Input
                type="number"
                inputMode="decimal"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="8"
                min="0"
                step="0.5"
              />
              <p className="text-sm text-gray-600 mt-1">시간 단위로 입력 (예: 8, 8.5)</p>
            </div>

            {/* 추가 수당 */}
            <div>
              <label className="block text-lg font-semibold mb-2">
                추가 수당 (선택)
              </label>
              <Input
                type="number"
                inputMode="numeric"
                value={additionalAllowance}
                onChange={(e) => setAdditionalAllowance(e.target.value)}
                placeholder="0"
                min="0"
              />
              <p className="text-sm text-gray-600 mt-1">원 단위로 입력</p>
            </div>

            {/* 공휴일 체크박스 */}
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl">
              <input
                type="checkbox"
                id="isHoliday"
                checked={isHoliday}
                onChange={(e) => setIsHoliday(e.target.checked)}
                className="w-6 h-6 rounded"
              />
              <label htmlFor="isHoliday" className="text-lg font-semibold cursor-pointer">
                공휴일 (시급 1.5배)
              </label>
            </div>

            {/* 일급 미리보기 */}
            {previewPay > 0 && (
              <div className="p-4 bg-primary-50 rounded-xl">
                <p className="text-lg font-semibold mb-2">예상 일급</p>
                <p className="text-3xl font-bold text-primary-600">
                  {previewPay.toLocaleString()}원
                </p>
                {isHoliday && (
                  <p className="text-sm text-red-600 mt-1">공휴일 가산 적용됨</p>
                )}
              </div>
            )}
          </>
        )}

        {/* 버튼 영역 */}
        <div className="flex gap-3 mt-6">
          <Button variant="secondary" onClick={onClose} fullWidth>
            취소
          </Button>
          {existing && (
            <Button variant="danger" onClick={handleDelete} fullWidth>
              삭제
            </Button>
          )}
          <Button variant="primary" onClick={handleSave} fullWidth>
            저장
          </Button>
        </div>
      </div>
    </Modal>
  );
}
