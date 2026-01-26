import PlaceCard from './PlaceCard';

/**
 * 장소 목록 컴포넌트
 */
export default function PlaceList({ places, onEdit, onDelete }) {
  if (places.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-500">등록된 장소가 없습니다</p>
        <p className="text-lg text-gray-400 mt-2">+ 버튼을 눌러 장소를 추가하세요</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {places.map((place) => (
        <PlaceCard
          key={place.id}
          place={place}
          onEdit={() => onEdit(place)}
          onDelete={() => onDelete(place.id)}
        />
      ))}
    </div>
  );
}
