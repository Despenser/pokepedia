import React, {useRef, useLayoutEffect, useState, useEffect, useMemo, useCallback} from 'react';
import {calculateArrowPositions} from '../utils/evolutionUtils';

/**
 * Хук для расчета позиций стрелок в эволюционном дереве
 * @param {Array} children - Массив дочерних элементов
 * @returns {Object} Объект с данными для отрисовки стрелок
 */
export const useArrowCalculation = (children) => {
    const arrowsContainerRef = useRef(null);
    const parentRef = useRef(null);
    const [arrowData, setArrowData] = useState([]);

    // Создаем refs для дочерних элементов
    const childRefs = useMemo(() =>
            children.map(() => React.createRef()),
        [children]
    );

    // Функция для пересчёта стрелок
    const recalcArrows = useCallback(() => {
        if (!arrowsContainerRef.current || !parentRef.current) return;

        const arrows = calculateArrowPositions(
            arrowsContainerRef.current,
            parentRef.current,
            childRefs
        );
        setArrowData(arrows);
    }, [childRefs]);

    // Пересчитываем стрелки при изменении количества детей
    useLayoutEffect(() => {
        recalcArrows();
    }, [children.length, recalcArrows]);

    // Слушаем изменения размера окна
    useEffect(() => {
        window.addEventListener('resize', recalcArrows);
        return () => {
            window.removeEventListener('resize', recalcArrows);
        };
    }, [recalcArrows]);

    // Наблюдаем за изменениями размеров элементов
    useEffect(() => {
        if (!arrowsContainerRef.current) return;

        const observer = new window.ResizeObserver(() => {
            recalcArrows();
        });

        observer.observe(arrowsContainerRef.current);
        if (parentRef.current) observer.observe(parentRef.current);
        childRefs.forEach(ref => {
            if (ref.current) observer.observe(ref.current);
        });

        return () => {
            observer.disconnect();
        };
    }, [children.length, childRefs, recalcArrows]);

    return {
        arrowsContainerRef,
        parentRef,
        childRefs,
        arrowData
    };
}; 