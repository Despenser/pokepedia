/**
 * Утилиты для обработки и логирования ошибок
 */

/**
 * Логирование ошибок с контекстом для удобства отладки
 * @param {Error} error - Объект ошибки
 * @param {string} context - Контекст, в котором произошла ошибка
 * @param {Object} options - Дополнительные параметры для логирования или дополнительные данные
 */
  export function logError(error, context = '', options = {}) {
  // Проверяем, передан ли options как объект опций или как additionalData (для обратной совместимости)
  const isLegacyMode = arguments.length === 3 && typeof options !== 'object';
  const additionalData = isLegacyMode ? options : options.additionalData;
  const { severity = 'error', showStackTrace = true } = isLegacyMode ? {} : options;

  // Формируем сообщение
  const message = `Ошибка ${context ? `при ${context}` : ''}: ${error?.message || error}`;

  // Выбираем метод логирования в зависимости от уровня важности
  const logMethod = {
    error: console.error,
    warn: console.warn,
    info: console.info,
    debug: console.debug,
  }[severity] || console.error;

  // Логируем основное сообщение
  logMethod(message);

  // Логируем дополнительные данные, если они есть
  if (additionalData) {
    logMethod('Дополнительная информация:', additionalData);
  }

  // Логируем стек вызовов, если это нужно
  if (showStackTrace && error.stack) {
    logMethod('Стек вызовов:', error.stack);
  }
}

/**
 * Безопасное выполнение асинхронной функции с возвратом результата в формате [error, data]
 * @param {Function} asyncFunction - Асинхронная функция для выполнения
 * @param {Object} options - Дополнительные опции
 * @returns {Promise<Array>} Массив [error, data], где error - объект ошибки или null, data - результат выполнения или null
 */
export const safeAsync = async (asyncFunction, options = {}) => {
  const { errorContext, errorType, errorCallback } = options;

  try {
    const result = await asyncFunction();
    return [null, result];
  } catch (error) {
    // Добавляем тип ошибки, если он указан
    if (errorType) {
      error.type = errorType;
    }

    // Логируем ошибку, если указан контекст
    if (errorContext) {
      logError(error, errorContext, { additionalData: options });
    }

    // Вызываем колбэк для ошибки, если он предоставлен
    if (errorCallback && typeof errorCallback === 'function') {
      errorCallback(error);
    }

    return [error, null];
  }
};

/**
 * Структура для хранения информации об ошибках
 */
export const ERROR_MESSAGES = {
  // Типы ошибок
  NETWORK: {
    title: 'Ошибка сети',
    message: 'Проблема с сетевым подключением. Пожалуйста, проверьте ваше соединение.'
  },
  SERVER: {
    title: 'Ошибка сервера',
    message: 'Сервер недоступен. Пожалуйста, попробуйте позже.'
  },
  NOT_FOUND: {
    title: 'Не найдено',
    message: 'Запрашиваемые данные не найдены.'
  },
  TIMEOUT: {
    title: 'Превышено время ожидания',
    message: 'Превышено время ожидания ответа от сервера.'
  },
  DEFAULT: {
    title: 'Произошла ошибка',
    message: 'Произошла ошибка. Пожалуйста, попробуйте позже.'
  },
  POKEMON_LOAD: {
    title: 'Ошибка загрузки',
    message: 'Не удалось загрузить данные о покемоне.'
  },
  SPECIES_LOAD: {
    title: 'Ошибка загрузки',
    message: 'Не удалось загрузить информацию о виде покемона.'
  },
  EVOLUTION_LOAD: {
    title: 'Ошибка загрузки',
    message: 'Не удалось загрузить данные об эволюции.'
  },
  SEARCH: {
    title: 'Ошибка поиска',
    message: 'Ошибка при выполнении поиска. Пожалуйста, попробуйте изменить запрос.'
  },

  // HTTP коды ошибок
  '404': {
    title: 'Страница не найдена',
    message: 'Запрашиваемая страница не существует.'
  },
  '500': {
    title: 'Ошибка сервера',
    message: 'Что-то пошло не так на сервере. Пожалуйста, попробуйте позже.'
  },
  '403': {
    title: 'Доступ запрещен',
    message: 'У вас нет прав для доступа к этому ресурсу.'
  },
  '401': {
    title: 'Требуется авторизация',
    message: 'Необходимо войти в систему для доступа к этому ресурсу.'
  }
};

/**
 * Получение информации об ошибке на основе типа или объекта ошибки
 * @param {Error|Object} error - Объект ошибки, возможно, с полем response (например, от axios)
 * @param {string} fallbackType - Тип сообщения по умолчанию
 * @returns {Object} Объект с title и message для отображения пользователю
 */
export const getErrorInfo = (error, fallbackType = 'DEFAULT') => {
  let errorType = fallbackType;

  // Проверяем статус-код HTTP ошибки
  if (error && error.response) {
    const status = error.response.status;

    // Проверяем, есть ли сообщение для этого статуса
    if (ERROR_MESSAGES[status.toString()]) {
      return ERROR_MESSAGES[status.toString()];
    }

    if (status === 404) errorType = 'NOT_FOUND';
    else if (status >= 500) errorType = 'SERVER';
    else if (status >= 400) {
      // Используем серверное сообщение, если оно есть
      if (error.response.data && error.response.data.message) {
        return {
          title: ERROR_MESSAGES.DEFAULT.title,
          message: error.response.data.message
        };
      }
    }
  }

  if (error && error.message) {
    if (error.message.includes('timeout')) errorType = 'TIMEOUT';
    if (error.message.includes('Network Error')) errorType = 'NETWORK';
  }

  return ERROR_MESSAGES[errorType] || ERROR_MESSAGES.DEFAULT;
};

/**
 * Получение пользовательского сообщения на основе типа ошибки (для обратной совместимости)
 * @param {Error|Object} error - Объект ошибки
 * @param {string} fallbackType - Тип сообщения по умолчанию
 * @returns {string} Сообщение для отображения пользователю
 */
export const getUserFriendlyErrorMessage = (error, fallbackType = 'DEFAULT') => {
  return getErrorInfo(error, fallbackType).message;
};
