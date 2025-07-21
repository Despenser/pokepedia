import React, { memo } from 'react';
import { useFavorites } from '../../hooks/useFavorites';
import Button from '../shared/Button.jsx';

/**
 * Кнопка добавления/удаления покемона из избранного
 */
const FavoritesButton = memo(({ pokemonId, pokemonName }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isCurrentPokemonFavorite = isFavorite(pokemonId);

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    e.preventDefault();
    toggleFavorite(pokemonId);
  };

  return (
    <Button
      variant="icon"
      className={isCurrentPokemonFavorite ? 'is-favorite' : ''}
      aria-label={isCurrentPokemonFavorite ? `Убрать ${pokemonName} из избранного` : `Добавить ${pokemonName} в избранное`}
      onClick={handleToggleFavorite}
    >
      {/* SVG-иконка сердца, красивая, как раньше */}
      <svg viewBox="0 0 24 24" width="22" height="22" fill={isCurrentPokemonFavorite ? '#ff5a5f' : 'none'} stroke="#ff5a5f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </Button>
  );
});

export default FavoritesButton;
