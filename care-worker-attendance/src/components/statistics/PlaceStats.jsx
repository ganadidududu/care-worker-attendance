import Card from '../common/Card';

/**
 * 장소별 통계 컴포넌트
 */
export default function PlaceStats({ placeStats }) {
  if (!placeStats || placeStats.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <h2 className="text-2xl font-bold mb-4">장소별 통계</h2>

      <div className="space-y-4">
        {placeStats.map((stat) => (
          <div key={stat.place.id} className="pb-4 border-b last:border-b-0">
            <h3 className="text-xl font-bold mb-2">{stat.place.name}</h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-sm text-gray-600">방문</p>
                <p className="text-lg font-bold text-primary-600">
                  {stat.visits}회
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">시간</p>
                <p className="text-lg font-bold text-primary-600">
                  {stat.hours.toFixed(1)}h
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">급여</p>
                <p className="text-lg font-bold text-green-600">
                  {stat.pay.toLocaleString()}원
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
