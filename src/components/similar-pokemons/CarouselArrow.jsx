import React from 'react';

/**
 * Компонент стрелки карусели
 */
const CarouselArrow = ({ direction, onClick, disabled, className = '' }) => {
  const isPrev = direction === 'prev';
  
  return (
    <button
      className={`carousel-arrow carousel-arrow-${direction} ${className}`}
      onClick={onClick}
      aria-label={`${isPrev ? 'Предыдущие' : 'Следующие'} покемоны`}
      disabled={disabled}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {isPrev ? (
          <path d="M15 18l-6-6 6-6"/>
        ) : (
          <path d="M9 18l6-6-6-6"/>
        )}
      </svg>
    </button>
  );
};

export default CarouselArrow; 