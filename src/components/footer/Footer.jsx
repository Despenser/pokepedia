import './Footer.css';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <a href="/" className="footer-logo" title="На главную">
            <span>Poképedia</span>
          </a>
        </div>
        <div className="footer-center footer-meta">
          <span className="footer-copyright">© {currentYear} Poképedia</span>
          <span className="footer-data">Данные предоставлены{' '}
            <a href="https://pokeapi.co" target="_blank" rel="noopener noreferrer">PokeAPI</a>
          </span>
        </div>
      </div>
    </footer>
  );
};




