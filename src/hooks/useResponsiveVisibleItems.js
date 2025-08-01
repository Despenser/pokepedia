import {useState, useEffect} from 'react';

/**
 * Хук для определения количества видимых элементов в зависимости от размера экрана
 * @param {Object} breakpoints - Объект с брейкпоинтами и количеством элементов
 * @returns {number} Количество видимых элементов
 */
export const useResponsiveVisibleItems = (breakpoints = {
    1200: 4,
    768: 3,
    576: 2,
    0: 1
}) => {
    const [visibleItems, setVisibleItems] = useState(1);

    useEffect(() => {
        const getVisibleItems = () => {
            const width = window.innerWidth;
            const sortedBreakpoints = Object.keys(breakpoints)
                .map(Number)
                .sort((a, b) => b - a);

            for (const breakpoint of sortedBreakpoints) {
                if (width >= breakpoint) {
                    return breakpoints[breakpoint];
                }
            }
            return breakpoints[0];
        };

        const handleResize = () => {
            setVisibleItems(getVisibleItems());
        };

        // Устанавливаем начальное значение
        setVisibleItems(getVisibleItems());

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoints]);

    return visibleItems;
}; 