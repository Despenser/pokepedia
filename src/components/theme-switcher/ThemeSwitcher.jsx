import { useEffect } from 'react';
import { memo } from 'react';
import useThemeStore from '../../store/themeStore';
import useTheme from '../../hooks/useTheme';
import './ThemeSwitcher.css';

/**
 * Компонент для переключения темы приложения
 */
const ThemeSwitcher = memo(() => {
  const { theme, toggleTheme, isTransitioning } = useTheme();

  const isDarkTheme = theme === 'dark';

  return (
    <button 
      onClick={toggleTheme}
      className={`theme-switcher ${isTransitioning ? 'transitioning' : ''}`}
      aria-label={`Переключить на ${isDarkTheme ? 'светлую' : 'темную'} тему`}
      title={`Переключить на ${isDarkTheme ? 'светлую' : 'темную'} тему`}
    >
      <div className="theme-switcher-icon">
        {isDarkTheme ? (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M12 1V3" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M12 21V23" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M4.22 4.22L5.64 5.64" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M18.36 18.36L19.78 19.78" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M1 12H3" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M21 12H23" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M4.22 19.78L5.64 18.36" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M18.36 5.64L19.78 4.22" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M21 12.79C20.8427 14.4922 20.2039 16.1144 19.1582 17.4668C18.1126 18.8192 16.7035 19.8458 15.0957 20.4265C13.4879 21.0073 11.748 21.1181 10.0795 20.7461C8.41102 20.3741 6.88299 19.5345 5.67423 18.3258C4.46546 17.117 3.62594 15.589 3.25391 13.9205C2.88188 12.252 2.99274 10.5121 3.57346 8.9043C4.15418 7.29651 5.18085 5.88737 6.53324 4.84175C7.88564 3.79614 9.50779 3.15731 11.21 3C10.2134 4.34827 9.73385 6.00945 9.85843 7.68141C9.98301 9.35338 10.7039 10.9251 11.8894 12.1106C13.0749 13.2961 14.6466 14.017 16.3186 14.1416C17.9906 14.2662 19.6517 13.7866 21 12.79Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </button>
  );
});

ThemeSwitcher.displayName = 'ThemeSwitcher';

export default ThemeSwitcher;

// Можно было бы использовать этот компонент с хуком useThemeStore,
// но мы уже реализовали его с хуком useTheme выше
// const LegacyThemeSwitcher = () => {
//   const { theme, toggleTheme } = useThemeStore();
//
//   // Применяем тему при монтировании и при её изменении
//   useEffect(() => {
//     // Применяем выбранную тему
//     document.documentElement.setAttribute('data-theme', theme);
    //
    //     // Добавим класс для анимации перехода
    //     document.documentElement.classList.add('theme-transition');
    //
    //     // Удалим класс после завершения анимации
    //     const timer = setTimeout(() => {
    //       document.documentElement.classList.remove('theme-transition');
    //     }, 300);

//     return () => clearTimeout(timer);
//   }, [theme]);
//
//   return (
//     <button className="theme-switcher" onClick={toggleTheme} aria-label="Переключить тему">
//       {theme === 'light' ? (
//         <svg className="theme-icon sun-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//           <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" fill="currentColor"/>
//           <path d="M12 1V3M12 21V23M23 12H21M3 12H1M20.485 3.515L19.071 4.929M4.929 19.071L3.515 20.485M20.485 20.485L19.071 19.071M4.929 4.929L3.515 3.515" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//         </svg>
//       ) : (
//         <svg className="theme-icon moon-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//           <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//         </svg>
//       )}
//     </button>
//   );
// };


