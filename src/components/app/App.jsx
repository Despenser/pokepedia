import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { useEffect } from 'react';
import HomePage from '../../pages/home-page/HomePage.jsx';
import PokemonDetailPage from '../../pages/pokemon-detail-page/PokemonDetailPage.jsx';
import NotFoundPage from '../../pages/NotFoundPage.jsx';
import useThemeStore from '../../store/themeStore.js';
import '../../index.css';


export const App = () => {
    // Инициализация темы при запуске приложения
    const { theme } = useThemeStore();

    useEffect(() => {
        // Добавляем класс для анимации перехода
        document.documentElement.classList.add('theme-transition');

        // Применяем выбранную тему
        document.documentElement.setAttribute('data-theme', theme);

        // Принудительное обновление для гарантии перерисовки с новой темой
        const forceReflow = document.body.offsetHeight;

        // Удаляем класс анимации после перехода
        const timer = setTimeout(() => {
            document.documentElement.classList.remove('theme-transition');
        }, 300);

        return () => clearTimeout(timer);
    }, [theme]);

    return (
        <ErrorBoundary {...{ fallbackRender }}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={ <HomePage/> }/>
                    <Route path="/pokemon/:id" element={ <PokemonDetailPage/> }/>
                    <Route path="*" element={ <NotFoundPage/> }/>
                </Routes>
            </BrowserRouter>
        </ErrorBoundary>
    );
};

const fallbackRender=({ error }) => (
    <div className="error-page">
        <h1>Что-то пошло не так...</h1>
        <p>{ error.message }</p>
        <button onClick={() => window.location.href = '/'}>
            Вернуться на главную
        </button>
    </div>
)