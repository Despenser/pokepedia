import { useState, useEffect, useCallback } from 'react';

// Константы для работы с темой
const THEME_KEY = 'pokemon-app-theme';
const LIGHT_THEME = 'light';
const DARK_THEME = 'dark';

/**
 * Хук для управления темой приложения с поддержкой локального хранилища и системных предпочтений
 * @returns {Object} Состояние и функции для управления темой
 */
export const useTheme = () => {
  // Определение начального значения темы из localStorage или системных предпочтений
  const getInitialTheme = () => {
    // Проверяем localStorage
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) return savedTheme;

    // Проверяем системные предпочтения
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return DARK_THEME;
    }

    // По умолчанию используем светлую тему
    return LIGHT_THEME;
  };

  const [theme, setTheme] = useState(getInitialTheme);
  const [isTransitioning, setIsTransitioning] = useState(false);

  /**
   * Применение темы к документу
   * @param {string} newTheme - Тема для применения ('light' или 'dark')
   */
  const applyTheme = useCallback((newTheme) => {
    document.documentElement.setAttribute('data-theme', newTheme);
  }, []);

  /**
   * Переключение между темной и светлой темой
   */
  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
      localStorage.setItem(THEME_KEY, newTheme);
      return newTheme;
    });
  }, []);

  /**
   * Установка конкретной темы
   * @param {string} newTheme - Тема для установки ('light' или 'dark')
   */
  const setThemeExplicitly = useCallback((newTheme) => {
    if (newTheme !== LIGHT_THEME && newTheme !== DARK_THEME) return;

    setTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
  }, []);

  // Применяем тему при изменении и добавляем плавный переход
  useEffect(() => {
    const handleTransition = () => {
      // Добавляем класс для плавного перехода
      document.documentElement.classList.add('theme-transition');
      setIsTransitioning(true);

      // Применяем тему
      applyTheme(theme);

      // Удаляем класс после завершения перехода
      const transitionTimeout = setTimeout(() => {
        document.documentElement.classList.remove('theme-transition');
        setIsTransitioning(false);
      }, 300); // Длительность перехода в ms

      return () => clearTimeout(transitionTimeout);
    };

    return handleTransition();
  }, [theme, applyTheme]);

  // Следим за системными изменениями темы
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => {
      // Обновляем тему, только если пользователь не выбрал ее явно
      if (!localStorage.getItem(THEME_KEY)) {
        setTheme(e.matches ? DARK_THEME : LIGHT_THEME);
      }
    };

    // Добавляем слушатель изменений в системных настройках
    mediaQuery.addEventListener('change', handleChange);

    // Удаляем слушатель при размонтировании
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Синхронизация темы с localStorage (best practice)
  useEffect(() => {
    // При монтировании проверяем актуальное значение из localStorage
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme && savedTheme !== theme) {
      setTheme(savedTheme);
    }
    // Слушаем изменения localStorage в других вкладках
    const handleStorage = (event) => {
      if (event.key === THEME_KEY && event.newValue && event.newValue !== theme) {
        setTheme(event.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [theme]);

  return {
    theme,
    isLightTheme: theme === LIGHT_THEME,
    isDarkTheme: theme === DARK_THEME,
    toggleTheme,
    setTheme: setThemeExplicitly,
    isTransitioning
  };
};