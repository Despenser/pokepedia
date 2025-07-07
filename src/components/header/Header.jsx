import { memo } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../search-bar/SearchBar.jsx';
import { ThemeSwitcher } from '../theme-switcher/ThemeSwitcher.jsx';
import './Header.css';

// Компонент логотипа вынесен для улучшения структуры
const Logo = memo(() => (
  <Link to="/" className="logo-link">
    <div className="logo">
      <img src="/15.png" alt="Pokédex" className="pokeball-logo" />
      <h1>Pokédex</h1>
    </div>
  </Link>
));

// Компонент элементов управления вынесен для улучшения структуры
const Controls = memo(() => (
  <div className="header-controls">
    <ThemeSwitcher />
    <SearchBar />
  </div>
));

// Основной компонент шапки
const Header = memo(() => {
  return (
    <header className="header">
      <div className="header-content">
        <Logo />
        <Controls />
      </div>
    </header>
  );
});

export default Header;
