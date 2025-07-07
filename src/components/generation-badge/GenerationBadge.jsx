import { memo } from 'react';
import './GenerationBadge.css';

/**
 * Карта локализованных названий поколений
 */
const GENERATION_MAP = {
  'generation-i': 'I',
  'generation-ii': 'II',
  'generation-iii': 'III',
  'generation-iv': 'IV',
  'generation-v': 'V',
  'generation-vi': 'VI',
  'generation-vii': 'VII',
  'generation-viii': 'VIII',
  'generation-ix': 'IX'
};

/**
 * Компонент бейджа для отображения поколения покемонов
 * @param {Object} props - Свойства компонента
 * @param {string} props.generation - Идентификатор поколения
 * @param {Function} [props.onClick] - Обработчик клика
 * @param {boolean} [props.isActive=false] - Флаг активного состояния
 */
const GenerationBadge = ({ generation, onClick, isActive = false }) => {
  // Локализованное название поколения
  const displayName = GENERATION_MAP[generation] || generation;

  // Формирование классов для бейджа
  const badgeClasses = [
    'generation-badge',
    isActive && 'active',
    onClick && 'clickable'
  ].filter(Boolean).join(' ');

  // Обработчик клика с проверкой наличия функции
  const handleClick = onClick ? () => onClick(generation) : undefined;

  return (
    <div className={badgeClasses} onClick={handleClick} aria-label={`Поколение ${displayName}`}>
      {displayName}
    </div>
  );
};

// Мемоизация компонента для предотвращения ненужных перерисовок
export default memo(GenerationBadge);
