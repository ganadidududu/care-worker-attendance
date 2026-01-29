import { useState } from 'react';
import Card from '../common/Card';

/**
 * 월별 요약 통계 컴포넌트
 * 총 근무 일수, 시간, 급여 및 장소별 통계 표시
 */
export default function MonthSummary({ year, month, totals }) {
  const [showDetails, setShowDetails] = useState(false);

  const { totalDays, totalHours, totalPay, byPlace } = totals;

  // 데이터가 없을 때
  if (totalDays === 0) {
    return (
      <Card className="bg-gray-50">
        <p className="text-lg text-gray-600 text-center">
          {year}년 {month}월에는 근무 기록이 없습니다
        </p>
      </Card>
    );
  }

  return (
    <Card className="bg-primary-50">
      <h2 className="text-2xl font-bold mb-4">
        {year}년 {month}월 요약
      </h2>

      {/* 전체 통계 */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-lg text-gray-700">총 근무 일수</span>
          <span className="text-2xl font-bold text-gray-900">{totalDays}일</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg text-gray-700">총 근무 시간</span>
          <span className="text-2xl font-bold text-primary-600">
            {totalHours.toFixed(1)}시간
          </span>
        </div>
        <div className="flex justify-between items-center pt-3 border-t-2 border-primary-200">
          <span className="text-xl font-bold text-gray-900">총 급여</span>
          <span className="text-3xl font-bold text-green-600">
            {totalPay.toLocaleString()}원
          </span>
        </div>
      </div>

      {/* 장소별 상세 (접기/펼치기) */}
      {byPlace.length > 0 && (
        <div className="mt-4 pt-4 border-t-2 border-primary-200">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex justify-between items-center text-lg font-semibold text-primary-700 hover:text-primary-900 transition-colors"
          >
            <span>장소별 상세</span>
            <span className="text-2xl">{showDetails ? '▲' : '▼'}</span>
          </button>

          {showDetails && (
            <div className="mt-4 space-y-3">
              {byPlace.map((stat) => (
                <div
                  key={stat.place?.id}
                  className="p-3 bg-white rounded-lg border border-primary-200"
                >
                  <h3 className="text-lg font-bold mb-2">
                    {stat.place?.name || '(삭제된 장소)'}
                  </h3>
                  <div className="space-y-1 text-base text-gray-700">
                    <div className="flex justify-between">
                      <span>근무 일수:</span>
                      <span className="font-semibold">{stat.days}일</span>
                    </div>
                    <div className="flex justify-between">
                      <span>근무 시간:</span>
                      <span className="font-semibold">{stat.hours.toFixed(1)}시간</span>
                    </div>
                    <div className="flex justify-between">
                      <span>급여:</span>
                      <span className="font-semibold text-green-600">
                        {stat.pay.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
