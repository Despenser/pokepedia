import { useEffect, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';

/**
 * Хук для удобного управления избранными покемонами
 * @returns {Object} - Объект с методами и свойствами для работы с избранными
 */
export const useFavorites = () => {
  // Получаем список избранных из localStorage
  const [favorites, setFavorites] = useLocalStorage('pokemon-favorites', []);
  // Состояние для оптимизации рендеринга при проверке на наличие в избранном
  const [favoritesSet, setFavoritesSet] = useState(new Set());

  // Обновляем Set при изменении массива избранных для быстрой проверки
  useEffect(() => {
    setFavoritesSet(new Set(favorites));
    // Инициируем событие для возможного обновления компонентов
    window.dispatchEvent(new CustomEvent('favorites-updated'));
  }, [favorites]);

  /**
   * Проверяет, находится ли покемон в избранном
   * @param {number} pokemonId - ID покемона
   * @returns {boolean} - true если покемон в избранном
   */
  const isFavorite = (pokemonId) => {
    return favoritesSet.has(pokemonId);
  };

  /**
   * Добавляет покемона в избранное
   * @param {number} pokemonId - ID покемона
   */
  const addToFavorites = (pokemonId) => {
    if (!isFavorite(pokemonId)) {
      const newFavorites = [...favorites, pokemonId];
      setFavorites(newFavorites);
    }
  };

  /**
   * Удаляет покемона из избранного
   * @param {number} pokemonId - ID покемона
   */
  const removeFromFavorites = (pokemonId) => {
    if (isFavorite(pokemonId)) {
      const newFavorites = favorites.filter(id => id !== pokemonId);
      setFavorites(newFavorites);
    }
  };

  /**
   * Переключает состояние избранного для покемона
   * @param {number} pokemonId - ID покемона
   */
  const toggleFavorite = (pokemonId) => {
    if (isFavorite(pokemonId)) {
      removeFromFavorites(pokemonId);
    } else {
      addToFavorites(pokemonId);
    }
  };

  return {
    favorites,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    favoritesCount: favorites.length
  };
};
