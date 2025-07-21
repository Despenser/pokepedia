import React from 'react';
import './Badge.css';

/**
 * Универсальный бейдж для типов, поколений и других сущностей
 * @param {string} label - текст бейджа
 * @param {string} [color] - цвет фона бейджа (CSS-переменная или hex)
 * @param {string} [textColor] - цвет текста
 * @param {boolean} [active] - активен ли бейдж
 * @param {boolean} [clickable] - кликабелен ли бейдж
 * @param {function} [onClick] - обработчик клика
 * @param {('default'|'large'|'small')} [size] - размер бейджа
 * @param {string} [className] - дополнительные классы
 */
const Badge = ({ label, color, textColor, active = false, clickable = false, onClick, size = 'default', className = '', ...rest }) => {
  const badgeClasses = [
    'shared-badge',
    size !== 'default' ? `shared-badge--${size}` : '',
    active ? 'shared-badge--active' : '',
    clickable ? 'shared-badge--clickable' : '',
    className
  ].filter(Boolean).join(' ');
  return (
    <div
      className={badgeClasses}
      style={{ background: color, color: textColor }}
      onClick={clickable && onClick ? onClick : undefined}
      tabIndex={clickable ? 0 : -1}
      role={clickable ? 'button' : 'presentation'}
      {...rest}
    >
      {label}
    </div>
  );
};

export default Badge; 