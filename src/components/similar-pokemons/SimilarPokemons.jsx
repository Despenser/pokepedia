import React from 'react';
import usePokemonStore from '../../store/pokemonStore.js';
import { useSimilarPokemons } from '../../hooks/useSimilarPokemons';
import { useResponsiveVisibleItems } from '../../hooks/useResponsiveVisibleItems';
import { useCarousel } from '../../hooks/useCarousel';
import CarouselArrow from './CarouselArrow';
import CarouselTrack from './CarouselTrack';
import './SimilarPokemons.css';

/**
 * Компонент для отображения похожих покемонов в карусели
 */
const SimilarPokemons = ({ pokemonId, types, excludeNames = [] }) => {
  const { cache } = usePokemonStore();
  
  // Получаем количество видимых карточек в зависимости от размера экрана
  const visibleCards = useResponsiveVisibleItems();
  
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
        <h3>Похожие покемоны</h3>
      </div>

      <div className="carousel-wrapper">
        {showNavigation && (
          <CarouselArrow
            direction="prev"
            onClick={goToPrev}
            disabled={currentIndex === 0}
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
          />
        </div>

        {showNavigation && (
          <CarouselArrow
            direction="next"
            onClick={goToNext}
            disabled={currentIndex === maxIndex}
          />
        )}
      </div>
    </div>
  );
};

export default SimilarPokemons;
