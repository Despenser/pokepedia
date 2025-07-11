import { memo, useState, useCallback, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SearchBar } from '../search-bar/SearchBar';
import { ThemeSwitcher } from '../theme-switcher/ThemeSwitcher';
import usePokemonStore from '../../store/pokemonStore.js';
import './Header.css';

export const Logo = memo(({ onClick }) => (
    <button className="logo-link" onClick={onClick} tabIndex={0} aria-label="На главную">
        <div className="logo">
            <img src="/pokeball-header.png" alt="Pokédex" className="pokeball-logo"/>
            <h1>Poképedia</h1>
        </div>
    </button>
));

// Пункт "Избранные" для бургер-меню
export const BurgerMenuContent = memo(({ onClick }) => (
    <div className="burger-menu-content" onClick={onClick}>
        <Link to="/favorites-legendary" className="favorites-link burger-menu-link" title="Легендарные покемоны">
            <span className="menu-icon menu-icon-lightning" aria-hidden="true">
                {/* Молния Material Icons */}
                <svg width="36" height="36" viewBox="0 0 24 24">
                  <path className="icon-stroke" d="M7 2v11h3v9l7-12h-4l4-8z" fill="none" stroke="transparent" stroke-width="4" stroke-linejoin="round"/>
                  <path d="M7 2v11h3v9l7-12h-4l4-8z" fill="#FFD600" stroke="none"/>
                </svg>
            </span>
            Легендарные покемоны
        </Link>
        <Link to="/favorites" className="favorites-link burger-menu-link" title="Избранные покемоны">
            <span className="menu-icon menu-icon-heart" aria-hidden="true">
                {/* Сердечко Material Icons */}
                <svg width="30" height="30" viewBox="0 0 24 24">
                  <path className="icon-stroke" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="none" stroke="transparent" stroke-width="4" stroke-linejoin="round"/>
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#d53a37" stroke="none"/>
                </svg>
            </span>
            Любимые покемоны
        </Link>
    </div>
));

export const Header = memo(() => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showSearchMobile, setShowSearchMobile] = useState(false);
    const searchPopoverRef = useRef(null);
    const searchIconRef = useRef(null);
    const resetSearch = usePokemonStore(state => state.resetSearch);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [menuOpen]);

    // Закрытие поиска по потере фокуса (onBlur)
    const handlePopoverBlur = (e) => {
        // Если фокус уходит не на лупу
        if (!searchIconRef.current || e.relatedTarget !== searchIconRef.current) {
            setShowSearchMobile(false);
        }
    };

    const handleLogoClick = useCallback(() => {
        resetSearch();
        if (location.pathname !== '/') {
            navigate('/');
        }
        setMenuOpen(false);
    }, [resetSearch, location.pathname, navigate]);

    const handleBurgerClick = useCallback(() => {
        setMenuOpen(open => !open);
    }, []);

    const handleMenuItemClick = useCallback(() => {
        setMenuOpen(false);
    }, []);

    // Мобильная лупа
    const handleSearchIconClick = useCallback(() => {
        setShowSearchMobile((prev) => !prev);
    }, []);

    return (
        <header className="header">
            <div className="header-content">
                <Logo onClick={handleLogoClick} />

                {/* SearchBar по центру только на больших экранах */}
                <div className="header-searchbar-center searchbar-desktop">
                    <SearchBar/>
                </div>

                {/* Правая панель: лупа, ThemeSwitcher, бургер */}
                <div className="header-right-block">
                    {/* Мобильная лупа */}
                    <button
                        className={`searchbar-mobile-icon${menuOpen ? ' hide-search-icon' : ''}`}
                        aria-label="Поиск"
                        onClick={handleSearchIconClick}
                        tabIndex={0}
                        ref={searchIconRef}
                    >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </button>
                    {showSearchMobile && (
                        <div
                            className="searchbar-mobile-popover"
                            ref={searchPopoverRef}
                            tabIndex={-1}
                            onBlur={handlePopoverBlur}
                        >
                            <SearchBar autoFocus/>
                        </div>
                    )}

                    {/* ThemeSwitcher всегда справа, перед бургером */}
                    <div className={`header-theme-switcher${menuOpen ? ' hide-theme-switcher' : ''}`}>
                        <ThemeSwitcher/>
                    </div>

                    {/* Morphing Burger всегда справа */}
                    <button
                        className={`burger-morph${menuOpen ? ' open' : ''}`}
                        onClick={handleBurgerClick}
                        aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
                    >
                        <span/>
                        <span/>
                        <span/>
                    </button>
                </div>
            </div>

            {/* Morphing Fullscreen Overlay */}
            <div className={`morphing-overlay${menuOpen ? ' open' : ''}`}>
                <nav className="header-controls-morphing" onClick={handleMenuItemClick}>
                    <BurgerMenuContent />
                </nav>
            </div>
        </header>
    );
});


