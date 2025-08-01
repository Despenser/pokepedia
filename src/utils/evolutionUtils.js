/**
 * Утилиты для работы с эволюцией покемонов
 */

/**
 * Извлекает ID покемона из URL вида
 * @param {Object} species - Объект вида покемона
 * @returns {number} ID покемона
 */
export const getIdFromSpecies = (species) => {
    return Number(species.url.split('/').filter(Boolean).pop());
};

/**
 * Проверяет, есть ли ветвления в цепочке эволюции
 * @param {Object} node - Узел эволюции
 * @returns {boolean} true если есть ветвления
 */
export const hasBranches = (node) => {
    if (!node.evolves_to) return false;
    if (node.evolves_to.length > 1) return true;
    return node.evolves_to.some(child => hasBranches(child));
};

/**
 * Собирает линейную цепочку эволюции
 * @param {Object} node - Корневой узел эволюции
 * @returns {Array} Массив узлов в линейной цепочке
 */
export const collectLinearChain = (node) => {
    const chain = [node];
    let current = node;
    while (current.evolves_to && current.evolves_to.length === 1) {
        current = current.evolves_to[0];
        chain.push(current);
    }
    return chain;
};

/**
 * Вычисляет координаты стрелок между элементами эволюции
 * @param {HTMLElement} container - Контейнер стрелок
 * @param {HTMLElement} parent - Родительский элемент
 * @param {Array} childRefs - Массив ссылок на дочерние элементы
 * @returns {Array} Массив координат стрелок
 */
export const calculateArrowPositions = (container, parent, childRefs) => {
    if (!container || !parent) return [];

    const containerRect = container.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    return childRefs.map((ref) => {
        if (!ref.current) return null;
        const childRect = ref.current.getBoundingClientRect();
        const x1 = parentRect.left + parentRect.width / 2 - containerRect.left;
        const y1 = parentRect.top + parent.offsetHeight - containerRect.top;
        const x2 = childRect.left + childRect.width / 2 - containerRect.left;
        const y2 = childRect.top - containerRect.top;
        return {x1, y1, x2, y2};
    });
}; 