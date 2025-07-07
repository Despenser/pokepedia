import { memo, useMemo } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import './FavoritesButton.css';

/**
 * Компонент кнопки добавления/удаления покемона из избранного
 * @param {Object} props - Свойства компонента
 * @param {number} props.pokemonId - ID покемона
 * @param {string} props.pokemonName - Имя покемона для доступности
 */
const FavoritesButton = memo(({ pokemonId, pokemonName }) => {
  // Используем хук для хранения списка избранных покемонов в localStorage
  const [favorites, setFavorites] = useLocalStorage('pokemon-favorites', []);

  // Проверяем, находится ли покемон в избранном
  const isFavorite = useMemo(() => {
    return favorites.includes(pokemonId);
  }, [favorites, pokemonId]);

  // Обработчик добавления/удаления из избранного
  const toggleFavorite = () => {
    if (isFavorite) {
      // Удаляем из избранного
      setFavorites(favorites.filter(id => id !== pokemonId));
    } else {
      // Добавляем в избранное
      setFavorites([...favorites, pokemonId]);
    }
  };

  return (
    <button 
      onClick={toggleFavorite}
      className={`favorites-button ${isFavorite ? 'is-favorite' : ''}`}
      aria-label={isFavorite ? `Удалить ${pokemonName} из избранного` : `Добавить ${pokemonName} в избранное`}
      title={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
    >
      <svg 
        viewBox="0 0 24 24" 
        fill={isFavorite ? 'currentColor' : 'none'} 
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
