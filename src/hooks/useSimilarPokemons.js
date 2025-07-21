import { useState, useEffect, useMemo } from 'react';
import { getPokemonsByType, getPokemonByNameOrId } from '../api/pokeApi';
import { getPokemonNameRu } from '../utils/localizationUtils';

/**
 * Хук для загрузки похожих покемонов
 * @param {number} pokemonId - ID текущего покемона
 * @param {Array} types - Типы покемона
 * @param {Object} cache - Кеш из store
 * @param {Array<string>} [excludeNames] - Список имен для исключения из похожих
 * @returns {Object} Объект с состоянием загрузки и данными
 */
export const useSimilarPokemons = (pokemonId, types, cache, excludeNames = []) => {
  const [similarPokemons, setSimilarPokemons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarPokemons = async () => {
      if (!types || types.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const mainType = types[0].type.name;
        const cacheKey = `similar-${mainType}`;

        // Проверяем кеш
        if (cache[cacheKey]) {
          const filteredCache = cache[cacheKey].filter(p => p.id !== Number(pokemonId) && !excludeNames.includes(p.name));
          setSimilarPokemons(filteredCache.slice(0, 8));
          setLoading(false);
          return;
        }

        // Получаем покемонов того же типа
        const typeData = await getPokemonsByType(mainType);
        
        // Перемешиваем и берем первые 20 для разнообразия
        const shuffled = [...typeData]
          .sort(() => 0.5 - Math.random())
          .slice(0, 20);

        // Получаем детальную информацию
        const detailedPokemons = await Promise.all(
          shuffled.map(async ({ pokemon }) => {
            try {
              return await getPokemonByNameOrId(pokemon.name);
            } catch (error) {
              console.error(`Ошибка при загрузке данных покемона ${pokemon.name}:`, error);
              return null;
            }
          })
        );

        // Фильтруем и ограничиваем количество
        const filtered = detailedPokemons
          .filter(p => p !== null && p.id !== Number(pokemonId) && !excludeNames.includes(p.name))
          .slice(0, 8)
          .map(p => ({ ...p, nameRu: p.name })); // Initial mapping for nameRu

        setSimilarPokemons(filtered);
      } catch (error) {
        console.error('Ошибка при получении похожих покемонов:', error);
        setSimilarPokemons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarPokemons();
  }, [pokemonId, types, cache, excludeNames]);

  const [similarWithNames, setSimilarWithNames] = useState([]);
  useEffect(() => {
    (async () => {
      const arr = await Promise.all(similarPokemons.map(async (p) => ({ ...p, nameRu: await getPokemonNameRu(p.name) })));
      setSimilarWithNames(arr);
    })();
  }, [similarPokemons]);

  return useMemo(() => ({ similarPokemons, loading }), [similarPokemons, loading]);
}; 
