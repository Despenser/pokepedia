/**
 * Форматирование ID покемона для отображения в виде #001
 * @param {number|string} id - ID покемона
 * @returns {string} Отформатированный ID с ведущими нулями
 */
export const formatPokemonId = (id) => {
  if (id === undefined || id === null) return '#000';
  try {
    return `#${String(id).padStart(3, '0')}`;
  } catch (error) {
    console.error('Error formatting Pokemon ID:', error);
    return '#000';
  }
};

/**
 * Форматирование имени покемона с заглавной буквы
 * @param {string} name - Имя покемона на английском
 * @param {string} nameRu - Имя покемона на русском (опционально)
 * @returns {string} Отформатированное имя покемона
 */
export const formatPokemonName = (name, nameRu) => {
  if (!name && !nameRu) return 'Неизвестный покемон';

  // Используем русское имя, если оно доступно
  if (nameRu) return nameRu;

  // Если русского имени нет, форматируем английское имя
  try {
    return name
      .charAt(0).toUpperCase() + 
      name.slice(1).replace(/-/g, ' ');
  } catch (error) {
    console.error('Error formatting Pokemon name:', error);
    return String(name);
  }
};

/**
 * Преобразование высоты из дециметров в метры
 * @param {number} height - Высота в дециметрах
 * @returns {string} Отформатированная высота в метрах
 */
export const formatHeight = (height) => {
  if (height === undefined || height === null) return 'Н/Д';

  try {
    const meters = Number(height) / 10;
    return `${meters.toFixed(1)} м`;
  } catch (error) {
    console.error('Error formatting Pokemon height:', error);
    return 'Н/Д';
  }
};

/**
 * Преобразование веса из гектограммов в килограммы
 * @param {number} weight - Вес в гектограммах
 * @returns {string} Отформатированный вес в килограммах
 */
export const formatWeight = (weight) => {
  if (weight === undefined || weight === null) return 'Н/Д';

  try {
    const kg = Number(weight) / 10;
    return `${kg.toFixed(1)} кг`;
  } catch (error) {
    console.error('Error formatting Pokemon weight:', error);
    return 'Н/Д';
  }
};

/**
 * Получение описания покемона из species данных с учетом предпочтительного языка
 * @param {Object} species - Данные о виде покемона из API
 * @param {string} preferredLanguage - Предпочтительный язык (по умолчанию 'ru')
 * @param {string} fallbackLanguage - Запасной язык (по умолчанию 'en')
 * @returns {string} Отформатированное описание покемона
 */
export const getPokemonDescription = (species, preferredLanguage = 'ru', fallbackLanguage = 'en') => {
  // Проверка наличия данных
  if (!species?.flavor_text_entries?.length) return 'Описание недоступно';

  try {
    // Кэшируем массив для производительности
    const entries = species.flavor_text_entries;

    // Попытка найти описание на предпочтительном языке
    const preferredEntry = entries.find(
      (entry) => entry.language?.name === preferredLanguage
    );

    // Если предпочтительное описание не найдено, используем запасной язык
    const fallbackEntry = entries.find(
      (entry) => entry.language?.name === fallbackLanguage
    );

    const description = (preferredEntry || fallbackEntry)?.flavor_text || 'Описание недоступно';

    // Нормализация текста - убираем символы новой строки и лишние пробелы
    return description
      .replace(/[\n\r\u2028\u2029]+/g, ' ') // Символы переноса строки без управляющих символов
      .replace(/\s+/g, ' ')
      .trim();
  } catch (error) {
    console.error('Error getting Pokemon description:', error);
    return 'Ошибка при получении описания';
  }
};

/**
 * Функция для обратной совместимости - получение русского описания с английским как запасным
 * @param {Object} species - Данные о виде покемона из API
 * @returns {string} Отформатированное описание покемона на русском или английском
 */
export const getRussianDescription = (species) => getPokemonDescription(species, 'ru', 'en');

// Функция getOfficialArtwork перемещена в imageUtils.js
