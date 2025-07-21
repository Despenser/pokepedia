import React from 'react';

/**
 * Подпись для статистики
 * @param {string} children - текст подписи
 * @param {string} [className] - дополнительные классы
 */
const StatLabel = ({ children, className = '' }) => (
  <div className={`stat-name${className ? ' ' + className : ''}`.trim()}>{children}</div>
);

export default StatLabel; 