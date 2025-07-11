/**
 * Карта цветов для различных типов покемонов
 */
const typeColors = {
  normal: '#e8e8b9',
  fire: '#e35b31',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#79bd5a',
  ice: '#98D8D8',
  fighting: '#dd463d',
  poison: '#e5f36f',
  ground: '#E0C068',
  flying: '#a1c5ea',
  psychic: '#cc82cc',
  bug: '#a1af1f',
  rock: '#857443',
  ghost: '#7c6698',
  dragon: '#9572ed',
  dark: '#686464',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

// Цвет по умолчанию для неизвестных типов
const DEFAULT_COLOR = '#A8A878';

// Стандартный градиент для покемонов без типа
const DEFAULT_GRADIENT = 'linear-gradient(to right, #f5f5f5, #e0e0e0)';

/**
 * Возвращает градиент на основе типов покемона
 * @param {Array} types - Массив типов покемона
 * @returns {string} CSS градиент
 */
export const getGradientByTypes = (types) => {
  if (!types?.length) return DEFAULT_GRADIENT;

  if (types.length === 1) {
    const color = typeColors[types[0].type.name] || DEFAULT_COLOR;
    return `linear-gradient(135deg, ${color} 0%, white 100%)`;
  }

  const color1 = typeColors[types[0].type.name] || DEFAULT_COLOR;
  const color2 = typeColors[types[1].type.name] || DEFAULT_COLOR;

  return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
};

/**
 * Возвращает градиент на основе типов покемона с прозрачностью
 * @param {Array} types - Массив типов покемона
 * @param {number} opacity - Прозрачность (0-1)
 * @returns {string} CSS градиент с прозрачностью
 */
export const getGradientByTypesWithOpacity = (types, opacity = 0.1) => {
  if (!types?.length) return `linear-gradient(135deg, rgba(245, 245, 245, ${opacity}) 0%, rgba(224, 224, 224, ${opacity}) 100%)`;

  if (types.length === 1) {
    const color = typeColors[types[0].type.name] || DEFAULT_COLOR;
    const rgb = hexToRgb(color);
    if (rgb) {
      return `linear-gradient(135deg, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity}) 0%, rgba(255, 255, 255, ${opacity}) 100%)`;
    }
    return `linear-gradient(135deg, ${color} 0%, white 100%)`;
  }

  const color1 = typeColors[types[0].type.name] || DEFAULT_COLOR;
  const color2 = typeColors[types[1].type.name] || DEFAULT_COLOR;
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (rgb1 && rgb2) {
    return `linear-gradient(135deg, rgba(${rgb1.r}, ${rgb1.g}, ${rgb1.b}, ${opacity}) 0%, rgba(${rgb2.r}, ${rgb2.g}, ${rgb2.b}, ${opacity}) 100%)`;
  }

  return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
};

/**
 * Возвращает цвет для определенного типа покемона
 * @param {string} typeName - Название типа покемона
 * @returns {string} Цвет в формате HEX
 */
export const getColorByType = (typeName) => typeColors[typeName] || DEFAULT_COLOR;

/**
 * Преобразует HEX цвет в RGB объект
 * @param {string} hex - Цвет в формате HEX
 * @returns {Object|null} RGB объект или null при неверном формате
 */
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};



const generationColors = {
  'generation-i': '#e8e8b9',
  'generation-ii': '#e35b31',
  'generation-iii': '#6890F0',
  'generation-iv': '#e5f36f',
  'generation-v': '#79bd5a',
  'generation-vi': '#98D8D8',
  'generation-vii': '#cc82cc',
  'generation-viii': '#B8B8D0',
  'generation-ix': '#EE99AC',
};

export const getColorByGeneration = (generation) => generationColors[generation] || '#A8A878';

export { typeColors };
