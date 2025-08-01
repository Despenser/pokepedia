import {useCallback} from 'react';
import usePokemonStore from '../store/pokemonStore';

/**
 * Хук для управления состоянием фильтров с защитой от гонки условий
 * @param {string} filterType - Тип фильтра ('type' или 'generation')
 * @returns {Object} Объект с методами для управления фильтром
 */
export const useFilterState = (filterType) => {
    const store = usePokemonStore();

    const handleFilterClick = useCallback((value) => {
        // Создаем уникальный идентификатор запроса
        const requestId = Date.now();

        // Определяем новое значение для фильтра
        const currentValue = filterType === 'type' ? store.selectedType : store.selectedGeneration;
        const newValue = currentValue === value ? null : value;

        // Показываем состояние загрузки и сохраняем идентификатор запроса
        usePokemonStore.setState({
            loading: true,
            pokemons: [],
            error: null,
            lastRequestId: requestId
        });

        // Выполняем действие с небольшой задержкой
        setTimeout(() => {
            // Проверяем, не был ли этот запрос перезаписан новым
            if (usePokemonStore.getState().lastRequestId === requestId) {
                if (filterType === 'type') {
                    store.setSelectedType(newValue);
                } else {
                    store.setSelectedGeneration(newValue);
                }
            }
        }, 50);
    }, [filterType, store]);

    const handleFilterReset = useCallback(() => {
        // Создаем уникальный идентификатор запроса
        const requestId = Date.now();

        // Сначала устанавливаем состояние загрузки и сохраняем идентификатор запроса
        usePokemonStore.setState({
            loading: true,
            pokemons: [],
            error: null,
            lastRequestId: requestId
        });

        // Выполняем действие с небольшой задержкой
        setTimeout(() => {
            // Проверяем, не был ли этот запрос перезаписан новым
            if (usePokemonStore.getState().lastRequestId === requestId) {
                if (filterType === 'type') {
                    store.setSelectedType(null);
                } else {
                    store.setSelectedGeneration(null);
                }
            }
        }, 50);
    }, [filterType, store]);

    return {
        handleFilterClick,
        handleFilterReset
    };
}; 