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

  // Проверяем, что ID является числом
  const id = Number(pokemonId);
  if (isNaN(id)) return '';

  return `${BASE_ARTWORK_URL}/${id}.png`;
};

/**
 * Получение высококачественного изображения покемона с учетом различных источников
 * @param {Object} sprites - Объект со спрайтами из API
 * @param {number} pokemonId - ID покемона
 * @returns {string} URL изображения высокого качества
 */
export const getPokemonImage = (sprites, pokemonId) => {
  if (!sprites || !pokemonId) return '';

  // Проверяем, что ID является числом
  const id = Number(pokemonId);
  if (isNaN(id)) return '';

  // Приоритет источников изображений
  const officialArtwork = sprites.other?.['official-artwork']?.front_default;
  const dreamWorld = sprites.other?.['dream-world']?.front_default;
  const home = sprites.other?.home?.front_default;
  const defaultSprite = sprites.front_default;

  // Возвращаем первый доступный источник по приоритету
  return (
    officialArtwork || 
    dreamWorld || 
    home || 
    defaultSprite || 
    getOfficialPokemonImage(id)
  );
};

/**
 * Получение резервного изображения (для случаев ошибки загрузки)
 * @param {number} pokemonId - ID покемона
 * @returns {string} URL запасного изображения
 */
export const getFallbackImage = (pokemonId) => {
  if (!pokemonId) return '';

  // Проверяем, что ID является числом
  const id = Number(pokemonId);
  if (isNaN(id)) return '';

  return `${BASE_SPRITE_URL}/${id}.png`;
};

/**
 * Получение URL анимированного спрайта покемона (если доступен)
 * @param {Object} sprites - Объект со спрайтами из API
 * @param {number} pokemonId - ID покемона
 * @returns {string} URL анимированного спрайта или обычного изображения
 */
export const getAnimatedSprite = (sprites, pokemonId) => {
  if (!sprites) return getFallbackImage(pokemonId);

  // Проверяем наличие анимированного спрайта
  return sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default ||
         sprites.front_default ||
         getFallbackImage(pokemonId);
};
