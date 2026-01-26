import { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

/**
 * 장소 추가/수정 폼 컴포넌트
 */
export default function PlaceForm({ place, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: place?.name || '',
    hourlyRate: place?.hourlyRate || '',
    memo: place?.memo || '',
  });

  const [errors, setErrors] = useState({});

  // 유효성 검증
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '장소 이름을 입력해주세요';
    }

    if (!formData.hourlyRate || formData.hourlyRate <= 0) {
      newErrors.hourlyRate = '올바른 시급을 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        hourlyRate: Number(formData.hourlyRate),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="장소 이름"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="예: 김영희 어르신 댁"
        error={errors.name}
        required
      />

      <Input
        label="시급 (원)"
        type="number"
        value={formData.hourlyRate}
        onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
        placeholder="15000"
        error={errors.hourlyRate}
        required
        min="0"
        step="100"
      />

      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">메모</label>
        <textarea
          value={formData.memo}
          onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
          placeholder="특이사항, 주소, 비밀번호 등"
          className="input-large w-full min-h-[120px] resize-none"
        />
      </div>

      <div className="flex gap-3 mt-6">
        <Button type="button" variant="secondary" onClick={onCancel} fullWidth>
          취소
        </Button>
        <Button type="submit" variant="primary" fullWidth>
          저장
        </Button>
      </div>
    </form>
  );
}
