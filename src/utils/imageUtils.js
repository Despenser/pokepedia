/**
 * Утилита для работы с изображениями покемонов
 */

// Базовые URL для изображений
const BASE_SPRITE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
const BASE_ARTWORK_URL = `${BASE_SPRITE_URL}/other/official-artwork`;

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
 * Получение URL официального (большого) изображения покемона
 * @param {number} pokemonId - ID покемона
 * @returns {string} URL изображения высокого качества
 */
export const getOfficialPokemonImage = (pokemonId) => {
  const id = validatePokemonId(pokemonId);
  return id ? `${BASE_ARTWORK_URL}/${id}.png` : '';
};

/**
 * Получение высококачественного изображения покемона с учетом различных источников
 * @param {Object} sprites - Объект со спрайтами из API
 * @param {number} pokemonId - ID покемона
 * @returns {string} URL изображения высокого качества
 */
export const getPokemonImage = (sprites, pokemonId) => {
  if (!sprites) return '';

  const id = validatePokemonId(pokemonId);
  if (!id) return '';

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
  const id = validatePokemonId(pokemonId);
  return id ? `${BASE_SPRITE_URL}/${id}.png` : '';
};

/**
 * Получение URL анимированного спрайта покемона (если доступен)
 * @param {Object} sprites - Объект со спрайтами из API
 * @param {number} pokemonId - ID покемона
 * @returns {string} URL анимированного спрайта или обычного изображения
 */
export const getAnimatedSprite = (sprites, pokemonId) => {
  if (!sprites) return getFallbackImage(pokemonId);

  // Получаем анимированный спрайт или обычное изображение
  const animatedSprite = sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default;
  const defaultSprite = sprites.front_default;

  return animatedSprite || defaultSprite || getFallbackImage(pokemonId);
};
