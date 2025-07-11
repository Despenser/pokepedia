import React from 'react';
import { Footer } from '../../components/footer/Footer.jsx';
import FavoritesContent from '../../components/favorites/FavoritesContent.jsx';
import { useFavoritePokemons } from '../../hooks/useFavoritePokemons.js';
import './FavoritesPage.css';

/**
 * Страница со списком избранных покемонов
 */
const FavoritesPage = () => {
  const { favoritePokemons, isLoading, error, favoriteIds } = useFavoritePokemons();

  return (
    <div className="favorites-page">
      <main className="main-content">
        <div className="container">
          <h1 className="favorites-title">Избранные покемоны</h1>
          <FavoritesContent 
            favoritePokemons={favoritePokemons}
            isLoading={isLoading}
            error={error}
            favoriteIds={favoriteIds}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FavoritesPage;



