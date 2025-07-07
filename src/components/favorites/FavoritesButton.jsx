import { memo } from 'react';
import { useFavorites } from '../../hooks/useFavorites';
import './FavoritesButton.css';

/**
 * Компонент кнопки добавления/удаления покемона из избранного
 * @param {Object} props - Свойства компонента
 * @param {number} props.pokemonId - ID покемона
 * @param {string} props.pokemonName - Имя покемона для доступности
 */
const FavoritesButton = memo(({ pokemonId, pokemonName }) => {
  // Используем хук для работы с избранными покемонами
  const { isFavorite, toggleFavorite } = useFavorites();

  // Проверяем, находится ли покемон в избранном
  const isCurrentPokemonFavorite = isFavorite(pokemonId);

  // Обработчик добавления/удаления из избранного
  const handleToggleFavorite = (e) => {
    // Предотвращаем всплытие события для карточки
    e.stopPropagation();
    e.preventDefault();
    toggleFavorite(pokemonId);
  };

  return (
    <button 
      onClick={handleToggleFavorite}
      className={`favorites-button ${isCurrentPokemonFavorite ? 'is-favorite' : ''}`}
      aria-label={isCurrentPokemonFavorite ? `Удалить ${pokemonName} из избранного` : `Добавить ${pokemonName} в избранное`}
      title={isCurrentPokemonFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
    >
      <svg 
        viewBox="0 0 24 24" 
        fill={isCurrentPokemonFavorite ? 'currentColor' : 'none'} 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
});

FavoritesButton.displayName = 'FavoritesButton';

export default FavoritesButton;
