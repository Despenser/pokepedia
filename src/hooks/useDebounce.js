import { useState, useEffect } from 'react';

/**
 * Хук для создания debounce значения
 * Возвращает значение с задержкой для предотвращения частых обновлений
 * 
 * @param {*} value - Исходное значение
 * @param {number} delay - Задержка в миллисекундах
 * @returns {*} - Значение с debounce эффектом
 */
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Устанавливаем таймер для задержки обновления значения
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Очищаем таймер при изменении value или delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
