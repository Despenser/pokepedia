import React from 'react';

/**
 * Значение для статистики
 * @param {string|number} children - значение
 * @param {string} [className] - дополнительные классы
 */
const StatValue = ({ children, className = '' }) => (
  <div className={`stat-value${className ? ' ' + className : ''}`.trim()}>{children}</div>
);

export default StatValue; 