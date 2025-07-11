import React from 'react';
import PokemonCard from '../pokemon-card/PokemonCard';
import PokemonCardSkeleton from '../pokemon-card-skeleton/PokemonCardSkeleton';
import { ErrorMessage } from '../error-message/ErrorMessage';
import EmptyFavorites from './EmptyFavorites';

/**
 * Компонент для отображения основного контента страницы избранного
 */
const FavoritesContent = ({ favoritePokemons, isLoading, error, favoriteIds }) => {
  if (error) {
    return (
      <div className="favorites-error-container">
        <ErrorMessage error={typeof error === 'string' ? new Error(error) : error} />
      </div>
    );
  }

  if (!isLoading && favoriteIds.length === 0) {
    return <EmptyFavorites />;
  }

  return (
    <div className="pokemon-grid">
      {favoritePokemons.map(pokemon => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}

      {isLoading && favoriteIds.map((id, index) => (
        <PokemonCardSkeleton key={`skeleton-${id}-${index}`} />
      ))}
    </div>
  );
};

export default FavoritesContent; 