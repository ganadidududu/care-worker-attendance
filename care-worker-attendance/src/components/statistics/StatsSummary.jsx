import Card from '../common/Card';

/**
 * 통계 요약 카드 컴포넌트
 */
export default function StatsSummary({ title, stats }) {
  return (
    <Card className="mb-6">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>

      <div className="space-y-4">
        {/* 총 근무 시간 */}
        <div className="flex justify-between items-center pb-3 border-b">
          <span className="text-lg font-semibold">총 근무 시간</span>
          <span className="text-3xl font-bold text-primary-600">
            {stats.totalHours.toFixed(1)}시간
          </span>
        </div>

        {/* 총 급여 */}
        <div className="flex justify-between items-center pb-3 border-b">
          <span className="text-lg font-semibold">총 급여</span>
          <span className="text-3xl font-bold text-green-600">
            {stats.totalPay.toLocaleString()}원
          </span>
        </div>

        {/* 근무 일수 */}
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">근무 일수</span>
          <span className="text-2xl font-bold text-gray-700">
            {stats.recordCount}일
          </span>
        </div>
      </div>
    </Card>
  );
}
