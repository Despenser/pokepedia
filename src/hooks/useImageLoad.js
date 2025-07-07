import { useState, useCallback } from 'react';

/**
 * Хук для управления загрузкой изображений с поддержкой состояния загрузки и обработкой ошибок
 * @param {Object} options - Параметры хука
 * @param {Function} options.onLoad - Колбэк после успешной загрузки
 * @param {Function} options.onError - Колбэк при ошибке загрузки
 * @param {string} options.fallbackSrc - Запасной URL изображения при ошибке
 * @returns {Object} Состояние и обработчики загрузки изображения
 */
export const useImageLoad = (options = {}) => {
  const { 
    onLoad, 
    onError, 
    fallbackSrc = '' 
  } = options;

  // Состояния для отслеживания загрузки изображения
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  /**
   * Обработчик успешной загрузки изображения
   * @param {Event} event - Событие загрузки
   */
  const handleLoad = useCallback((event) => {
    setIsLoaded(true);
    setIsError(false);

    // Вызываем внешний обработчик, если предоставлен
    if (onLoad) {
      onLoad(event);
    }
  }, [onLoad]);

  /**
   * Обработчик ошибки загрузки изображения
   * @param {Event} event - Событие ошибки
   */
  const handleError = useCallback((event) => {
    setIsError(true);

    // Если предоставлен запасной URL и еще не используется, переключаемся на него
    if (fallbackSrc && !useFallback) {
      setUseFallback(true);
      event.target.src = fallbackSrc;
    } else {
      // Если запасной URL уже используется или не предоставлен, помечаем как загруженное
      // чтобы скрыть скелетон и показать хотя бы placeholder
      setIsLoaded(true);
    }

    // Вызываем внешний обработчик, если предоставлен
    if (onError) {
      onError(event);
    }
  }, [onError, fallbackSrc, useFallback]);

  /**
   * Сброс состояния загрузки (например, при смене URL)
   */
  const resetState = useCallback(() => {
    setIsLoaded(false);
    setIsError(false);
    setUseFallback(false);
  }, []);

  return {
    isLoaded,
    isError,
    useFallback,
    handleLoad,
    handleError,
    resetState
  };
};
