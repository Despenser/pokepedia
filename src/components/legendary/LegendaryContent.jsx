import React from 'react';
import PokemonCardSkeleton from '../pokemon-card-skeleton/PokemonCardSkeleton';
import LegendaryGeneration from './LegendaryGeneration';
import { GENERATION_ORDER } from '../../utils/legendaryUtils';

/**
 * Компонент для отображения основного контента страницы легендарных покемонов
 */
const LegendaryContent = ({ grouped, isLoading, error }) => {
  if (error) {
    return (
      <div className="favorites-error-container">
        <div style={{ color: 'red' }}>{error.message}</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pokemon-grid">
        {Array(6).fill(0).map((_, i) => (
          <PokemonCardSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }

  return (
    <>
      {GENERATION_ORDER.map(gen => (
        <LegendaryGeneration 
          key={gen} 
          generation={gen} 
          pokemons={grouped[gen]} 
        />
      ))}
    </>
  );
};

export default LegendaryContent; 