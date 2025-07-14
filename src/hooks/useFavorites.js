import { useEffect, useMemo, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

/**
 * Хук для удобного управления избранными покемонами
 * @returns {Object} - Объект с методами и свойствами для работы с избранными
 */
export const useFavorites = () => {
  // Получаем список избранных из localStorage
  const [favorites, setFavorites] = useLocalStorage('pokemon-favorites', []);

  // Мемоизированный Set для быстрой проверки
  const favoritesSet = useMemo(() => new Set(favorites), [favorites]);

  // Обновляем Set при изменении массива избранных для быстрой проверки
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('favorites-updated'));
  }, [favorites]);

  /**
   * Проверяет, находится ли покемон в избранном
   * @param {number} pokemonId - ID покемона
   * @returns {boolean} - true если покемон в избранном
   */
  const isFavorite = useCallback((pokemonId) => favoritesSet.has(pokemonId), [favoritesSet]);

  /**
   * Добавляет покемона в избранное
   * @param {number} pokemonId - ID покемона
   */
  const addToFavorites = useCallback((pokemonId) => {
    if (!favoritesSet.has(pokemonId)) {
      setFavorites([...favorites, pokemonId]);
    }
  }, [favorites, favoritesSet, setFavorites]);

  /**
   * Удаляет покемона из избранного
   * @param {number} pokemonId - ID покемона
   */
  const removeFromFavorites = useCallback((pokemonId) => {
    if (favoritesSet.has(pokemonId)) {
      setFavorites(favorites.filter(id => id !== pokemonId));
    }
  }, [favorites, favoritesSet, setFavorites]);

  /**
   * Переключает состояние избранного для покемона
   * @param {number} pokemonId - ID покемона
   */
  const toggleFavorite = useCallback((pokemonId) => {
    if (favoritesSet.has(pokemonId)) {
      setFavorites(favorites.filter(id => id !== pokemonId));
    } else {
      setFavorites([...favorites, pokemonId]);
    }
  }, [favorites, favoritesSet, setFavorites]);

  return useMemo(() => ({
    favorites,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    favoritesCount: favorites.length
  }), [favorites, isFavorite, addToFavorites, removeFromFavorites, toggleFavorite]);
};
