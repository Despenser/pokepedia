import React from 'react';
import {EvolutionTree} from '../evolution/evolution-tree/EvolutionTree.jsx';

/**
 * Компонент для отображения секции эволюции покемона
 */
const EvolutionSection = ({ species, evolutionChain, pokemonId }) => {
  return (
    <div className="evolution-section">
      <h2>Эволюция</h2>
      {species && evolutionChain ? (
        <EvolutionTree 
          evolutionChain={evolutionChain}
          currentPokemonId={pokemonId}
        />
      ) : (
        <div>Информация о цепочке эволюции недоступна</div>
      )}
    </div>
  );
};

export default EvolutionSection; 