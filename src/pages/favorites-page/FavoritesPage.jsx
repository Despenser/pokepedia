import React, { Suspense, lazy, useState } from 'react';
import { Footer } from '../../components/footer/Footer.jsx';
// import FavoritesContent from '../../components/favorites/FavoritesContent.jsx';
const FavoritesContent = lazy(() => import('../../components/favorites/FavoritesContent.jsx'));
import { useFavoritePokemons } from '../../hooks/useFavoritePokemons.js';
import './FavoritesPage.css';
import WithGlobalSearch from '../../components/search-bar/WithGlobalSearch.jsx';
import { useInView } from 'react-intersection-observer';

/**
 * Страница со списком избранных покемонов
 */
const FavoritesPage = () => {
  const { favoritePokemons, isLoading, error, favoriteIds } = useFavoritePokemons();
  const [visibleCount, setVisibleCount] = useState(16);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: false });

  React.useEffect(() => {
    if (inView && visibleCount < favoritePokemons.length) {
      setVisibleCount(count => Math.min(count + 16, favoritePokemons.length));
    }
  }, [inView, visibleCount, favoritePokemons.length]);

  const visiblePokemons = favoritePokemons.slice(0, visibleCount);

  return (
    <div className="favorites-page">
      <main className="page-main">
        <div className="container">
          <WithGlobalSearch>
            <h1 className="favorites-title">Избранные покемоны</h1>
            <Suspense fallback={null}>
              <FavoritesContent 
                favoritePokemons={visiblePokemons}
                isLoading={isLoading}
                error={error}
                favoriteIds={favoriteIds}
              />
            </Suspense>
            {visibleCount < favoritePokemons.length && (
              <div ref={ref} style={{ height: 32 }} />
            )}
          </WithGlobalSearch>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FavoritesPage;
