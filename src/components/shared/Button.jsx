import React from 'react';
import './Button.css';

/**
 * Универсальная кнопка для всего приложения
 * @param {string} [variant] - 'primary' | 'secondary' | 'icon' | 'round'
 * @param {boolean} [active] - активна ли кнопка
 * @param {boolean} [disabled] - неактивна ли кнопка
 * @param {string} [className] - дополнительные классы
 * @param {function} [onClick] - обработчик клика
 * @param {React.ReactNode} [children] - содержимое кнопки
 * @param {object} [rest] - остальные props
 */
const Button = ({
  variant = 'primary',
  active = false,
  disabled = false,
  className = '',
  children,
  ...rest
}) => {
  const classes = [
    'shared-button',
    variant ? `shared-button--${variant}` : '',
    active ? 'shared-button--active' : '',
    disabled ? 'shared-button--disabled' : '',
    className
  ].filter(Boolean).join(' ');
  return (
    <button
      className={classes}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button; 