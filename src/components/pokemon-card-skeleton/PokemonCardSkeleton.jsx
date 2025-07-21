import './PokemonCardSkeleton.css';
import React from 'react';
import { memo } from 'react';

const PokemonCardSkeleton = memo(() => {
  return (
    <div className="pokemon-card-skeleton">
      <div className="pokemon-card-skeleton-content">
        <div className="pokemon-card-skeleton-header">
          <div className="pokemon-name-skeleton"></div>
          <div className="pokemon-id-skeleton"></div>
        </div>

        <div className="pokemon-image-skeleton-block"></div>

        <div className="pokemon-types-skeleton">
          <div className="type-badge-skeleton"></div>
          <div className="type-badge-skeleton"></div>
        </div>
      </div>
    </div>
  );
});

export default PokemonCardSkeleton;
