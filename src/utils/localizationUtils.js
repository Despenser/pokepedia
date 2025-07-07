/**
 * Утилиты для локализации текстов в приложении
 */

// Импортируем переводы из JSON файлов
import typeNamesRu from '../assets/translate/pokemon-types-ru.json';
import statNamesRu from '../assets/translate/pokemon-stats-ru.json';
import generationNamesRu from '../assets/translate/pokemon-generations-ru.json';

// Экспортируем переводы для обратной совместимости
export { typeNamesRu, generationNamesRu };

/**
 * Получение перевода типа покемона на русский язык
 * @param {string} type - Тип покемона на английском
 * @returns {string} Перевод типа на русский язык или исходный тип
 */
export const getTypeNameRu = (type) => {
  return typeNamesRu[type] || type;
};

/**
 * Получение перевода характеристики покемона на русский язык
 * @param {string} stat - Характеристика покемона на английском
 * @returns {string} Перевод характеристики на русский язык или исходная характеристика
 */
export const getStatNameRu = (stat) => {
  return statNamesRu[stat] || stat;
};

/**
 * Возвращает русское название поколения
 * @param {string} generation - Название поколения (например, 'generation-i')
 * @returns {string} - Локализованное название поколения
 */
export const getGenerationNameRu = (generation) => {
  return generationNamesRu[generation] || generation;
};