import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { usePlaces } from '../../hooks/usePlaces';
import { useCalendarAttendance } from '../../hooks/useCalendarAttendance';

/**
 * 날짜 상세 모달 - 하루에 여러 곳 출근 가능
 */
export default function DayDetailModal({ isOpen, onClose, date }) {
  const { places } = usePlaces();
  const { getAttendancesByDate, addAttendanceForDate, updateAttendance, deleteAttendance } =
    useCalendarAttendance();

  const [records, setRecords] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // 폼 상태
  const [formData, setFormData] = useState({
    placeId: '',
    hours: '',
    additionalAllowance: '',
    isHoliday: false,
  });

  // 날짜 포맷 유틸리티
  const formatDate = (d) => {
    if (!d) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const dateStr = formatDate(date);

  // 데이터 로드
  useEffect(() => {
    if (!date) return;
    const existingRecords = getAttendancesByDate(dateStr);
    setRecords(existingRecords);

    // 기본값 설정
    if (places.length > 0) {
      setFormData({
        placeId: places[0].id,
        hours: '',
        additionalAllowance: '',
        isHoliday: false,
      });
    }
  }, [date, dateStr]);

  // 폼 초기화
  const resetForm = () => {
    setFormData({
      placeId: places.length > 0 ? places[0].id : '',
      hours: '',
      additionalAllowance: '',
      isHoliday: false,
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  // 일급 미리보기 계산
  const calculatePreview = (data) => {
    const { placeId, hours, additionalAllowance, isHoliday } = data;
    if (!placeId || !hours || Number(hours) <= 0) return 0;

    const place = places.find((p) => p.id === placeId);
    if (!place) return 0;

    const hourlyRate = place.hourlyRate || 0;
    const multiplier = isHoliday ? 1.5 : 1.0;
    const allowance = Number(additionalAllowance) || 0;

    return Math.round(hourlyRate * Number(hours) * multiplier + allowance);
  };

  // 추가 핸들러
  const handleAdd = () => {
    if (!formData.placeId || !formData.hours || Number(formData.hours) <= 0) {
      alert('장소와 근무 시간을 입력해주세요.');
      return;
    }

    addAttendanceForDate(dateStr, {
      placeId: formData.placeId,
      hours: Number(formData.hours),
      additionalAllowance: Number(formData.additionalAllowance) || 0,
      isHoliday: formData.isHoliday,
    });

    // 목록 새로고침
    const updatedRecords = getAttendancesByDate(dateStr);
    setRecords(updatedRecords);
    resetForm();
  };

  // 수정 시작
  const handleEditStart = (record) => {
    setEditingId(record.id);
    setFormData({
      placeId: record.placeId,
      hours: String(record.hours),
      additionalAllowance: String(record.additionalAllowance || ''),
      isHoliday: record.isHoliday,
    });
    setShowAddForm(true);
  };

  // 수정 저장
  const handleUpdate = () => {
    if (!formData.placeId || !formData.hours || Number(formData.hours) <= 0) {
      alert('장소와 근무 시간을 입력해주세요.');
      return;
    }

    updateAttendance(editingId, {
      placeId: formData.placeId,
      hours: Number(formData.hours),
      additionalAllowance: Number(formData.additionalAllowance) || 0,
      isHoliday: formData.isHoliday,
    });

    // 목록 새로고침
    const updatedRecords = getAttendancesByDate(dateStr);
    setRecords(updatedRecords);
    resetForm();
  };

  // 삭제 핸들러
  const handleDelete = (id) => {
    if (confirm('이 출근 기록을 삭제하시겠습니까?')) {
      deleteAttendance(id);
      const updatedRecords = getAttendancesByDate(dateStr);
      setRecords(updatedRecords);
      if (editingId === id) {
        resetForm();
      }
    }
  };

  // 총합 계산
  const totalHours = records.reduce((sum, r) => sum + r.hours, 0);
  const totalPay = records.reduce((sum, r) => sum + r.dailyPay, 0);

  if (!date) return null;

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
        {/* 기존 출근 기록 리스트 */}
        {records.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xl font-bold">출근 기록 ({records.length}곳)</h3>
            {records.map((record) => (
              <div
                key={record.id}
                className={`p-4 rounded-xl border-2 ${
                  record.isHoliday ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold">
                      {record.place?.name || '(삭제된 장소)'}
                      {record.isHoliday && ' 🎉'}
                    </h4>
                    <p className="text-base text-gray-700">
                      {record.hours}시간
                      {record.additionalAllowance > 0 &&
                        ` + 수당 ${record.additionalAllowance.toLocaleString()}원`}
                    </p>
                    <p className="text-xl font-bold text-green-600 mt-1">
                      {record.dailyPay.toLocaleString()}원
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditStart(record)}
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* 일일 총합 */}
            <div className="p-4 bg-primary-50 rounded-xl border-2 border-primary-300">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">오늘 총합:</span>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary-600">{totalHours}시간</p>
                  <p className="text-2xl font-bold text-green-600">
                    {totalPay.toLocaleString()}원
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 빈 상태 */}
        {records.length === 0 && !showAddForm && (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600 mb-4">아직 출근 기록이 없습니다</p>
          </div>
        )}

        {/* 추가 버튼 */}
        {!showAddForm && (
          <Button
            variant="primary"
            onClick={() => setShowAddForm(true)}
            fullWidth
          >
            + 출근 추가
          </Button>
        )}

        {/* 추가/수정 폼 */}
        {showAddForm && (
          <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-300 space-y-4">
            <h3 className="text-xl font-bold">
              {editingId ? '출근 기록 수정' : '새 출근 추가'}
            </h3>

            {/* 장소 선택 */}
            <div>
              <label className="block text-lg font-semibold mb-2">장소</label>
              {places.length === 0 ? (
                <p className="text-base text-red-600">
                  등록된 장소가 없습니다. 장소를 먼저 등록해주세요.
                </p>
              ) : (
                <select
                  value={formData.placeId}
                  onChange={(e) => setFormData({ ...formData, placeId: e.target.value })}
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
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                placeholder="8"
                min="0"
                step="0.5"
              />
              <p className="text-sm text-gray-600 mt-1">시간 단위로 입력 (예: 8, 8.5)</p>
            </div>

            {/* 추가 수당 */}
            <div>
              <label className="block text-lg font-semibold mb-2">추가 수당 (선택)</label>
              <Input
                type="number"
                inputMode="numeric"
                value={formData.additionalAllowance}
                onChange={(e) =>
                  setFormData({ ...formData, additionalAllowance: e.target.value })
                }
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
                checked={formData.isHoliday}
                onChange={(e) => setFormData({ ...formData, isHoliday: e.target.checked })}
                className="w-6 h-6 rounded"
              />
              <label htmlFor="isHoliday" className="text-lg font-semibold cursor-pointer">
                공휴일 (시급 1.5배)
              </label>
            </div>

            {/* 급여 미리보기 */}
            {calculatePreview(formData) > 0 && (
              <div className="p-4 bg-primary-50 rounded-xl">
                <p className="text-lg font-semibold mb-2">예상 급여</p>
                <p className="text-3xl font-bold text-primary-600">
                  {calculatePreview(formData).toLocaleString()}원
                </p>
                {formData.isHoliday && (
                  <p className="text-sm text-red-600 mt-1">공휴일 가산 적용됨</p>
                )}
              </div>
            )}

            {/* 폼 버튼 */}
            <div className="flex gap-3">
              <Button variant="secondary" onClick={resetForm} fullWidth>
                취소
              </Button>
              <Button
                variant="primary"
                onClick={editingId ? handleUpdate : handleAdd}
                fullWidth
              >
                {editingId ? '수정' : '추가'}
              </Button>
            </div>
          </div>
        )}

        {/* 닫기 버튼 */}
        <div className="pt-4 border-t">
          <Button variant="secondary" onClick={onClose} fullWidth>
            닫기
          </Button>
        </div>
      </div>
    </Modal>
  );
}
