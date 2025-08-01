import React from 'react';
import './EvolutionTree.css';
import { hasBranches, collectLinearChain } from '../../utils/evolutionUtils';
import EvolutionRow from './EvolutionRow';
import EvolutionBranch from './EvolutionBranch';

/**
 * Основной компонент эволюционного дерева
 * Определяет тип эволюции (линейная или ветвистая) и отображает соответствующий компонент
 */
const EvolutionTree = ({ evolutionChain, currentPokemonId }) => {
  if (!evolutionChain?.chain) return null;
  
  const root = evolutionChain.chain;
  const isLinear = !hasBranches(root);
  
  if (isLinear) {
    const chain = collectLinearChain(root);
    return (
      <div className="evo-tree-root center">
        <EvolutionRow nodes={chain} currentPokemonId={currentPokemonId} />
      </div>
    );
  }
  
  return (
    <div className="evo-tree-root center">
      <EvolutionBranch node={root} currentPokemonId={currentPokemonId} />
    </div>
  );
};

export default EvolutionTree; 