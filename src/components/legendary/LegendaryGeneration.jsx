import React, { memo } from 'react';
import { getGenerationNameRu } from '../../utils/localizationUtils';
import PokemonCard from '../pokemon-card/PokemonCard';

/**
 * Компонент для отображения поколения легендарных покемонов
 */
const LegendaryGeneration = memo(({ generation, pokemons }) => {
  if (!pokemons || pokemons.length === 0) {
    return null;
  }

  return (
    <section className="legendary-generation">
      <h2 className="section-title generation" style={{ marginTop: 32 }}>
        {getGenerationNameRu(generation)}
      </h2>
      <div className="pokemon-grid">
        {pokemons.map(pokemon => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
    </section>
  );
});

export default LegendaryGeneration; 