import {useState, useCallback, useEffect} from 'react';

/**
 * Хук для управления каруселью
 * @param {Array} items - Массив элементов карусели
 * @param {number} visibleItems - Количество видимых элементов
 * @param {number} autoPlayInterval - Интервал автопереключения в мс
 * @returns {Object} Объект с состоянием и методами карусели
 */
export const useCarousel = (items, visibleItems, autoPlayInterval = 5000) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);

    const maxIndex = Math.max(0, items.length - visibleItems);
    const showNavigation = items.length > visibleItems;

    // Навигация по карусели
    const goToNext = useCallback(() => {
        if (items.length <= visibleItems) return;

        setCurrentIndex(prev => {
            return prev >= maxIndex ? 0 : prev + 1;
        });
    }, [items.length, visibleItems, maxIndex]);

    const goToPrev = useCallback(() => {
        if (items.length <= visibleItems) return;

        setCurrentIndex(prev => {
            return prev <= 0 ? maxIndex : prev - 1;
        });
    }, [items.length, visibleItems, maxIndex]);

    // Обработчики для свайпа/перетаскивания
    const handleMouseDown = useCallback((e) => {
        setIsDragging(true);
        setStartX(e.pageX);
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (!isDragging) return;
        e.preventDefault();
    }, [isDragging]);

    const handleMouseUp = useCallback((e) => {
        if (!isDragging) return;

        const endX = e.pageX;
        const diff = startX - endX;
        const minSwipeDistance = 50;

        if (Math.abs(diff) > minSwipeDistance) {
            if (diff > 0) {
                goToNext();
            } else {
                goToPrev();
            }
        }

        setIsDragging(false);
    }, [isDragging, startX, goToNext, goToPrev]);

    const handleMouseLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Touch события для мобильных устройств
    const handleTouchStart = useCallback((e) => {
        setIsDragging(true);
        setStartX(e.touches[0].pageX);
    }, []);

    const handleTouchMove = useCallback((e) => {
        if (!isDragging) return;
        e.preventDefault();
    }, [isDragging]);

    const handleTouchEnd = useCallback((e) => {
        if (!isDragging) return;

        const endX = e.changedTouches[0].pageX;
        const diff = startX - endX;
        const minSwipeDistance = 50;

        if (Math.abs(diff) > minSwipeDistance) {
            if (diff > 0) {
                goToNext();
            } else {
                goToPrev();
            }
        }

        setIsDragging(false);
    }, [isDragging, startX, goToNext, goToPrev]);

    // Автоматическое переключение слайдов
    useEffect(() => {
        if (items.length <= visibleItems) return;

        const interval = setInterval(() => {
            goToNext();
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [items.length, visibleItems, goToNext, autoPlayInterval]);

    // Вычисляем стили для трека карусели
    const trackStyle = {
        transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
        transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
    };

    return {
        currentIndex,
        isDragging,
        showNavigation,
        maxIndex,
        trackStyle,
        goToNext,
        goToPrev,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleMouseLeave,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd
    };
}; 