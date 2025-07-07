import { memo } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../search-bar/SearchBar.jsx';
import ThemeSwitcher from '../theme-switcher/ThemeSwitcher.jsx';
import './Header.css';

// Компонент логотипа вынесен для улучшения структуры
export const Logo = memo(() => (
  <Link to="/" className="logo-link">
    <div className="logo">
      <img src="/15.png" alt="Pokédex" className="pokeball-logo" />
      <h1>Pokédex</h1>
    </div>
  </Link>
));

// Компонент элементов управления вынесен для улучшения структуры
export const Controls = memo(() => (
  <div className="header-controls">
    <Link to="/favorites" className="favorites-link" title="Избранные покемоны">
      <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width="24" height="24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </Link>
    <ThemeSwitcher />
    <SearchBar />
  </div>
));

// Основной компонент шапки
export const Header = memo(() => {
  return (
    <header className="header">
      <div className="header-content">
        <Logo />
        <Controls />
      </div>
    </header>
  );
});


