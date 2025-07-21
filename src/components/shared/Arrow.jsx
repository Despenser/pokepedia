import React from 'react';
import './Arrow.css';

/**
 * Универсальная стрелка для каруселей, эволюций и других мест
 * @param {('left'|'right'|'up'|'down')} direction - направление
 * @param {boolean} [disabled] - неактивна ли стрелка
 * @param {function} [onClick] - обработчик клика
 * @param {string} [className] - дополнительные классы
 * @param {string} [color] - цвет стрелки (CSS-переменная или hex)
 * @param {number} [size] - размер (px)
 */
const Arrow = ({ direction = 'right', disabled = false, onClick, className = '', color, size = 24, ...rest }) => {
  const rotateMap = { right: 0, down: 90, left: 180, up: 270 };
  const rotate = rotateMap[direction] || 0;
  return (
    <button
      className={`shared-arrow shared-arrow--${direction}${disabled ? ' shared-arrow--disabled' : ''}${className ? ' ' + className : ''}`}
      onClick={onClick}
      disabled={disabled}
      style={{ '--arrow-color': color || 'var(--primary-color)', width: size, height: size, transform: `rotate(${rotate}deg)` }}
      aria-label={direction}
      tabIndex={disabled ? -1 : 0}
      {...rest}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  );
};

export default Arrow; 