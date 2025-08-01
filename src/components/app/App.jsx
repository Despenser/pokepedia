import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useEffect } from 'react';
import { useThemeStore } from '../../store/themeStore.js';
import { Loader } from '../loader/Loader.jsx';
import { Header } from '../header/Header.jsx';
import { ErrorMessage } from '../error-message/ErrorMessage.jsx';

const HomePage = lazy(() => import('../../pages/home-page/HomePage.jsx'));
const PokemonDetailPage = lazy(() => import('../../pages/pokemon-detail-page/PokemonDetailPage.jsx'));
const FavoritesPage = lazy(() => import('../../pages/favorites-page/FavoritesPage.jsx'));
const NotFoundPage = lazy(() => import('../../pages/not-found-page/NotFoundPage.jsx'));
const LegendaryPage = lazy(() => import('../../pages/legendary-page/LegendaryPage.jsx'));

const ErrorFallback = ({ error }) => (
    <ErrorMessage 
        error={error} 
        code={error?.status || '500'}
        hasBackButton={true} 
        hasReloadButton={true}
    />
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
        <BrowserRouter>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Header />
                <>
                    <Suspense fallback={<Loader />}>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
                            <Route path="/favorites" element={<FavoritesPage />} />
                            <Route path="/legendary" element={<LegendaryPage />} />
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </Suspense>
                </>
            </ErrorBoundary>
        </BrowserRouter>
    );
};