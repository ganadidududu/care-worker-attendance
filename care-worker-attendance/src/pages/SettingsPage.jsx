import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { exportData, importData, clearAllData } from '../utils/storage';

/**
 * 설정 페이지
 * 데이터 백업/복원, 초기화 기능
 */
export default function SettingsPage() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [showClearModal, setShowClearModal] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 데이터 내보내기
  const handleExport = () => {
    try {
      exportData();
      setMessage({
        type: 'success',
        text: '데이터를 성공적으로 내보냈습니다',
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: '데이터 내보내기에 실패했습니다',
      });
    }
  };

  // 데이터 가져오기
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await importData(file);
      setMessage({
        type: 'success',
        text: '데이터를 성공적으로 복원했습니다',
      });
      setTimeout(() => {
        setMessage({ type: '', text: '' });
        window.location.reload(); // 페이지 새로고침하여 데이터 반영
      }, 2000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || '데이터 복원에 실패했습니다',
      });
    }

    // 파일 입력 초기화
    e.target.value = '';
  };

  // 데이터 초기화
  const handleClear = () => {
    clearAllData();
    setShowClearModal(false);
    setMessage({
      type: 'success',
      text: '모든 데이터가 삭제되었습니다',
    });
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-4xl font-bold mb-6">설정</h1>

      {/* 메시지 표시 */}
      {message.text && (
        <Card
          className={`mb-6 ${
            message.type === 'success' ? 'bg-green-50' : 'bg-red-50'
          }`}
        >
          <p
            className={`text-lg text-center font-semibold ${
              message.type === 'success' ? 'text-green-700' : 'text-red-700'
            }`}
          >
            {message.text}
          </p>
        </Card>
      )}

      {/* 데이터 관리 */}
      <Card className="mb-6">
        <h2 className="text-2xl font-bold mb-4">데이터 관리</h2>
        <p className="text-base text-gray-600 mb-4">
          중요한 데이터를 백업하고 복원할 수 있습니다
        </p>

        <div className="space-y-3">
          {/* 데이터 내보내기 */}
          <Button variant="primary" onClick={handleExport} fullWidth>
            📥 데이터 내보내기 (백업)
          </Button>

          {/* 데이터 가져오기 */}
          <Button variant="secondary" onClick={handleImportClick} fullWidth>
            📤 데이터 가져오기 (복원)
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </Card>

      {/* 앱 정보 */}
      <Card className="mb-6">
        <h2 className="text-2xl font-bold mb-4">앱 정보</h2>
        <div className="space-y-2 text-base">
          <div className="flex justify-between">
            <span className="text-gray-600">버전</span>
            <span className="font-semibold">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">제작</span>
            <span className="font-semibold">요양보호사 출퇴근 관리</span>
          </div>
        </div>
      </Card>

      {/* 위험 구역 */}
      <Card className="bg-red-50 border-2 border-red-200">
        <h2 className="text-2xl font-bold mb-4 text-red-700">위험 구역</h2>
        <p className="text-base text-red-600 mb-4">
          ⚠️ 이 작업은 되돌릴 수 없습니다
        </p>

        <Button
          variant="danger"
          onClick={() => setShowClearModal(true)}
          fullWidth
        >
          🗑️ 모든 데이터 삭제
        </Button>
      </Card>

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="정말 삭제하시겠습니까?"
      >
        <div className="space-y-4">
          <p className="text-lg text-red-600 font-semibold">
            ⚠️ 모든 장소, 스케줄, 출퇴근 기록이 영구적으로 삭제됩니다.
          </p>
          <p className="text-base text-gray-600">
            삭제하기 전에 데이터를 백업하는 것을 권장합니다.
          </p>

          <div className="flex gap-3 mt-6">
            <Button
              variant="secondary"
              onClick={() => setShowClearModal(false)}
              fullWidth
            >
              취소
            </Button>
            <Button variant="danger" onClick={handleClear} fullWidth>
              삭제
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
