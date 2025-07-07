// Цвета для различных типов покемонов
const typeColors = {
  normal: '#e8e8b9',
  fire: '#e17b32',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#79bd5a',
  ice: '#98D8D8',
  fighting: '#e1382e',
  poison: '#cc82cc',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#b4c523',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

// Получение градиента для карточки покемона на основе его типов
export const getGradientByTypes = (types) => {
  if (!types || types.length === 0) {
    return 'linear-gradient(to right, #f5f5f5, #e0e0e0)';
  }

  if (types.length === 1) {
    const color = typeColors[types[0].type.name] || '#A8A878';
    return `linear-gradient(135deg, ${color} 0%, white 100%)`;
  }

  const color1 = typeColors[types[0].type.name] || '#A8A878';
  const color2 = typeColors[types[1].type.name] || '#A8A878';

  return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
};

// Получение основного цвета для типа покемона
export const getColorByType = (typeName) => {
  return typeColors[typeName] || '#A8A878';
};

// Получение более темной версии цвета для границ и теней
export const getDarkerColor = (color, percent = 20) => {
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
