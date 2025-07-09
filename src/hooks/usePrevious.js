import { useRef, useEffect } from 'react';

/**
 * Хук для сохранения предыдущего значения пропса или состояния
 * 
 * @param {*} value - Значение, предыдущую версию которого нужно отслеживать
 * @returns {*} - Предыдущее значение
 */
function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export default usePrevious;
