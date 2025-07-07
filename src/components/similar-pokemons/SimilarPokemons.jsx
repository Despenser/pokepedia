import { useEffect, useState } from 'react';
import usePokemonStore from '../../store/pokemonStore.js';
import { getPokemonsByType, getPokemonByNameOrId } from '../../api/pokeApi.js';
import PokemonCard from '../pokemon-card/PokemonCard.jsx';
import PokemonCardSkeleton from '../pokemon-card-skeleton/PokemonCardSkeleton.jsx';
import './SimilarPokemons.css';

const SimilarPokemons = ({ pokemonId, types }) => {
  const [similarPokemons, setSimilarPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cache } = usePokemonStore();

  useEffect(() => {
    const fetchSimilarPokemons = async () => {
      if (!types || types.length === 0) return;

      setLoading(true);

      try {
        // Берем первый тип покемона для поиска похожих
        const mainType = types[0].type.name;

        // Проверяем кеш
        const cacheKey = `similar-${mainType}`;
        if (cache[cacheKey]) {
          const filteredCache = cache[cacheKey].filter(p => p.id !== Number(pokemonId));
          setSimilarPokemons(filteredCache.slice(0, 4));
          setLoading(false);
          return;
        }

        // Получаем покемонов того же типа
        const typeData = await getPokemonsByType(mainType);

        // Перемешиваем результаты для разнообразия
        const shuffled = [...typeData]
          .sort(() => 0.5 - Math.random())
          .slice(0, 8); // Берем больше, чтобы исключить текущего покемона

        // Получаем детальную информацию о каждом покемоне
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

        // Фильтруем null значения и исключаем текущего покемона
        const filtered = detailedPokemons
          .filter(p => p !== null && p.id !== Number(pokemonId))
          .slice(0, 4); // Ограничиваем до 4 покемонов

        setSimilarPokemons(filtered);
      } catch (error) {
        console.error('Ошибка при получении похожих покемонов:', error);
        setSimilarPokemons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarPokemons();
  }, [pokemonId, types, cache]);

  if (!types || types.length === 0) {
    return null;
  }

  return (
    <div className="similar-pokemons">
      <h3>Похожие покемоны</h3>

      <div className="similar-pokemons-grid">
        {loading ? (
          // Показываем скелетоны во время загрузки
          Array(4).fill(0).map((_, index) => (
            <PokemonCardSkeleton key={`similar-skeleton-${index}`} />
          ))
        ) : similarPokemons.length > 0 ? (
          // Показываем похожих покемонов
          similarPokemons.map(pokemon => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))
        ) : (
          // Если не нашли похожих покемонов
          <div className="no-similar-pokemons">
            <p>Похожие покемоны не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimilarPokemons;
