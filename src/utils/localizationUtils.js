/**
 * Утилиты для локализации текстов в приложении
 */

// Соответствие типов покемонов на русском языке
export const typeNamesRu = {
  normal: 'Нормальный',
  fire: 'Огненный',
  water: 'Водный',
  electric: 'Электрический',
  grass: 'Травяной',
  ice: 'Ледяной',
  fighting: 'Боевой',
  poison: 'Ядовитый',
  ground: 'Земляной',
  flying: 'Летающий',
  psychic: 'Психический',
  bug: 'Насекомый',
  rock: 'Каменный',
  ghost: 'Призрачный',
  dragon: 'Драконий',
  dark: 'Темный',
  steel: 'Стальной',
  fairy: 'Волшебный'
};

// Соответствие поколений на русском языке
export const generationNamesRu = {
  'generation-i': 'Поколение I',
  'generation-ii': 'Поколение II',
  'generation-iii': 'Поколение III',
  'generation-iv': 'Поколение IV',
  'generation-v': 'Поколение V',
  'generation-vi': 'Поколение VI',
  'generation-vii': 'Поколение VII',
  'generation-viii': 'Поколение VIII',
  'generation-ix': 'Поколение IX'
};

/**
 * Возвращает русское название типа покемона
 * @param {string} type - Название типа на английском
 * @returns {string} - Название типа на русском
 */
export const getTypeNameRu = (type) => {
  return typeNamesRu[type] || type;
};

/**
 * Возвращает русское название поколения
 * @param {string} generation - Название поколения (например, 'generation-i')
 * @returns {string} - Локализованное название поколения
 */
export const getGenerationNameRu = (generation) => {
  return generationNamesRu[generation] || generation;
};
