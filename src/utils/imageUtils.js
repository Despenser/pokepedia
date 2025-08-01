/**
 * Утилита для работы с изображениями покемонов
 */

// Путь к локальным изображениям
const LOCAL_ARTWORK_WEBP = '/official-artwork';

/**
 * Валидация ID покемона
 * @param {number|string} pokemonId - ID покемона
 * @returns {number|''} Валидный ID или пустая строка
 */
const validatePokemonId = (pokemonId) => {
    if (!pokemonId) return '';
    const id = Number(pokemonId);
    return isNaN(id) ? '' : id;
};

/**
 * Получение локального пути к webp-изображению покемона
 * @param {number|string} pokemonId - ID покемона
 * @returns {string} Путь к webp-изображению
 */
export const getLocalPokemonWebp = (pokemonId) => {
    const id = validatePokemonId(pokemonId);
    return id ? `${LOCAL_ARTWORK_WEBP}/${id}.webp` : '';
};

/**
 * Получение изображения покемона (webp локально)
 * @param {number|string} pokemonId - ID покемона
 * @returns {object} src для <img>
 */
export const getLocalPokemonImage = (pokemonId) => {
    return {
        src: getLocalPokemonWebp(pokemonId)
    };
};
