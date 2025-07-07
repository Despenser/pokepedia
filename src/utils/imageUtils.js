/**
 * Утилита для работы с изображениями покемонов
 */

// Базовые URL для изображений
const BASE_SPRITE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
const BASE_ARTWORK_URL = `${BASE_SPRITE_URL}/other/official-artwork`;

/**
 * Получение URL официального (большого) изображения покемона
 * @param {number} pokemonId - ID покемона
 * @returns {string} URL изображения высокого качества
 */
export const getOfficialPokemonImage = (pokemonId) => {
  if (!pokemonId) return '';
  return `${BASE_ARTWORK_URL}/${pokemonId}.png`;
};

/**
 * Получение высококачественного изображения покемона
 * @param {Object} sprites - Объект со спрайтами из API
 * @param {number} pokemonId - ID покемона
 * @returns {string} URL изображения высокого качества
 */
export const getPokemonImage = (sprites, pokemonId) => {
  if (!sprites || !pokemonId) return '';

  // Используем высококачественные изображения (official artwork)
  const officialArtwork = sprites.other?.['official-artwork']?.front_default;
  return officialArtwork || getOfficialPokemonImage(pokemonId);
};

/**
 * Получение резервного изображения (для случаев ошибки загрузки)
 * @param {number} pokemonId - ID покемона
 * @returns {string} URL запасного изображения
 */
export const getFallbackImage = (pokemonId) => {
  return `${BASE_SPRITE_URL}/${pokemonId}.png`;
};
