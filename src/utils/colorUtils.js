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

/**
 * Возвращает затемненную версию цвета
 * @param {string} color - Исходный цвет в формате HEX
 * @param {number} percent - Процент затемнения (0-100)
 * @returns {string} Затемненный цвет в формате HEX
 */
export const getDarkerColor = (color, percent = 20) => {
  const rgb = hexToRgb(color);
  if (!rgb) return color;

  const darkerRgb = {
    r: Math.max(0, rgb.r - Math.round((rgb.r * percent) / 100)),
    g: Math.max(0, rgb.g - Math.round((rgb.g * percent) / 100)),
    b: Math.max(0, rgb.b - Math.round((rgb.b * percent) / 100)),
  };

  return `#${darkerRgb.r.toString(16).padStart(2, '0')}${darkerRgb.g
    .toString(16)
    .padStart(2, '0')}${darkerRgb.b.toString(16).padStart(2, '0')}`;
};

export { typeColors };
