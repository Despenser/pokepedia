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

// Кеш для переводов (в памяти на сессию)
const translationCache = new Map();

/**
 * Замена POKéMON на покемон в тексте
 * @param {string} text - Исходный текст
 * @returns {string} Текст с заменой POKéMON на покемон
 */
const replacePokemon = (text) => {
  return text.replace(/POKéMON/gi, 'покемон');
};

/**
 * Перевод текста через Google Translate API (бесплатный, без ключа)
 * @param {string} text - Текст для перевода
 * @param {string} to - Язык перевода (например, 'ru')
 * @param {string} from - Исходный язык (например, 'en')
 * @returns {Promise<string>} Переведённый текст
 */
export const translateText = async (text, to = 'ru', from = 'en') => {
  if (!text) return '';
  const cacheKey = `${from}:${to}:${text}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    const translated = data[0]?.map(item => item[0]).join('') || '';
    const finalText = replacePokemon(translated);
    translationCache.set(cacheKey, finalText);
    return finalText;
  } catch (error) {
    console.error('Ошибка при переводе текста (Google Translate):', error);
    // Fallback: возвращаем оригинальный текст без изменений
    translationCache.set(cacheKey, text);
    return text;
  }
};