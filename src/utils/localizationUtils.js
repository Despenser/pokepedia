// Синхронные импорты (DEPRECATED)
import typeNamesRu from '../assets/translate/pokemon-types-ru.json';
import statNamesRu from '../assets/translate/pokemon-stats-ru.json';
import generationNamesRu from '../assets/translate/pokemon-generations-ru.json';

/**
 * Утилиты для локализации текстов в приложении
 */

// Экспортируем переводы для обратной совместимости
export {typeNamesRu, generationNamesRu};

/**
 * Получение перевода типа покемона на русский язык (DEPRECATED)
 */
export const getTypeNameRu = (type) => {
    return typeNamesRu[type] || type;
};

/**
 * Получение перевода типа покемона на русский язык (ленивая загрузка)
 */
export async function getTypeNameRuAsync(type) {
  const typeNames = (await import('../assets/translate/pokemon-types-ru.json')).default;
  return typeNames[type] || type;
}

/**
 * Получение перевода характеристики покемона на русский язык (DEPRECATED)
 */
export const getStatNameRu = (stat) => {
    return statNamesRu[stat] || stat;
};

/**
 * Получение перевода характеристики покемона на русский язык (ленивая загрузка)
 */
export async function getStatNameRuAsync(stat) {
  const statNames = (await import('../assets/translate/pokemon-stats-ru.json')).default;
  return statNames[stat] || stat;
}

/**
 * Получение перевода поколения на русский язык (DEPRECATED)
 */
export const getGenerationNameRu = (generation) => {
    return generationNamesRu[generation] || generation;
};

/**
 * Получение перевода поколения на русский язык (ленивая загрузка)
 */
export async function getGenerationNameRuAsync(generation) {
  const genNames = (await import('../assets/translate/pokemon-generations-ru.json')).default;
  return genNames[generation] || generation;
}

// Кеш для переводов (в памяти на сессию)
const translationCache = new Map();

/**
 * Замена "POKéMON" на "покемон" в тексте
 * @param {string} text - Исходный текст
 * @returns {string} Текст с заменой "POKéMON" на "покемон"
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
        translationCache.set(cacheKey, text);
        return text;
    }
};

// Ленивая загрузка русских имен покемонов
let cachedNamesRu = null;
export async function getPokemonNameRu(name) {
  if (!cachedNamesRu) {
    cachedNamesRu = (await import('../assets/translate/pokemon-names-ru.json')).default;
  }
  return cachedNamesRu[name] || undefined;
}
