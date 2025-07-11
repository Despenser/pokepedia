import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { useEffect } from 'react';
import { useThemeStore } from '../../store/themeStore.js';
import HomePage from '../../pages/home-page/HomePage.jsx';
import PokemonDetailPage from '../../pages/pokemon-detail-page/PokemonDetailPage.jsx';
import FavoritesPage from '../../pages/favorites-page/FavoritesPage.jsx';
import NotFoundPage from '../../pages/NotFoundPage.jsx';


const ErrorFallback = ({ error }) => (
    <div className="error-page">
        <h1>Что-то пошло не так...</h1>
        <p>{ error.message }</p>
        <button onClick={() => window.location.href = '/'}>
            Вернуться на главную
        </button>
    </div>
);


export const App = () => {
    const {theme} = useThemeStore();

    useEffect(() => {
        // Удаляем data-theme с body на всякий случай
        document.body.removeAttribute('data-theme');
        // Ставим data-theme только на <html>
        document.documentElement.classList.add('theme-transition');
        document.documentElement.setAttribute('data-theme', theme);

        const timer = setTimeout(() => {
            document.documentElement.classList.remove('theme-transition');
        }, 300);

        return () => clearTimeout(timer);
    }, [theme]);

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/pokemon/:id" element={<PokemonDetailPage/>}/>
                    <Route path="/favorites" element={<FavoritesPage/>}/>
                    <Route path="*" element={<NotFoundPage/>}/>
                </Routes>
            </BrowserRouter>
        </ErrorBoundary>
    );
};