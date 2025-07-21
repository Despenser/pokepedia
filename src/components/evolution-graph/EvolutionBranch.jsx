import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getIdFromSpecies } from '../../utils/evolutionUtils';
import { useArrowCalculation } from '../../hooks/useArrowCalculation';
import EvolutionArrows from './EvolutionArrows';
import UniversalPokemonCard from '../shared/UniversalPokemonCard.jsx';

/**
 * Компонент для отображения ветвистой эволюции
 */
const EvolutionBranch = React.forwardRef(({ node, currentPokemonId }, ref) => {
  const id = getIdFromSpecies(node.species);
  const isCurrent = Number(currentPokemonId) === id;
  const children = useMemo(() => node.evolves_to || [], [node.evolves_to]);
  
  const { arrowsContainerRef, parentRef, childRefs, arrowData } = useArrowCalculation(children);

  // Если нет детей, возвращаем простую карточку
  if (!children.length) {
    return (
      <div className="evo-branch-vert" ref={ref}>
        <Link to={`/pokemon/${id}`} className="mini-pokemon-link">
          <UniversalPokemonCard
            idOrName={id}
            variant="evolution"
            isCurrent={isCurrent}
          />
        </Link>
      </div>
    );
  }

  return (
    <div className="evo-branch-vert" style={{ position: 'relative' }} ref={ref}>
      <div 
        className="evo-branch-arrows-svg-wrapper" 
        ref={arrowsContainerRef} 
        style={{ 
          position: 'relative', 
          width: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}
      >
        <div className="evo-branch-parent" ref={parentRef}>
          <Link to={`/pokemon/${id}`} className="mini-pokemon-link" aria-label={`Покемон ${node.species.name}`}>
            <UniversalPokemonCard
              idOrName={id}
              variant="evolution"
              isCurrent={isCurrent}
            />
          </Link>
        </div>
        
        <EvolutionArrows arrowData={arrowData} />
        
        <div className="evo-branch-children-row">
          {children.map((child, idx) =>
            child.evolves_to && child.evolves_to.length > 0 ? (
              <EvolutionBranch 
                node={child} 
                currentPokemonId={currentPokemonId} 
                key={idx} 
                ref={childRefs[idx]} 
              />
            ) : (
              <Link 
                to={`/pokemon/${getIdFromSpecies(child.species)}`} 
                className="mini-pokemon-link" 
                key={idx} 
                ref={childRefs[idx]}
                aria-label={`Покемон ${child.species.name}`}
              >
                <UniversalPokemonCard
                  idOrName={getIdFromSpecies(child.species)}
                  variant="evolution"
                  isCurrent={Number(currentPokemonId) === getIdFromSpecies(child.species)}
                />
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
});

EvolutionBranch.displayName = 'EvolutionBranch';

export default EvolutionBranch; 