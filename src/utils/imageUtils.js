/**
 * Утилита для работы с изображениями покемонов
 */

// Базовые URL для изображений
const BASE_SPRITE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
const BASE_ARTWORK_URL = `${BASE_SPRITE_URL}/other/official-artwork`;

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

/**
 * Получение резервного изображения (для случаев ошибки загрузки)
 * @param {number} pokemonId - ID покемона
 * @returns {string} URL запасного изображения
 */
export const getFallbackImage = (pokemonId) => {
  const id = validatePokemonId(pokemonId);
  return id ? `${BASE_SPRITE_URL}/${id}.png` : '';
};


