import { useState, useEffect, useMemo } from 'react';
import { useFavorites } from './useFavorites';
import { getPokemonByNameOrId } from '../api/pokeApi';
import { safeAsync } from '../utils/errorHandlingUtils';
import { getPokemonNameRu } from '../utils/localizationUtils';

/**
 * Хук для загрузки данных избранных покемонов
 * @returns {Object} Объект с состоянием загрузки и данными
 */
export const useFavoritePokemons = () => {
  const { favorites: favoriteIds } = useFavorites();
  const [favoritePokemons, setFavoritePokemons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFavoritePokemons = async () => {
      // Если нет избранных покемонов, не выполняем запросы
      if (favoriteIds.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      // Создаем массив промисов для параллельной загрузки данных
      const pokemonPromises = favoriteIds.map(id => 
        safeAsync(() => getPokemonByNameOrId(id), {
          errorContext: `загрузка покемона #${id}`,
          errorType: 'POKEMON_LOAD'
        })
      );

      // Ожидаем выполнения всех запросов
      const results = await Promise.all(pokemonPromises);

      // Фильтруем и обрабатываем результаты
      const loadedPokemons = [];
      let hasErrors = false;

      results.forEach(([error, pokemon], index) => {
        if (error) {
          console.error(`Ошибка при загрузке покемона #${favoriteIds[index]}:`, error);
          hasErrors = true;
        } else if (pokemon) {
          // Добавляем русское имя
          loadedPokemons.push({
            ...pokemon,
            nameRu: undefined // будет добавлено ниже асинхронно
          });
        }
      });

      // Если возникли ошибки при загрузке, но некоторые покемоны все же загрузились,
      // мы отображаем их, но также показываем предупреждение
      if (hasErrors && loadedPokemons.length < favoriteIds.length) {
        setError({
          message: 'Не удалось загрузить некоторых покемонов. Пожалуйста, попробуйте позже.'
        });
      }

      // Сортируем покемонов по их ID
      loadedPokemons.sort((a, b) => a.id - b.id);
      setFavoritePokemons(loadedPokemons);
      setIsLoading(false);

      // Ленивая загрузка русских имен для всех покемонов
      await Promise.all(loadedPokemons.map(async (poke) => {
        poke.nameRu = await getPokemonNameRu(poke.name);
      }));
    };

    loadFavoritePokemons();
  }, [favoriteIds]);

  return useMemo(() => ({ favoritePokemons, isLoading, error, favoriteIds }), [favoritePokemons, isLoading, error, favoriteIds]);
}; 
