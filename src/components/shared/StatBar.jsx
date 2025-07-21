import React from 'react';

/**
 * Универсальный прогресс-бар для статистики
 * @param {number} value - значение (0-100)
 * @param {string} color - цвет бара
 * @param {string} [className] - дополнительные классы
 * @param {object} [style] - дополнительные стили
 */
const StatBar = ({ value, color, className = '', style = {} }) => (
  <div className={`stat-bar-container${className ? ' ' + className : ''}`.trim()} style={style}>
    <div
      className="stat-bar"
      style={{ width: `${Math.min(100, value)}%`, backgroundColor: color }}
    />
  </div>
);

export default StatBar; 