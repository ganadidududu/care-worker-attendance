/**
 * 데이터 백업/복원 유틸리티
 */

/**
 * 전체 데이터를 JSON 파일로 내보내기
 */
export function exportData() {
  const data = {
    places: localStorage.getItem('care_places'),
    schedules: localStorage.getItem('care_schedules'),
    attendance: localStorage.getItem('care_attendance'),
    exportDate: new Date().toISOString(),
    version: '1.0',
  };

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `출퇴근기록_백업_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * JSON 파일에서 데이터 가져오기
 * @param {File} file - JSON 파일
 * @returns {Promise} 성공 또는 실패
 */
export function importData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        // 데이터 검증
        if (!data.places || !data.schedules || !data.attendance) {
          throw new Error('잘못된 백업 파일입니다');
        }

        // localStorage에 저장
        if (data.places) localStorage.setItem('care_places', data.places);
        if (data.schedules) localStorage.setItem('care_schedules', data.schedules);
        if (data.attendance) localStorage.setItem('care_attendance', data.attendance);

        resolve({
          success: true,
          message: '데이터를 성공적으로 복원했습니다',
          exportDate: data.exportDate,
        });
      } catch (error) {
        reject({
          success: false,
          message: error.message || '파일을 읽을 수 없습니다',
        });
      }
    };

    reader.onerror = () => {
      reject({
        success: false,
        message: '파일을 읽는 중 오류가 발생했습니다',
      });
    };

    reader.readAsText(file);
  });
}

/**
 * 모든 데이터 삭제 (초기화)
 */
export function clearAllData() {
  localStorage.removeItem('care_places');
  localStorage.removeItem('care_schedules');
  localStorage.removeItem('care_attendance');
}
