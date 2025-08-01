/**
 * Карта цветов для различных типов покемонов
 */
const typeColors = {
    normal: '#e8e8b9',
    fire: '#b33a0b',
    water: '#296dcc',
    electric: '#F8D030',
    grass: '#357a38',
    ice: '#98D8D8',
    fighting: '#c0392b',
    poison: '#e5f36f',
    ground: '#E0C068',
    flying: '#a1c5ea',
    psychic: '#ab47bc',
    bug: '#6b7a13',
    rock: '#857443',
    ghost: '#7c6698',
    dragon: '#4b2a8c',
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
 * Карта цветов для различных поколений покемонов
 */
const generationColors = {
    'generation-i': typeColors.normal,
    'generation-ii': typeColors.fighting,
    'generation-iii': typeColors.water,
    'generation-iv': typeColors.electric,
    'generation-v': typeColors.grass,
    'generation-vi': typeColors.ice,
    'generation-vii': typeColors.poison,
    'generation-viii': typeColors.steel,
    'generation-ix': typeColors.fairy,
};

export const getColorByGeneration = (generation) => generationColors[generation] || '#A8A878';

/**
 * Возвращает контрастный цвет текста (чёрный или белый) для заданного цвета фона
 * @param {string} bgColor - Цвет фона в формате HEX (#rrggbb), rgb(), или rgba()
 * @returns {string} Цвет текста: #222 (чёрный) или #fff (белый)
 */
export function getContrastTextColor(bgColor) {
    let r, g, b;

    if (!bgColor) return '#222';

    if (bgColor.startsWith('#')) {
        const hex = bgColor.replace('#', '');
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
    } else if (bgColor.startsWith('rgb')) {
        const rgb = bgColor.match(/\d+/g);
        r = parseInt(rgb[0], 10);
        g = parseInt(rgb[1], 10);
        b = parseInt(rgb[2], 10);
    } else {
        return '#222';
    }

    const contrastWithWhite = getContrastRatio([r, g, b], [255, 255, 255]);
    const contrastWithBlack = getContrastRatio([r, g, b], [34, 34, 34]);

    if (contrastWithWhite >= 4.5) return '#fff';
    if (contrastWithBlack >= 4.5) return '#222';

    // Если оба не проходят — выбрать тот, у которого контраст выше
    return contrastWithWhite > contrastWithBlack ? '#fff' : '#222';
}

/**
 * Вычисляет контраст между двумя цветами по WCAG
 * @param {[number, number, number]} rgb1
 * @param {[number, number, number]} rgb2
 * @returns {number}
 */
function getContrastRatio(rgb1, rgb2) {
    const luminance = ([r, g, b]) => {
        const a = [r, g, b].map(v => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
    };
    const l1 = luminance(rgb1);
    const l2 = luminance(rgb2);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/**
 * Смешивает два цвета (hex) по коэффициенту t (0...1)
 * @param {string} color1 - hex
 * @param {string} color2 - hex
 * @param {number} t - 0...1
 * @returns {string} hex
 */
function mixColors(color1, color2, t) {
    // Удаляем #
    color1 = color1.replace('#', '');
    color2 = color2.replace('#', '');
    // Парсим в RGB
    const r1 = parseInt(color1.substring(0, 2), 16);
    const g1 = parseInt(color1.substring(2, 4), 16);
    const b1 = parseInt(color1.substring(4, 6), 16);
    const r2 = parseInt(color2.substring(0, 2), 16);
    const g2 = parseInt(color2.substring(2, 4), 16);
    const b2 = parseInt(color2.substring(4, 6), 16);
    // Интерполяция
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    // Возвращаем hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Возвращает цвет фона в нужной точке градиента по типам и направлению
 * @param {Array} types - массив типов покемона
 * @param {'start'|'end'|number} position - позиция: 'start' (0%), 'end' (100%), либо число 0...1
 * @returns {string} цвет фона (hex)
 */
export function getTypeGradientColor(types, position = 'start') {
    if (!types || !types.length) return '#A8A878';
    const color1 = getColorByType(types[0]?.type?.name);
    const color2 = types[1] ? getColorByType(types[1]?.type?.name) : '#fff';

    // Для двух типов: start — первый, end — второй
    if (position === 'start' || position === 0) return color1;
    if (position === 'end' || position === 1) return color2;

    // Для промежуточных значений (например, 0.5 — середина)
    const t = typeof position === 'number' ? Math.max(0, Math.min(1, position)) : 0;
    return mixColors(color1, color2, t);
}

/**
 * Возвращает цвет текста для заданной позиции на градиенте типов
 * @param {Array} types
 * @param {'start'|'end'|number} position
 * @returns {string} цвет текста
 */
export function getContrastTextColorOnTypeGradient(types, position = 'start') {
    // Если тип один и позиция 'end', то фон белый — текст всегда чёрный
    if ((!types?.[1]) && (position === 'end' || position === 1)) {
        return '#222';
    }
    const bgColor = getTypeGradientColor(types, position);
    return getContrastTextColor(bgColor);
}

export {typeColors};
