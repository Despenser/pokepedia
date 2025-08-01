import {useState, useEffect, useCallback} from 'react';

// Константы для работы с темой
const THEME_KEY = 'pokemon-app-theme';
const LIGHT_THEME = 'light';
const DARK_THEME = 'dark';

/**
 * Хук для управления темой приложения с поддержкой локального хранилища и системных предпочтений
 * @returns {Object} Состояние и функции для управления темой
 */
export const useTheme = () => {
    // Получаем системную тему
    const getSystemTheme = () => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return DARK_THEME;
        }
        return LIGHT_THEME;
    };

    // Определяем, есть ли ручной выбор
    const getManualTheme = () => localStorage.getItem(THEME_KEY);

    // Определяем текущую тему: приоритет у ручной, иначе системная
    const getCurrentTheme = () => {
        const manual = getManualTheme();
        return manual || getSystemTheme();
    };

    const [theme, setTheme] = useState(getCurrentTheme);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Применение темы к документу
    const applyTheme = useCallback((newTheme) => {
        document.documentElement.setAttribute('data-theme', newTheme);
    }, []);

    // Переключение между темной и светлой темой (ручной выбор)
    const toggleTheme = useCallback(() => {
        setTheme(prevTheme => {
            const newTheme = prevTheme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
            localStorage.setItem(THEME_KEY, newTheme);
            return newTheme;
        });
    }, []);

    // Установка конкретной темы (ручной выбор)
    const setThemeExplicitly = useCallback((newTheme) => {
        if (newTheme !== LIGHT_THEME && newTheme !== DARK_THEME) return;
        setTheme(newTheme);
        localStorage.setItem(THEME_KEY, newTheme);
    }, []);

    // Применяем тему при изменении и добавляем плавный переход
    useEffect(() => {
        const handleTransition = () => {
            document.documentElement.classList.add('theme-transition');
            setIsTransitioning(true);
            applyTheme(theme);
            const transitionTimeout = setTimeout(() => {
                document.documentElement.classList.remove('theme-transition');
                setIsTransitioning(false);
            }, 300);
            return () => clearTimeout(transitionTimeout);
        };
        return handleTransition();
    }, [theme, applyTheme]);

    // Следим за системными изменениями темы
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
            // При смене системной темы сбрасываем ручной выбор и применяем системную
            localStorage.removeItem(THEME_KEY);
            setTheme(e.matches ? DARK_THEME : LIGHT_THEME);
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    // Синхронизация темы с localStorage
    useEffect(() => {
        // При монтировании проверяем актуальное значение из localStorage
        const manualTheme = getManualTheme();
        if (manualTheme && manualTheme !== theme) {
            setTheme(manualTheme);
        }
        // Слушаем изменения localStorage в других вкладках
        const handleStorage = (event) => {
            if (event.key === THEME_KEY) {
                if (event.newValue && event.newValue !== theme) {
                    setTheme(event.newValue);
                } else if (!event.newValue) {
                    // Если ручной выбор удалён, применяем системную тему
                    setTheme(getSystemTheme());
                }
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, [theme]);

    // Для ThemeSwitcher: показываем текущую тему (ручная или системная)
    return {
        theme,
        isLightTheme: theme === LIGHT_THEME,
        isDarkTheme: theme === DARK_THEME,
        toggleTheme,
        setTheme: setThemeExplicitly,
        isTransitioning
    };
};