import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { getPokemonByNameOrId, getPokemonSpecies, getEvolutionChain } from '../api/pokeApi';
import { safeAsync, logError } from '../utils/errorHandlingUtils';
import usePokemonStore from '../store/pokemonStore';
import { getPokemonNameRu } from '../utils/localizationUtils';

// Новый облегчённый экспорт по умолчанию для карточек
const cache = new Map();
export default function usePokemonDataLight(idOrName) {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(!!idOrName);
  const [error, setError] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (!idOrName) {
      setPokemon(null);
      setLoading(false);
      setError(null);
      return;
    }
    if (cache.has(idOrName)) {
      setPokemon(cache.get(idOrName));
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    getPokemonByNameOrId(idOrName)
      .then(data => {
        if (mounted.current) {
          cache.set(idOrName, data);
          setPokemon(data);
          setLoading(false);
        }
      })
      .catch(e => {
        if (mounted.current) {
          setError(e);
          setLoading(false);
        }
      });
    return () => { mounted.current = false; };
  }, [idOrName]);

  return { pokemon, loading, error };
}

// Старый именованный экспорт для страниц с деталями и эволюцией
export const usePokemonData = (pokemonId) => {
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const updateEvolutionChain = usePokemonStore(state => state.updateEvolutionChain);

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
      setError(pokemonError instanceof Error ? pokemonError : new Error(pokemonError?.message || pokemonError));
      setIsLoading(false);
      return;
    }
    const nameRu = await getPokemonNameRu(pokemonData.name);
    setPokemon({
      ...pokemonData,
      nameRu
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
      setError(speciesError instanceof Error ? speciesError : new Error(speciesError?.message || speciesError));
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
          updateEvolutionChain(evolutionData);
        } else {
          logError(evolutionError, 'Ошибка загрузки цепочки эволюции');
        }
      }
    }
    setIsLoading(false);
  }, [pokemonId, updateEvolutionChain]);

  useEffect(() => {
    loadPokemonData();
  }, [loadPokemonData]);

  const refetch = useCallback(() => {
    loadPokemonData();
  }, [loadPokemonData]);

  return useMemo(() => ({
    pokemon,
    species,
    evolutionChain,
    isLoading,
    error,
    refetch
  }), [pokemon, species, evolutionChain, isLoading, error, refetch]);
};


