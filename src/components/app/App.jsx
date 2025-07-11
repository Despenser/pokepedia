import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { useEffect } from 'react';
import { useThemeStore } from '../../store/themeStore.js';
import HomePage from '../../pages/home-page/HomePage.jsx';
import PokemonDetailPage from '../../pages/pokemon-detail-page/PokemonDetailPage.jsx';
import FavoritesPage from '../../pages/favorites-page/FavoritesPage.jsx';
import NotFoundPage from '../../pages/NotFoundPage.jsx';
import { Header } from '../header/Header.jsx';
import { ErrorMessage } from '../error-message/ErrorMessage.jsx';

const ErrorFallback = ({ error }) => (
    <ErrorMessage error={error} code={error?.status || '500'} hasBackButton={true} />
);

export const App = () => {
    const {theme} = useThemeStore();

    useEffect(() => {
        document.body.removeAttribute('data-theme');
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
                <Header />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
                        <Route path="/favorites" element={<FavoritesPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </main>
            </BrowserRouter>
        </ErrorBoundary>
    );
};