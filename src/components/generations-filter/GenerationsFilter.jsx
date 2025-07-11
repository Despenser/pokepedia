import { useEffect } from 'react';
import usePokemonStore from '../../store/pokemonStore.js';
import { useFilterState } from '../../hooks/useFilterState';
import GenerationBadge from '../generation-badge/GenerationBadge.jsx';
import './GenerationsFilter.css';

const GenerationsFilter = () => {
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
        <h3>Фильтр по поколениям</h3>
        {selectedGeneration && (
          <button 
            className="back-button"
            onClick={handleFilterReset}
          >
            Сбросить поколение
          </button>
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
};

export default GenerationsFilter;
