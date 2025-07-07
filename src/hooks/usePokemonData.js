import { useState, useEffect, useCallback } from 'react';
import { getPokemonByNameOrId, getPokemonSpecies } from '../api/pokeApi';
import { safeAsync } from '../utils/errorHandlingUtils';

/**
 * Хук для загрузки данных о покемоне и его виде
 * @param {string|number} pokemonId - ID покемона для загрузки
 * @returns {Object} Состояние загрузки и данные о покемоне
 */
const usePokemonData = (pokemonId) => {
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Загрузка данных о покемоне и его виде
   */
  const loadPokemonData = useCallback(async () => {
    if (!pokemonId) return;

    setIsLoading(true);
    setError(null);

    // Загружаем основные данные о покемоне
    const [pokemonError, pokemonData] = await safeAsync(
      () => getPokemonByNameOrId(pokemonId),
      {
        errorContext: 'загрузка покемона',
        errorType: 'POKEMON_LOAD'
      }
    );

    if (pokemonError) {
      setError(pokemonError);
      setIsLoading(false);
      return;
    }

    setPokemon(pokemonData);

    // Загружаем данные о виде покемона
    const [speciesError, speciesData] = await safeAsync(
      () => getPokemonSpecies(pokemonId),
      {
        errorContext: 'загрузка вида покемона',
        errorType: 'SPECIES_LOAD'
      }
    );

    if (speciesError) {
      setError(speciesError);
    } else {
      setSpecies(speciesData);
    }

    setIsLoading(false);
  }, [pokemonId]);

  // Загружаем данные при монтировании или изменении ID
  useEffect(() => {
    loadPokemonData();
  }, [loadPokemonData]);

  /**
   * Принудительное обновление данных
   */
  const refetch = useCallback(() => {
    loadPokemonData();
  }, [loadPokemonData]);

  return {
    pokemon,
    species,
    isLoading,
    error,
    refetch
  };
};

export default usePokemonData;
