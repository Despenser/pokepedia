import { useState, useEffect, useCallback } from 'react';
import { getEvolutionChain } from '../api/pokeApi';
import { safeAsync } from '../utils/errorHandlingUtils';

/**
 * Хук для загрузки и обработки цепочки эволюции покемона
 * @param {Object} species - Данные о виде покемона
 * @returns {Object} Состояние загрузки и данные о цепочке эволюции
 */
export const useEvolutionChain = (species) => {
  const [evolutionChain, setEvolutionChain] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Извлечение ID цепочки эволюции из URL в данных о виде
   * @param {Object} species - Данные о виде покемона
   * @returns {string|null} ID цепочки эволюции или null
   */
  const getEvolutionChainId = useCallback((species) => {
    if (!species?.evolution_chain?.url) return null;

    try {
      // URL имеет формат https://pokeapi.co/api/v2/evolution-chain/1/
      return species.evolution_chain.url.split('/').filter(Boolean).pop();
    } catch (error) {
      console.error('Ошибка при извлечении ID цепочки эволюции:', error);
      return null;
    }
  }, []);

  /**
   * Загрузка данных о цепочке эволюции
   */
  const loadEvolutionChain = useCallback(async () => {
    if (!species) return;

    const chainId = getEvolutionChainId(species);
    if (!chainId) return;

    setIsLoading(true);
    setError(null);

    const [chainError, chainData] = await safeAsync(
      () => getEvolutionChain(chainId),
      {
        errorContext: 'загрузка цепочки эволюции',
        errorType: 'EVOLUTION_LOAD'
      }
    );

    if (chainError) {
      setError(chainError);
      setIsLoading(false);
      return;
    }

    // Проверяем, что получены полные данные о цепочке эволюции
    if (!chainData || !chainData.chain) {
      setError(new Error('Получены некорректные данные о цепочке эволюции'));
      setIsLoading(false);
      return;
    }

    // Логируем данные о цепочке эволюции для отладки
    console.log('Получены данные о цепочке эволюции:', chainData);

    setEvolutionChain(chainData);
    setIsLoading(false);
  }, [species, getEvolutionChainId]);

  // Загружаем данные при изменении вида покемона
  useEffect(() => {
    loadEvolutionChain();
  }, [loadEvolutionChain]);

  /**
   * Принудительное обновление данных
   */
  const refetch = useCallback(() => {
    loadEvolutionChain();
  }, [loadEvolutionChain]);

  return {
    evolutionChain,
    isLoading,
    error,
    refetch
  };
};