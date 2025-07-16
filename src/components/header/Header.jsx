import React from 'react';
import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SearchBar } from '../search-bar/SearchBar';
import { ThemeSwitcher } from '../theme-switcher/ThemeSwitcher';
import usePokemonStore from '../../store/pokemonStore.js';
import './Header.css';
import { useTheme } from '../../hooks/useTheme';
import { Helmet } from 'react-helmet';

export const Logo = memo(({ onClick }) => (
    <button className="logo-link" onClick={onClick} tabIndex={0} aria-label="На главную">
        <div className="logo">
            <picture>
              <source srcSet="/pokeball/pokeball-header.webp" type="image/webp" />
              <img src="/pokeball/pokeball-header.png" alt="Pokédex" className="pokeball-logo" loading="lazy"/>
            </picture>
            <h1>Poképedia</h1>
        </div>
    </button>
));

const prefetchFavorites = () => import('../../pages/favorites-page/FavoritesPage.jsx');
const prefetchLegendary = () => import('../../pages/LegendaryPage.jsx');

// Пункт "Избранные" для бургер-меню
export const BurgerMenuContent = memo(({ onClick }) => (
    <div className="burger-menu-content" onClick={onClick}>
        <Link
            to="/legendary"
            className="favorites-link burger-menu-link"
            title="Легендарные покемоны"
            onMouseEnter={prefetchLegendary}
            onFocus={prefetchLegendary}
            onTouchStart={prefetchLegendary}
        >
            <span className="menu-icon menu-icon-lightning" aria-hidden="true">
                <svg width="36" height="36" viewBox="0 0 24 24">
                  <path className="icon-stroke" d="M7 2v11h3v9l7-12h-4l4-8z" fill="none" stroke="transparent" strokeWidth="4" strokeLinejoin="round"/>
                  <path d="M7 2v11h3v9l7-12h-4l4-8z" fill="#FFD600" stroke="none"/>
                </svg>
            </span>
            Легендарные покемоны
        </Link>
        <Link
            to="/favorites"
            className="favorites-link burger-menu-link"
            title="Избранные покемоны"
            onMouseEnter={prefetchFavorites}
            onFocus={prefetchFavorites}
            onTouchStart={prefetchFavorites}
        >
            <span className="menu-icon menu-icon-heart" aria-hidden="true">
                <svg width="30" height="30" viewBox="0 0 24 24">
                  <path className="icon-stroke" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="none" stroke="transparent" strokeWidth="4" strokeLinejoin="round"/>
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#d53a37" stroke="none"/>
                </svg>
            </span>
            Избранные покемоны
        </Link>
    </div>
));

export const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showSearchMobile, setShowSearchMobile] = useState(false);
    const searchPopoverRef = useRef(null);
    const searchIconRef = useRef(null);
    const resetSearch = usePokemonStore(state => state.resetSearch);
    const location = useLocation();
    const navigate = useNavigate();
    const { theme, toggleTheme, isTransitioning } = useTheme();
    const isDarkTheme = theme === 'dark';
    const isDetailPage = /^\/pokemon\/[\w-]+$/.test(location.pathname);

    useEffect(() => {
        resetSearch();
        setShowSearchMobile(false);
    }, [location.pathname, resetSearch]);

    const handleLogoClick = useCallback(() => {
        resetSearch();
        if (location.pathname !== '/') {
            navigate('/');
        }
        setMenuOpen(false);
    }, [resetSearch, location.pathname, navigate]);

    const handleBurgerClick = useCallback(() => {
        setMenuOpen(open => {
            const willOpen = !open;
            if (willOpen) setShowSearchMobile(false);
            return willOpen;
        });
    }, []);

    const handleMenuItemClick = useCallback(() => {
        setMenuOpen(false);
    }, []);

    // Мобильная лупа
    const handleSearchIconClick = useCallback(() => {
        setShowSearchMobile(prev => !prev);
        setMenuOpen(false);
    }, []);

    return (
        <header className="header">
            <Helmet>
                <link rel="canonical" href="/" />
            </Helmet>
            <div className="header-content">
                <Logo onClick={handleLogoClick} />
                <div className="header-searchbar-center searchbar-desktop">
                    <SearchBar/>
                </div>
                <div className="header-right-block">
                    <button className="header-icon-btn search-animate" aria-label="Поиск" onClick={handleSearchIconClick} ref={searchIconRef}>
                        <svg viewBox="0 0 24 24" fill="none">
                            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                    </button>
                    <button className={`header-icon-btn theme-animate${isTransitioning ? ' switching' : ''}`} aria-label="Сменить тему" onClick={toggleTheme}>
                        {isDarkTheme ? (
                            <svg viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
                                <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M21 12.79C20.84 14.49 20.2 16.11 19.16 17.47C18.11 18.82 16.7 19.85 15.1 20.43C13.49 21.01 11.75 21.12 10.08 20.75C8.41 20.37 6.88 19.53 5.67 18.33C4.47 17.12 3.63 15.59 3.25 13.92C2.88 12.25 2.99 10.51 3.57 8.9C4.15 7.3 5.18 5.89 6.53 4.84C7.89 3.8 9.51 3.16 11.21 3C10.21 4.35 9.73 6.01 9.86 7.68C9.98 9.35 10.7 10.93 11.89 12.11C13.07 13.3 14.65 14.02 16.32 14.14C17.99 14.27 19.65 13.79 21 12.79Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        )}
                    </button>
                    <button className={`header-icon-btn burger-animate${menuOpen ? ' open burger-float' : ''}`} aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} onClick={handleBurgerClick}>
                        <svg viewBox="0 0 24 24" fill="none">
                            <rect className="burger-bar bar1" x="6" y="6" width="12" height="2" rx="1" />
                            <rect className="burger-bar bar2" x="6" y="12" width="12" height="2" rx="1" />
                            <rect className="burger-bar bar3" x="6" y="18" width="12" height="2" rx="1" />
                        </svg>
                    </button>
                </div>
            </div>
            {/* Popover поиска для мобильных */}
            {showSearchMobile && (
                <div className="searchbar-mobile-popover-static popover-visible" ref={searchPopoverRef}>
                    <SearchBar autoFocus/>
                </div>
            )}
            {/* Morphing Fullscreen Overlay */}
            <div className={`morphing-overlay${menuOpen ? ' open' : ''}`}>
                <nav className="header-controls-morphing" onClick={handleMenuItemClick}>
                    <BurgerMenuContent />
                </nav>
            </div>
        </header>
    );
};


