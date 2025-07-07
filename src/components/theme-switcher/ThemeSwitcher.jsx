import { useEffect } from 'react';
import useThemeStore from '../../store/themeStore';
import './ThemeSwitcher.css';

export const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useThemeStore();

  // Применяем тему при монтировании и при её изменении
  useEffect(() => {
    // Применяем выбранную тему
    document.documentElement.setAttribute('data-theme', theme);

    // Добавим класс для анимации перехода
    document.documentElement.classList.add('theme-transition');

    // Удалим класс после завершения анимации
    const timer = setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 300);

    return () => clearTimeout(timer);
  }, [theme]);

  return (
    <button className="theme-switcher" onClick={toggleTheme} aria-label="Переключить тему">
      {theme === 'light' ? (
        <svg className="theme-icon sun-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" fill="currentColor"/>
          <path d="M12 1V3M12 21V23M23 12H21M3 12H1M20.485 3.515L19.071 4.929M4.929 19.071L3.515 20.485M20.485 20.485L19.071 19.071M4.929 4.929L3.515 3.515" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <svg className="theme-icon moon-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  );
};


