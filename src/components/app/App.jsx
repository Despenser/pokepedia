import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { useEffect } from 'react';
import HomePage from '../../pages/home-page/HomePage.jsx';
import PokemonDetailPage from '../../pages/pokemon-detail-page/PokemonDetailPage.jsx';
import NotFoundPage from '../../pages/NotFoundPage.jsx';
import useThemeStore from '../../store/themeStore.js';

const ErrorFallback = ({ error }) => (
  <div className="error-page">
    <h1>Что-то пошло не так...</h1>
    <p>{error.message}</p>
    <button onClick={() => window.location.href = '/'}>
      Вернуться на главную
    </button>
  </div>
);

export const App = () => {
  const { theme } = useThemeStore();

  useEffect(() => {
    // Добавляем класс для анимации перехода
    document.documentElement.classList.add('theme-transition');
    // Применяем выбранную тему
    document.documentElement.setAttribute('data-theme', theme);

    // Удаляем класс анимации после завершения перехода
    const timer = setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 300);

    return () => clearTimeout(timer);
  }, [theme]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};