import Card from '../common/Card';
import Button from '../common/Button';

/**
 * 장소 카드 컴포넌트
 * 장소 정보를 보기 좋게 표시
 */
export default function PlaceCard({ place, onEdit, onDelete }) {
  return (
    <Card>
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-2">{place.name}</h3>
          <p className="text-xl text-primary-600 font-semibold">
            시급: {place.hourlyRate.toLocaleString()}원
          </p>
          {place.memo && (
            <p className="text-base text-gray-600 mt-2 whitespace-pre-wrap">
              {place.memo}
            </p>
          )}
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="secondary"
            onClick={onEdit}
            className="px-6 py-3 flex-1 sm:flex-initial"
          >
            수정
          </Button>
          <Button
            variant="danger"
            onClick={onDelete}
            className="px-6 py-3 flex-1 sm:flex-initial"
          >
            삭제
          </Button>
        </div>
      </div>
    </Card>
  );
}
