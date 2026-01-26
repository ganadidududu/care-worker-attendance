import { useState } from 'react';
import { usePlaces } from '../hooks/usePlaces';
import Button from '../components/common/Button';
import PlaceList from '../components/places/PlaceList';
import PlaceForm from '../components/places/PlaceForm';
import Modal from '../components/common/Modal';

/**
 * 장소 관리 페이지
 * 장소 목록, 추가, 수정, 삭제 기능
 */
export default function PlacesPage() {
  const { places, addPlace, updatePlace, deletePlace } = usePlaces();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);

  // 장소 저장 (추가 또는 수정)
  const handleSave = (placeData) => {
    if (editingPlace) {
      updatePlace(editingPlace.id, placeData);
    } else {
      addPlace(placeData);
    }
    setIsModalOpen(false);
    setEditingPlace(null);
  };

  // 장소 수정 시작
  const handleEdit = (place) => {
    setEditingPlace(place);
    setIsModalOpen(true);
  };

  // 장소 삭제 (확인 후)
  const handleDelete = (id) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deletePlace(id);
    }
  };

  // 새 장소 추가 시작
  const handleAddNew = () => {
    setEditingPlace(null);
    setIsModalOpen(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlace(null);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-4xl font-bold mb-6">방문 장소 관리</h1>

      <PlaceList
        places={places}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* 장소 추가 버튼 (고정 위치) */}
      <div className="fixed bottom-24 right-6">
        <Button
          variant="primary"
          onClick={handleAddNew}
          className="rounded-full w-16 h-16 flex items-center justify-center text-3xl shadow-lg hover:shadow-xl"
        >
          +
        </Button>
      </div>

      {/* 장소 추가/수정 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingPlace ? '장소 수정' : '새 장소 추가'}
      >
        <PlaceForm
          place={editingPlace}
          onSave={handleSave}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}
