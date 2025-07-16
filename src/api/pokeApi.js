import axios from 'axios';
import { logError } from '../utils/errorHandlingUtils';

/**
 * Создаем инстанс axios с базовыми настройками
 */
export const pokeApi = axios.create({
    baseURL: 'https://pokeapi.co/api/v2',
    timeout: 10000, // 10 секунд тайм-аут
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Получение списка поколений покемонов
 * @returns {Promise<Array>} Список поколений
 */
export const getGenerations = async () => {
    try {
        const response = await pokeApi.get('/generation');
        return response.data.results;
    } catch (error) {
        logError(error, 'получение поколений покемонов');
        throw error;
    }
};

/**
 * Получение детальной информации о поколении покемонов
 * @param {string|number} nameOrId - Имя или ID поколения
 * @returns {Promise<Object>} Детальная информация о поколении
 */
export const getGenerationDetails = async (nameOrId) => {
    if (!nameOrId) throw new Error('Имя или ID поколения не указаны');
    try {
        const response = await pokeApi.get(`/generation/${nameOrId.toString().toLowerCase()}`);
        return response.data;
    } catch (error) {
        logError(error, `получение информации о поколении ${nameOrId}`);
        throw error;
    }
};

/**
 * Получение списка покемонов с пагинацией
 * @param {number} limit - Количество покемонов на странице
 * @param {number} offset - Смещение для пагинации
 * @returns {Promise<Object>} Список покемонов с метаданными
 */
export const getPokemonList = async (limit = 20, offset = 0) => {
    try {
        const response = await pokeApi.get('/pokemon', {params: {limit, offset}});
        return response.data;

    } catch (error) {
        logError(error, 'получение списка покемонов');
        throw error;
    }
};

/**
 * Получение данных о конкретном покемоне по имени или ID
 * @param {string|number} nameOrId - Имя или ID покемона
 * @returns {Promise<Object>} Данные о покемоне
 */
export const getPokemonByNameOrId = async (nameOrId) => {
    if (!nameOrId) throw new Error('Имя или ID покемона не указаны');
    try {
        const response = await pokeApi.get(`/pokemon/${nameOrId.toString().toLowerCase()}`);
        return response.data;

    } catch (error) {
        logError(error, `получение покемона ${nameOrId}`);
        throw error;
    }
};

/**
 * Получение информации о виде покемона
 * @param {string|number} nameOrId - Имя или ID покемона
 * @returns {Promise<Object>} Информация о виде покемона
 */
export const getPokemonSpecies = async (nameOrId) => {
    if (!nameOrId) throw new Error('Имя или ID покемона не указаны');
    try {
        const response = await pokeApi.get(`/pokemon-species/${nameOrId.toString().toLowerCase()}`);
        return response.data;

    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        logError(error, `получение информации о виде покемона ${nameOrId}`);
        throw error;
    }
};

/**
 * Получение данных о цепочке эволюции покемона
 * @param {string|number} idOrUrl - ID или полный URL цепочки эволюции
 * @returns {Promise<Object>} Данные о цепочке эволюции
 */
export const getEvolutionChain = async (idOrUrl) => {
    if (!idOrUrl) throw new Error('ID или URL цепочки эволюции не указаны');
    try {
        // Определяем, является ли параметр URL-ом или ID
        let id;
        if (typeof idOrUrl === 'string' && idOrUrl.includes('/')) {
            id = idOrUrl.split('/').filter(Boolean).pop();
        } else {
            id = idOrUrl;
        }

        const response = await pokeApi.get(`/evolution-chain/${id}`);
        return response.data;

    } catch (error) {
        logError(error, 'получение цепочки эволюции');
        throw error;
    }
};

/**
 * Получение списка всех типов покемонов
 * @returns {Promise<Array>} Список типов покемонов
 */
export const getPokemonTypes = async () => {
    try {
        const response = await pokeApi.get('/type');
        return response.data.results;

    } catch (error) {
        logError(error, 'получение типов покемонов');
        throw error;
    }
};

/**
 * Получение списка покемонов определенного типа
 * @param {string|number} type - Имя или ID типа покемона
 * @returns {Promise<Array>} Список покемонов данного типа
 */
export const getPokemonsByType = async (type) => {
    if (!type) throw new Error('Тип покемона не указан');

    try {
        const response = await pokeApi.get(`/type/${type.toString().toLowerCase()}`);
        return response.data.pokemon;

    } catch (error) {
        logError(error, `получение покемонов типа ${type}`);
        throw error;
    }
};