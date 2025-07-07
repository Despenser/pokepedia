import { useState, useEffect } from 'react';

/**
 * Хук для работы с localStorage с поддержкой сериализации/десериализации
 * @param {string} key - Ключ для хранения в localStorage
 * @param {any} initialValue - Начальное значение, если в localStorage ничего нет
 * @returns {Array} [storedValue, setValue] - Текущее значение и функция для его изменения
 */
const useLocalStorage = (key, initialValue) => {
  // Создаем функцию для получения начального значения
  const readValue = () => {
    // Проверяем, что мы в браузере
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      // Пытаемся получить значение из localStorage
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Ошибка при чтении из localStorage ключа "${key}":`, error);
      return initialValue;
    }
  };

  // Состояние для хранения текущего значения
  const [storedValue, setStoredValue] = useState(readValue);

  // Функция для обновления значения в state и localStorage
  const setValue = (value) => {
    try {
      // Позволяем value быть функцией как у useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Сохраняем в state
      setStoredValue(valueToStore);

      // Сохраняем в localStorage (только если мы в браузере)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Ошибка при записи в localStorage ключа "${key}":`, error);
    }
  };

  // Синхронизация с другими вкладками/окнами
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === key) {
        setStoredValue(event.newValue ? JSON.parse(event.newValue) : initialValue);
      }
    };

    // Слушаем изменения в localStorage
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, [initialValue, key]);

  return [storedValue, setValue];
};

export default useLocalStorage;