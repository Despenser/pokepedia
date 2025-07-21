import React, { useEffect, useCallback, useMemo } from 'react';
import usePokemonStore from '../../store/pokemonStore.js';
import PokemonCard from '../pokemon-card/PokemonCard.jsx';
import PokemonCardSkeleton from '../pokemon-card-skeleton/PokemonCardSkeleton.jsx';
import { useFavorites } from '../../hooks/useFavorites.js';
import { ErrorMessage } from '../error-message/ErrorMessage.jsx';
import usePrevious from '../../hooks/usePrevious.js';
import { useInView } from 'react-intersection-observer';
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

  const { favorites: _favorites } = useFavorites();
  const prevSearchQuery = usePrevious(searchQuery);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: false });

  // Загрузка начальных данных
  useEffect(() => {
    if (pokemons.length === 0 && !searchQuery && !selectedType && !selectedGeneration && !loading) {
      fetchPokemons();
    }
  }, [pokemons.length, searchQuery, selectedType, selectedGeneration, loading, fetchPokemons]);

  // Принудительная загрузка при сбросе поиска
  useEffect(() => {
    if (prevSearchQuery && !searchQuery && pokemons.length === 0 && !loading) {
      fetchPokemons();
    }
  }, [searchQuery, pokemons.length, loading, prevSearchQuery, fetchPokemons]);

  // Подгрузка при скролле
  useEffect(() => {
    if (inView && hasMore && !loading && !searchQuery && !selectedType && !selectedGeneration) {
      fetchPokemons();
    }
  }, [inView, hasMore, loading, searchQuery, selectedType, selectedGeneration, fetchPokemons]);

  if (error && pokemons.length === 0) {
    return <ErrorMessage error={typeof error === 'string' ? new Error(error) : error} />;
  }

  if (!loading && pokemons.length === 0 && (selectedType || selectedGeneration)) {
    return <ErrorMessage message="Покемоны не найдены. Попробуйте изменить фильтры." />;
  }

  return (
    <div className="pokemon-grid">
      {pokemons.map((pokemon) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} className="pokemon-list-card" />
      ))}
      {loading && Array(6).fill(0).map((_, index) => (
        <PokemonCardSkeleton key={`skeleton-${index}`} />
      ))}
      {hasMore && !searchQuery && !selectedType && !selectedGeneration && (
        <div ref={ref} className="scroll-trigger"></div>
      )}
      {pokemons.length === 0 && !loading && searchQuery && (
        <ErrorMessage 
          hasBackButton={false}
          title="Покемон не найден"
          message="По вашему запросу не найден ни один покемон. Попробуйте изменить поисковый запрос."
        />
      )}
    </div>
  );
};

export default PokemonList;