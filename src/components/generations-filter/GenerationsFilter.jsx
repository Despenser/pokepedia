import React from 'react';
import { memo, useEffect } from 'react';
import usePokemonStore from '../../store/pokemonStore.js';
import { useFilterState } from '../../hooks/useFilterState';
import GenerationBadge from '../generation-badge/GenerationBadge.jsx';
import Button from '../shared/Button.jsx';
import './GenerationsFilter.css';

const GenerationsFilter = memo(() => {
  const { 
    generations, 
    selectedGeneration, 
    fetchGenerations
  } = usePokemonStore();

  const { handleFilterClick, handleFilterReset } = useFilterState('generation');

  useEffect(() => {
    fetchGenerations();
  }, [fetchGenerations, generations.length]);

  return (
    <div className="generations-filter">
      <div className="generations-filter-header">
        <h2>Фильтр по поколениям</h2>
        {selectedGeneration && (
          <Button
            variant="primary"
            onClick={handleFilterReset}
          >
            Сбросить поколение
          </Button>
        )}
      </div>
      <div className="generations-badges">
        {generations.map((generationInfo) => (
          <GenerationBadge
            key={generationInfo.name}
            generation={generationInfo.name}
            onClick={handleFilterClick}
            isActive={selectedGeneration === generationInfo.name}
          />
        ))}
      </div>
    </div>
  );
});

export default GenerationsFilter;
