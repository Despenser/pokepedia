import React, { useRef } from 'react';
import PokemonCard from '../pokemon-card/PokemonCard';
import PokemonCardSkeleton from '../pokemon-card-skeleton/PokemonCardSkeleton';

/**
 * Компонент трека карусели
 */
const CarouselTrack = ({ 
  trackStyle, 
  loading, 
  similarPokemons, 
  onMouseDown, 
  onMouseMove, 
  onMouseUp, 
  onMouseLeave, 
  onTouchStart, 
  onTouchMove, 
  onTouchEnd 
}) => {
  const carouselRef = useRef(null);

  return (
    <div
      ref={carouselRef}
      className="carousel-track"
      style={trackStyle}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {loading ? (
        // Скелетоны во время загрузки
        Array.from({ length: 8 }, (_, index) => (
          <div className="carousel-item" key={`skeleton-${index}`}>
            <PokemonCardSkeleton />
          </div>
        ))
      ) : similarPokemons.length > 0 ? (
        // Похожие покемоны
        similarPokemons.map((pokemon, index) => (
          <div 
            className="carousel-item" 
            key={pokemon.id}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <PokemonCard pokemon={pokemon} />
          </div>
        ))
      ) : (
        // Сообщение об отсутствии похожих покемонов
        <div className="no-similar-pokemons">
          <div className="no-pokemons-content">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="M16 16s-1.5-2-4-2-4 2-4 2"/>
              <line x1="9" y1="9" x2="9.01" y2="9"/>
              <line x1="15" y1="9" x2="15.01" y2="9"/>
            </svg>
            <p>Похожие покемоны не найдены</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarouselTrack; 