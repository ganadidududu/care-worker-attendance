import { useState } from 'react';

/**
 * localStorage와 React state를 동기화하는 훅
 * @param {string} key - localStorage 키
 * @param {any} initialValue - 초기값
 * @returns {[any, Function]} [storedValue, setValue]
 */
export function useLocalStorage(key, initialValue) {
  // 초기값 설정: localStorage에서 값을 읽어오거나 initialValue 사용
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // setValue: state와 localStorage 동시 업데이트
  const setValue = (value) => {
    try {
      // 함수형 업데이트 지원
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
