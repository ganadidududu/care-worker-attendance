import { useEffect } from 'react';

/**
 * 전면 모달 컴포넌트
 * 큰 닫기 버튼과 명확한 제목
 */
export default function Modal({ isOpen, onClose, title, children }) {
  // 모달이 열렸을 때 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* 모달 컨텐츠 */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-4xl leading-none w-12 h-12 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {/* 본문 */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
