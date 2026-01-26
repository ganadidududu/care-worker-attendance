/**
 * 카드 레이아웃 컴포넌트
 * 컨텐츠를 감싸는 깔끔한 카드 UI
 */
export default function Card({ children, className = '', onClick }) {
  return (
    <div
      className={`card ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
