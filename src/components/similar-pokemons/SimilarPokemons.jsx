import React from 'react';
import usePokemonStore from '../../store/pokemonStore.js';
import { useSimilarPokemons } from '../../hooks/useSimilarPokemons';
import { useResponsiveVisibleItems } from '../../hooks/useResponsiveVisibleItems';
import { useCarousel } from '../../hooks/useCarousel';
import Arrow from '../shared/Arrow.jsx';
import CarouselTrack from './CarouselTrack';
import './SimilarPokemons.css';

/**
 * Компонент для отображения похожих покемонов в карусели
 */
const SimilarPokemons = ({ pokemonId, types, excludeNames = [] }) => {
  const { cache } = usePokemonStore();
  
  // Получаем количество видимых карточек в зависимости от размера экрана
  const visibleCards = useResponsiveVisibleItems();
  const itemWidth = `${100 / visibleCards}%`;
  
  // Загружаем похожих покемонов
  const { similarPokemons, loading } = useSimilarPokemons(pokemonId, types, cache, excludeNames);
  
  // Управление каруселью
  const {
    currentIndex,
    showNavigation,
    maxIndex,
    trackStyle,
    goToNext,
    goToPrev,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = useCarousel(similarPokemons, visibleCards);

  // Если нет типов, не показываем компонент
  if (!types || types.length === 0) {
    return null;
  }

  return (
    <div className="similar-pokemons">
      <div className="similar-pokemons-header">
        <h2>Похожие покемоны</h2>
      </div>

      <div className="carousel-wrapper">
        {showNavigation && (
          <Arrow
            direction="left"
            onClick={goToPrev}
            disabled={currentIndex === 0}
            aria-label="Предыдущие покемоны"
          />
        )}

        <div className="carousel-container">
          <CarouselTrack
            trackStyle={trackStyle}
            loading={loading}
            similarPokemons={similarPokemons}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            itemWidth={itemWidth}
          />
        </div>

        {showNavigation && (
          <Arrow
            direction="right"
            onClick={goToNext}
            disabled={currentIndex === maxIndex}
            aria-label="Следующие покемоны"
          />
        )}
      </div>
    </div>
  );
};

export default SimilarPokemons;
