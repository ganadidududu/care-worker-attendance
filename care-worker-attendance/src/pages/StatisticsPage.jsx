import { useState } from 'react';
import { useStatistics } from '../hooks/useStatistics';
import Card from '../components/common/Card';
import StatsSummary from '../components/statistics/StatsSummary';
import PlaceStats from '../components/statistics/PlaceStats';

/**
 * 통계 페이지
 * 주간/월간 근무 통계 표시
 */
export default function StatisticsPage() {
  const { calculateWeeklyStats, calculateMonthlyStats } = useStatistics();
  const [activeTab, setActiveTab] = useState('week'); // 'week' | 'month'

  const weeklyStats = calculateWeeklyStats();
  const monthlyStats = calculateMonthlyStats();

  const currentStats = activeTab === 'week' ? weeklyStats : monthlyStats;

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-4xl font-bold mb-6">통계 및 내역</h1>

      {/* 탭 선택 */}
      <Card className="mb-6">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setActiveTab('week')}
            className={`py-4 px-6 rounded-xl text-xl font-bold transition-colors ${
              activeTab === 'week'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            주간
          </button>
          <button
            onClick={() => setActiveTab('month')}
            className={`py-4 px-6 rounded-xl text-xl font-bold transition-colors ${
              activeTab === 'month'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            월간
          </button>
        </div>
      </Card>

      {/* 기간 표시 */}
      <Card className="mb-6 bg-blue-50">
        <p className="text-lg text-center">
          {activeTab === 'week' ? (
            <>
              {new Date(currentStats.startDate).toLocaleDateString('ko-KR')} ~{' '}
              {new Date(currentStats.endDate).toLocaleDateString('ko-KR')}
            </>
          ) : (
            <>
              {currentStats.year}년 {currentStats.month}월
            </>
          )}
        </p>
      </Card>

      {/* 데이터가 없을 때 */}
      {currentStats.recordCount === 0 && (
        <Card>
          <div className="text-center py-8">
            <p className="text-xl text-gray-600">
              {activeTab === 'week' ? '이번 주' : '이번 달'} 근무 내역이 없습니다
            </p>
          </div>
        </Card>
      )}

      {/* 데이터가 있을 때 */}
      {currentStats.recordCount > 0 && (
        <>
          {/* 전체 요약 */}
          <StatsSummary
            title={activeTab === 'week' ? '주간 요약' : '월간 요약'}
            stats={currentStats}
          />

          {/* 장소별 통계 */}
          <PlaceStats placeStats={currentStats.byPlace} />

          {/* 일별 내역 (월간만) */}
          {activeTab === 'month' && monthlyStats.byDay.length > 0 && (
            <Card>
              <h2 className="text-2xl font-bold mb-4">일별 내역</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {monthlyStats.byDay.map((day) => (
                  <div
                    key={day.date}
                    className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-base font-semibold">
                      {new Date(day.date).toLocaleDateString('ko-KR', {
                        month: 'long',
                        day: 'numeric',
                        weekday: 'short',
                      })}
                    </span>
                    <div className="flex gap-4">
                      <span className="text-base text-primary-600">
                        {day.hours.toFixed(1)}h
                      </span>
                      <span className="text-base font-bold text-green-600">
                        {day.pay.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
