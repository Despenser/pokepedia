export const safeLocalStorage = {
  getItem: (name) => {
    try {
      return localStorage.getItem(name);
    } catch (e) {
      console.warn('Ошибка чтения из localStorage:', e);
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value);
    } catch (e) {
      if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
        console.warn('Превышен лимит localStorage! Кеш будет очищен.');
        localStorage.removeItem(name);
      } else {
        throw e;
      }
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch (e) {
      console.warn('Ошибка удаления из localStorage:', e);
    }
  }
}; 