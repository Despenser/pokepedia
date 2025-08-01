/**
 * Утилиты для работы с данными вида покемона
 */

/**
 * Извлекает описание покемона на указанном языке
 * @param {Object} species - Данные вида покемона
 * @param {string} language - Код языка (например, 'ru', 'en')
 * @returns {string|null} Описание или null если не найдено
 */
export const getSpeciesDescription = (species, language = 'ru') => {
    if (!species?.flavor_text_entries) return null;

    const entry = species.flavor_text_entries.find(
        (entry) => entry.language?.name === language
    );

    if (!entry) return null;

    // Очищаем текст от лишних пробелов и переносов строк
    return entry.flavor_text
        .replace(/\s+/g, ' ')
        .replace(/[\n\r\u2028\u2029]+/g, ' ')
        .trim();
};

/**
 * Извлекает русское описание покемона
 * @param {Object} species - Данные вида покемона
 * @returns {string|null} Русское описание или null
 */
export const getRussianDescription = (species) => {
    return getSpeciesDescription(species, 'ru');
};

/**
 * Извлекает английское описание покемона
 * @param {Object} species - Данные вида покемона
 * @returns {string|null} Английское описание или null
 */
export const getEnglishDescription = (species) => {
    return getSpeciesDescription(species, 'en');
};

/**
 * Проверяет, доступна ли информация о виде покемона
 * @param {Object} species - Данные вида покемона
 * @returns {boolean} true если информация доступна
 */
export const isSpeciesInfoAvailable = (species) => {
    return species !== null && species !== undefined;
}; 