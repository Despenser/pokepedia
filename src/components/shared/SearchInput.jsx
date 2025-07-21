import React, { useState, useEffect, useRef } from 'react';

/**
 * Универсальный компонент строки поиска
 * @param {string} value - текущее значение
 * @param {function} onChange - обработчик изменения значения
 * @param {function} [onReset] - обработчик сброса
 * @param {string} [placeholder] - плейсхолдер
 * @param {number} [debounce=300] - задержка для debounce
 * @param {boolean} [autoFocus] - автофокус
 * @param {React.ReactNode} [icon] - иконка поиска
 * @param {string} [className] - дополнительные классы
 * @param {object} [inputProps] - дополнительные props для input
 */
const SearchInput = ({
  value,
  onChange,
  onReset,
  placeholder = 'Поиск...',
  debounce = 300,
  autoFocus = false,
  icon = null,
  className = '',
  inputProps = {},
}) => {
  const [localValue, setLocalValue] = useState(value || '');
  const debounceRef = useRef();

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (localValue !== value) {
        onChange && onChange(localValue);
      }
    }, debounce);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line
  }, [localValue]);

  const handleReset = () => {
    setLocalValue('');
    onReset && onReset();
    onChange && onChange('');
  };

  return (
    <div className={`search-bar${className ? ' ' + className : ''}`.trim()}>
      {icon && (
        <span className="search-button" tabIndex={-1} aria-hidden="true">{icon}</span>
      )}
      <input
        type="text"
        className="search-input"
        value={localValue}
        onChange={e => setLocalValue(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        {...inputProps}
      />
      {localValue && (
        <button
          type="button"
          className="search-reset-button"
          onClick={handleReset}
          aria-label="Очистить поиск"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default SearchInput; 