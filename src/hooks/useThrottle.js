import { useState, useEffect, useRef } from 'react';

/**
 * Хук для создания throttle значения
 * Ограничивает частоту обновления значения
 * 
 * @param {*} value - Исходное значение
 * @param {number} limit - Минимальное время между обновлениями в миллисекундах
 * @returns {*} - Значение с throttle эффектом
 */
function useThrottle(value, limit = 300) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdateRef = useRef(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateRef.current;

    if (timeSinceLastUpdate >= limit) {
      // Если прошло достаточно времени, обновляем значение немедленно
      lastUpdateRef.current = now;
      setThrottledValue(value);
    } else {
      // Иначе планируем обновление через оставшееся время
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        lastUpdateRef.current = Date.now();
        setThrottledValue(value);
      }, limit - timeSinceLastUpdate);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, limit]);

  return throttledValue;
}

export default useThrottle;
