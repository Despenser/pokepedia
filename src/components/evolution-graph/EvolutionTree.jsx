import React, { useRef, useLayoutEffect, useState, useEffect, useMemo } from 'react';
import './EvolutionTree.css';
import { Link } from 'react-router-dom';
import { getPokemonImage, getFallbackImage } from '../../utils/imageUtils';
import pokemonNamesRu from '../../assets/translate/pokemon-names-ru.json';
import { getGradientByTypes } from '../../utils/colorUtils';

function getIdFromSpecies(species) {
  return Number(species.url.split('/').filter(Boolean).pop());
}

function getPokemonNameRu(name) {
  return pokemonNamesRu[name] || name;
}



const EvoMiniCard = React.forwardRef(({ id, name, sprites, types, isCurrent }, ref) => {
  const imageUrl = getPokemonImage(sprites, id) || getFallbackImage(id);
  const displayName = getPokemonNameRu(name);
  const background = getGradientByTypes(types);
  return (
    <div
      className={`evo-mini-card${isCurrent ? ' current' : ''}`}
      ref={ref}
      style={{ background }}
    >
      <img src={imageUrl} alt={displayName} className="evo-mini-img" loading="eager" />
      <div className="evo-mini-name">{displayName}</div>
    </div>
  );
});

function hasBranches(node) {
  if (!node.evolves_to) return false;
  if (node.evolves_to.length > 1) return true;
  return node.evolves_to.some(child => hasBranches(child));
}

const EvolutionBranch = React.forwardRef(({ node, currentPokemonId }, ref) => {
  const id = getIdFromSpecies(node.species);
  const isCurrent = Number(currentPokemonId) === id;
  const children = useMemo(() => node.evolves_to || [], [node.evolves_to]);
  const arrowsContainerRef = useRef(null);
  const parentRef = useRef(null);
  const [arrowData, setArrowData] = useState([]);
  
  // Создаем refs для дочерних элементов
  const childRefs = useMemo(() => 
    children.map(() => React.createRef()), 
    [children]
  );

  // Функция для пересчёта стрелок
  const recalcArrows = () => {
    if (!arrowsContainerRef.current || !parentRef.current) return;
    const containerRect = arrowsContainerRef.current.getBoundingClientRect();
    const parentRect = parentRef.current.getBoundingClientRect();
    const arrows = childRefs.map((ref) => {
      if (!ref.current) return null;
      const childRect = ref.current.getBoundingClientRect();
      const x1 = parentRect.left + parentRect.width / 2 - containerRect.left;
      const y1 = parentRect.top + parentRef.current.offsetHeight - containerRect.top;
      const x2 = childRect.left + childRect.width / 2 - containerRect.left;
      const y2 = childRect.top - containerRect.top;
      return { x1, y1, x2, y2 };
    });
    setArrowData(arrows);
  };

  useLayoutEffect(() => {
    recalcArrows();
    // eslint-disable-next-line
  }, [children.length]);

  useEffect(() => {
    window.addEventListener('resize', recalcArrows);
    return () => {
      window.removeEventListener('resize', recalcArrows);
    };
    // eslint-disable-next-line
  }, [children.length]);

  useEffect(() => {
    if (!arrowsContainerRef.current) return;
    const observer = new window.ResizeObserver(() => {
      recalcArrows();
    });
    observer.observe(arrowsContainerRef.current);
    if (parentRef.current) observer.observe(parentRef.current);
    childRefs.forEach(ref => { if (ref.current) observer.observe(ref.current); });
    return () => {
      observer.disconnect();
    };
    // eslint-disable-next-line
  }, [children.length]);

  if (!children.length) {
    return (
      <div className="evo-branch-vert" ref={ref}>
        <Link to={`/pokemon/${id}`} className="mini-pokemon-link">
          <EvoMiniCard
            id={id}
            name={node.species.name}
            sprites={node.sprites || {}}
            types={node.types || []}
            isCurrent={isCurrent}
          />
        </Link>
      </div>
    );
  }
  return (
    <div className="evo-branch-vert" style={{ position: 'relative' }} ref={ref}>
      <div className="evo-branch-arrows-svg-wrapper" ref={arrowsContainerRef} style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="evo-branch-parent" ref={parentRef}>
          <Link to={`/pokemon/${id}`} className="mini-pokemon-link">
            <EvoMiniCard
              id={id}
              name={node.species.name}
              sprites={node.sprites || {}}
              types={node.types || []}
              isCurrent={isCurrent}
            />
          </Link>
        </div>
        <svg className="evo-branch-arrows-svg" style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }}>
          {arrowData.map((arrow, idx) => arrow && (
            <path
              key={idx}
              className="evo-arrow-path"
              d={`M${arrow.x1},${arrow.y1} C${arrow.x1},${arrow.y1 + 32} ${arrow.x2},${arrow.y2 - 32} ${arrow.x2},${arrow.y2}`}
              stroke="#888"
              strokeWidth="2.5"
              fill="none"
            />
          ))}
        </svg>
        <div className="evo-branch-children-row">
          {children.map((child, idx) =>
            child.evolves_to && child.evolves_to.length > 0 ? (
              <EvolutionBranch node={child} currentPokemonId={currentPokemonId} key={idx} ref={childRefs[idx]} />
            ) : (
              <Link to={`/pokemon/${getIdFromSpecies(child.species)}`} className="mini-pokemon-link" key={idx} ref={childRefs[idx]}>
                <EvoMiniCard
                  id={getIdFromSpecies(child.species)}
                  name={child.species.name}
                  sprites={child.sprites || {}}
                  types={child.types || []}
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

function collectLinearChain(node) {
  const chain = [node];
  let current = node;
  while (current.evolves_to && current.evolves_to.length === 1) {
    current = current.evolves_to[0];
    chain.push(current);
  }
  return chain;
}

// ВОССТАНОВЛЕННЫЙ КОМПОНЕНТ
function EvolutionRow({ nodes, currentPokemonId }) {
  return (
    <div className="evo-row">
      {nodes.map((node, idx) => {
        const id = getIdFromSpecies(node.species);
        const isCurrent = Number(currentPokemonId) === id;
        return (
          <React.Fragment key={id}>
            <Link to={`/pokemon/${id}`} className="mini-pokemon-link">
              <EvoMiniCard
                id={id}
                name={node.species.name}
                sprites={node.sprites || {}}
                types={node.types || []}
                isCurrent={isCurrent}
              />
            </Link>
            {idx < nodes.length - 1 && (
              <div className="evo-row-arrow">
                <svg width="48" height="32" viewBox="0 0 48 32">
                  <line x1="0" y1="16" x2="36" y2="16" stroke="#888" strokeWidth="2.5" />
                  <polygon points="36,10 48,16 36,22" fill="#888" />
                </svg>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

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