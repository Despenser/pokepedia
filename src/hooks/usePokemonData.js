import { useState, useEffect, useCallback } from 'react';
import { getPokemonByNameOrId, getPokemonSpecies, getEvolutionChain } from '../api/pokeApi';
import { safeAsync } from '../utils/errorHandlingUtils';
import usePokemonStore from '../store/pokemonStore';
import pokemonNamesRu from '../assets/translate/pokemon-names-ru.json';

/**
 * Хук для загрузки данных о покемоне и его виде
 * @param {string|number} pokemonId - ID покемона для загрузки
 * @returns {Object} Состояние загрузки и данные о покемоне
 */
export const usePokemonData = (pokemonId) => {
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Получаем функцию для обновления цепочки эволюции в глобальном хранилище
  const updateEvolutionChain = usePokemonStore(state => state.updateEvolutionChain);

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

    // Добавляем nameRu к данным покемона
    setPokemon({
      ...pokemonData,
      nameRu: pokemonNamesRu[pokemonData.name] || undefined
    });

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

      // Загружаем цепочку эволюции, если доступна ссылка
      if (speciesData && speciesData.evolution_chain && speciesData.evolution_chain.url) {
        const [evolutionError, evolutionData] = await safeAsync(
          () => getEvolutionChain(speciesData.evolution_chain.url),
          {
            errorContext: 'загрузка цепочки эволюции',
            errorType: 'EVOLUTION_LOAD'
          }
        );

        if (!evolutionError) {
          setEvolutionChain(evolutionData);
          // Обновляем цепочку эволюции в глобальном хранилище
          updateEvolutionChain(evolutionData);
        } else {
          console.error('Ошибка загрузки цепочки эволюции:', evolutionError);
        }
      }
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
    evolutionChain,
    isLoading,
    error,
    refetch
  };
};


