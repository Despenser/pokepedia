import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import usePokemonStore from '../../store/pokemonStore.js';
import PokemonCard from '../pokemon-card/PokemonCard.jsx';
import PokemonCardSkeleton from '../pokemon-card-skeleton/PokemonCardSkeleton.jsx';
import ErrorMessage from '../error-message/ErrorMessage.jsx';
import './PokemonList.css';

const PokemonList = () => {
  const { 
    pokemons, 
    loading, 
    error, 
    hasMore, 
    fetchPokemons,
    searchQuery,
    selectedType,
    selectedGeneration
  } = usePokemonStore();

  // IntersectionObserver для бесконечной загрузки
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  // Загрузка начальных данных
  useEffect(() => {
    if (pokemons.length === 0 && !searchQuery && !selectedType && !selectedGeneration && !loading) {
      console.log('Загрузка начальных данных');
      fetchPokemons();
    }
  }, [fetchPokemons, pokemons.length, searchQuery, selectedType, selectedGeneration, loading]);

  // Принудительная загрузка при сбросе поиска
  useEffect(() => {
    if (!searchQuery && pokemons.length === 0) {
      fetchPokemons();
    }
  }, [searchQuery, fetchPokemons, pokemons.length]);

  // Подгрузка при скролле
  useEffect(() => {
    if (inView && hasMore && !loading && !searchQuery && !selectedType && !selectedGeneration) {
      fetchPokemons();
    }
  }, [inView, hasMore, loading, fetchPokemons, searchQuery, selectedType, selectedGeneration]);

  if (error && pokemons.length === 0) {
    return <ErrorMessage message={error} />;
  }

  // Показываем сообщение об отсутствии покемонов только когда уже не идёт загрузка
  // и точно известно, что фильтр был применён (есть активный тип или поколение)
  if (!loading && pokemons.length === 0 && (selectedType || selectedGeneration)) {
    return <ErrorMessage message="Покемоны не найдены. Попробуйте изменить фильтры." />;
  }

  return (
    <div className="pokemon-list-container">
      <div className="pokemon-grid">
        {pokemons.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}

        {loading && Array(4).fill(0).map((_, index) => (
          <PokemonCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>

      {pokemons.length === 0 && !loading && searchQuery && (
        <div className="empty-search-result">
          <h3>Покемоны не найдены</h3>
          <p>Попробуйте изменить поисковый запрос</p>
        </div>
      )}

      {/* Наблюдатель для бесконечного скролла */}
      {hasMore && !searchQuery && !selectedType && !selectedGeneration && (
        <div ref={ref} className="scroll-trigger"></div>
      )}
    </div>
  );
};

export default PokemonList;
