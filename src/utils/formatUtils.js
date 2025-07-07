// Форматирование ID покемона для отображения в виде #001
export const formatPokemonId = (id) => {
  return `#${id.toString().padStart(3, '0')}`;
};

// Форматирование имени покемона с заглавной буквы
export const formatPokemonName = (name, nameRu) => {
  if (!name) return '';
  // Используем русское имя, если оно доступно
  if (nameRu) return nameRu;
  // Если русского имени нет, форматируем английское имя
  return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
};

// Преобразование высоты из дециметров в метры
export const formatHeight = (height) => {
  const meters = height / 10;
  return `${meters.toFixed(1)} м`;
};

// Преобразование веса из гектограммов в килограммы
export const formatWeight = (weight) => {
  const kg = weight / 10;
  return `${kg.toFixed(1)} кг`;
};

// Получение описания покемона из species данных с учетом предпочтительного языка
export const getPokemonDescription = (species, preferredLanguage = 'ru', fallbackLanguage = 'en') => {
  if (!species?.flavor_text_entries?.length) return '';

  // Попытка найти описание на предпочтительном языке
  const preferredEntry = species.flavor_text_entries.find(
    (entry) => entry.language.name === preferredLanguage
  );

  // Если предпочтительное описание не найдено, используем запасной язык
  const fallbackEntry = species.flavor_text_entries.find(
    (entry) => entry.language.name === fallbackLanguage
  );

  const description = (preferredEntry || fallbackEntry)?.flavor_text || '';

  // Нормализация текста - убираем символы новой строки и лишние пробелы
  return description.replace(/[\f\n\r]+/g, ' ').replace(/\s+/g, ' ').trim();
};

// Сохраняем обратную совместимость
export const getRussianDescription = (species) => getPokemonDescription(species, 'ru', 'en');

// Функция getOfficialArtwork перемещена в imageUtils.js
