import axios from 'axios';

const pokeApi = axios.create({
    baseURL: 'https://pokeapi.co/api/v2',
});

export const getGenerations = async () => {
    try {
        const response = await pokeApi.get('/generation');
        return response.data.results;
    } catch (error) {
        console.error('Ошибка при получении поколений покемонов:', error);
        throw error;
    }
};

export const getGenerationDetails = async (nameOrId) => {
    try {
        const response = await pokeApi.get(`/generation/${nameOrId}`);
        return response.data;
    } catch (error) {
        console.error(`Ошибка при получении информации о поколении ${nameOrId}:`, error);
        throw error;
    }
};

export const getPokemonList = async (limit = 20, offset = 0) => {
    try {
        const response = await pokeApi.get(`/pokemon?limit=${limit}&offset=${offset}`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении списка покемонов:', error);
        throw error;
    }
};

export const getPokemonByNameOrId = async (nameOrId) => {
    try {
        const response = await pokeApi.get(`/pokemon/${nameOrId.toString().toLowerCase()}`);
        return response.data;
    } catch (error) {
        console.error(`Ошибка при получении покемона ${nameOrId}:`, error);
        throw error;
    }
};

export const getPokemonSpecies = async (nameOrId) => {
    try {
        const response = await pokeApi.get(`/pokemon-species/${nameOrId.toString().toLowerCase()}`);
        return response.data;
    } catch (error) {
        console.error(`Ошибка при получении информации о виде покемона ${nameOrId}:`, error);
        throw error;
    }
};

export const getEvolutionChain = async (url) => {
    try {
        const id = url.split('/').filter(Boolean).pop();
        const response = await pokeApi.get(`/evolution-chain/${id}`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении цепочки эволюции:', error);
        throw error;
    }
};

export const getPokemonTypes = async () => {
    try {
        const response = await pokeApi.get('/type');
        return response.data.results;
    } catch (error) {
        console.error('Ошибка при получении типов покемонов:', error);
        throw error;
    }
};

export const getPokemonsByType = async (type) => {
    try {
        const response = await pokeApi.get(`/type/${type}`);
        return response.data.pokemon;
    } catch (error) {
        console.error(`Ошибка при получении покемонов типа ${type}:`, error);
        throw error;
    }
};