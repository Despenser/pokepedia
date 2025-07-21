import React from 'react';
import { memo, useEffect } from 'react';
import usePokemonStore from '../../store/pokemonStore.js';
import { useFilterState } from '../../hooks/useFilterState';
import {TypeBadge} from '../type-badge/TypeBadge.jsx';
import Button from '../shared/Button.jsx';
import './TypesFilter.css';

const TypesFilter = memo(() => {
  const { 
    pokemonTypes, 
    selectedType, 
    fetchPokemonTypes
  } = usePokemonStore();

  const { handleFilterClick, handleFilterReset } = useFilterState('type');

  useEffect(() => {
    fetchPokemonTypes();
  }, [fetchPokemonTypes]);

  return (
    <div className="types-filter">
      <div className="types-filter-header">
        <h2>Фильтр по типам</h2>
        {selectedType && (
          <Button
            variant="primary"
            onClick={handleFilterReset}
          >
            Сбросить тип
          </Button>
        )}
      </div>
      <div className="types-badges">
        {pokemonTypes.map((typeInfo) => (
          <TypeBadge
            key={typeInfo.name}
            type={typeInfo.name}
            onClick={handleFilterClick}
            isActive={selectedType === typeInfo.name}
          />
        ))}
      </div>
    </div>
  );
});

export default TypesFilter;
