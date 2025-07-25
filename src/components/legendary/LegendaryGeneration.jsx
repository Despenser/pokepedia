import React, { memo, useState, useCallback, useEffect } from 'react';
import { getGenerationNameRuAsync } from '../../utils/localizationUtils';
import PokemonCard from '../pokemon-card/PokemonCard';
import { useInView } from 'react-intersection-observer';

const PAGE_SIZE = 8;

/**
 * Компонент для отображения поколения легендарных покемонов
 */
const LegendaryGeneration = memo(({ generation, pokemons }) => {
  if (!Array.isArray(pokemons) || pokemons.length === 0) {
    return null;
  }
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: false });
  const [generationName, setGenerationName] = useState(generation);
  useEffect(() => {
    let mounted = true;
    getGenerationNameRuAsync(generation).then(res => { if (mounted) setGenerationName(res); });
    return () => { mounted = false; };
  }, [generation]);

  // Подгружаем ещё PAGE_SIZE карточек, когда ref попадает в зону видимости
  React.useEffect(() => {
    if (inView && visibleCount < pokemons.length) {
      setVisibleCount(count => Math.min(count + PAGE_SIZE, pokemons.length));
    }
  }, [inView, visibleCount, pokemons.length]);

  return (
    <section className="legendary-generation">
      <h2 className="section-title generation" style={{ marginTop: 32 }}>
        {generationName}
      </h2>
      <div className="pokemon-grid">
        {pokemons.slice(0, visibleCount).map(pokemon => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
        {visibleCount < pokemons.length && (
          <div ref={ref} className="scroll-trigger"></div>
        )}
      </div>
    </section>
  );
});

export default LegendaryGeneration; 