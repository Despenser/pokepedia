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


