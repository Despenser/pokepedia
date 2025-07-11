import { useState, useEffect, useCallback, useRef } from 'react';
import { getPokemonList, getPokemonByNameOrId } from '../api/pokeApi';
import { safeAsync, logError } from '../utils/errorHandlingUtils';

/**
 * Хук для загрузки списка покемонов с поддержкой пагинации и загрузки деталей
 * @param {Object} options - Параметры запроса
 * @param {number} options.limit - Количество покемонов на странице
 * @param {number} options.initialOffset - Начальное смещение
 * @param {boolean} options.loadDetails - Загружать ли детали для каждого покемона
 * @returns {Object} Состояние и функции для работы со списком покемонов
 */
export const usePokemonList = (options = {}) => {
  const { 
    limit = 20, 
    initialOffset = 0, 
    loadDetails = true 
  } = options;

  const [pokemonList, setPokemonList] = useState([]);
  const [offset, setOffset] = useState(initialOffset);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Используем ref для хранения состояния абортирования предыдущих запросов
  const abortControllerRef = useRef(null);

  /**
   * Загрузка деталей для конкретного покемона
   * @param {Object} pokemon - Базовая информация о покемоне
   * @returns {Promise<Object>} Детальная информация о покемоне
   */
  const loadPokemonDetails = useCallback(async (pokemon) => {
    if (!pokemon?.name) return null;

    const [error, details] = await safeAsync(
      () => getPokemonByNameOrId(pokemon.name),
      { errorContext: `загрузка деталей покемона ${pokemon.name}` }
    );

    if (error) return null;
    return details;
  }, []);

  /**
   * Загрузка списка покемонов
   * @param {boolean} reset - Сбросить текущий список и начать с начала
   */
  const loadPokemonList = useCallback(async (reset = false) => {
    // Отменяем предыдущий запрос, если он в процессе
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Создаем новый контроллер для возможности отмены
    abortControllerRef.current = new AbortController();

    const currentOffset = reset ? initialOffset : offset;

    setIsLoading(true);
    setError(null);

    if (reset) {
      setPokemonList([]);
    }

    // Загружаем базовый список покемонов
    const [listError, listData] = await safeAsync(
      () => getPokemonList(limit, currentOffset),
      { errorContext: 'загрузка списка покемонов' }
    );

    if (listError) {
      setError(listError instanceof Error ? listError : new Error(listError?.message || listError));
      setIsLoading(false);
      return;
    }

    // Обновляем данные о общем количестве и наличии следующей страницы
    setTotalCount(listData.count);
    setHasMore(Boolean(listData.next));

    // Если не требуется загрузка деталей, просто обновляем список
    if (!loadDetails) {
      setPokemonList(prevList => reset ? listData.results : [...prevList, ...listData.results]);
      setIsLoading(false);
      return;
    }

    // Параллельно загружаем детали для каждого покемона в списке
    const detailsPromises = listData.results.map(pokemon => loadPokemonDetails(pokemon));
    const detailsResults = await Promise.all(detailsPromises);

    // Фильтруем null-результаты (случаи ошибок загрузки)
    const validDetails = detailsResults.filter(Boolean);

    // Обновляем список с деталями
    setPokemonList(prevList => reset ? validDetails : [...prevList, ...validDetails]);
    setIsLoading(false);
  }, [limit, offset, initialOffset, loadDetails, loadPokemonDetails]);

  // Загружаем начальный список при монтировании
  useEffect(() => {
    loadPokemonList(true);

    // Очистка при размонтировании
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadPokemonList]);

  /**
   * Загрузка следующей страницы покемонов
   */
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    setOffset(prevOffset => prevOffset + limit);
  }, [isLoading, hasMore, limit]);

  // Загружаем данные при изменении offset
  useEffect(() => {
    if (offset > initialOffset) {
      loadPokemonList(false);
    }
  }, [offset, initialOffset, loadPokemonList]);

  /**
   * Сброс списка и начало загрузки с начала
   */
  const reset = useCallback(() => {
    setOffset(initialOffset);
    loadPokemonList(true);
  }, [initialOffset, loadPokemonList]);

  return {
    pokemonList,
    isLoading,
    error,
    hasMore,
    totalCount,
    loadMore,
    reset,
    currentOffset: offset
  };
};

