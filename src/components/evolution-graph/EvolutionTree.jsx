import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
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

function parseEvolutionDetails(details) {
  if (!details || details.length === 0) return '';
  // Собираем все условия из каждого объекта details
  const allConditions = details.map((d) => {
    const conds = [];
    if (d.trigger?.name === 'level-up' && d.min_level) conds.push(`Уровень ${d.min_level}`);
    if (d.trigger?.name === 'use-item' && d.item) conds.push(`Использовать ${ruItem(d.item.name)}`);
    if (d.trigger?.name === 'trade') conds.push('Обмен');
    if (d.min_happiness) conds.push('Дружба');
    if (d.time_of_day && d.time_of_day !== '') conds.push(ruTime(d.time_of_day));
    if (d.held_item) conds.push(`Держит: ${ruItem(d.held_item.name)}`);
    if (d.known_move) conds.push(`Знает приём: ${ruMove(d.known_move.name)}`);
    if (d.location) conds.push(`Локация: ${ruLocation(d.location.name)}`);
    if (d.gender === 1) conds.push('Только самка');
    if (d.gender === 2) conds.push('Только самец');
    if (conds.length === 0 && d.trigger?.name) conds.push(ruTrigger(d.trigger.name));
    return conds.join(', ');
  }).filter(Boolean);
  // Убираем дубликаты и объединяем через запятую
  const unique = Array.from(new Set(allConditions));
  return unique.join(', ');
}
function ruItem(name) {
  const map = { 'moon-stone': 'лунный камень', 'fire-stone': 'огненный камень', 'thunder-stone': 'грозовой камень', 'ice-stone': 'ледяной камень', 'water-stone': 'водный камень' };
  return map[name] || name.replace(/-/g, ' ');
}
function ruTime(time) {
  if (time === 'day') return 'день';
  if (time === 'night') return 'ночь';
  return time;
}
function ruMove(name) {
  return name.replace(/-/g, ' ');
}
function ruLocation(name) {
  return name.replace(/-/g, ' ');
}
function ruTrigger(name) {
  const map = { 'level-up': 'Уровень', 'use-item': 'Использовать предмет', 'trade': 'Обмен', 'other': 'Другое' };
  return map[name] || name.replace(/-/g, ' ');
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
                <div className="evo-condition-row">{parseEvolutionDetails(node.evolves_to[0]?.evolution_details)}</div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function EvolutionBranch({ node, currentPokemonId }) {
  const id = getIdFromSpecies(node.species);
  const isCurrent = Number(currentPokemonId) === id;
  const children = node.evolves_to || [];
  const arrowsContainerRef = useRef(null);
  const parentRef = useRef(null);
  const childRefs = children.map(() => useRef(null));
  const [arrowData, setArrowData] = useState([]);

  // Функция для пересчёта стрелок
  const recalcArrows = () => {
    if (!arrowsContainerRef.current || !parentRef.current) return;
    const containerRect = arrowsContainerRef.current.getBoundingClientRect();
    const parentRect = parentRef.current.getBoundingClientRect();
    const arrows = childRefs.map((ref) => {
      if (!ref.current) return null;
      const childRect = ref.current.getBoundingClientRect();
      const x1 = parentRect.left + parentRect.width / 2 - containerRect.left;
      const y1 = parentRect.top + parentRect.height - containerRect.top;
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

  // Пересчёт стрелок при изменении размера окна
  useEffect(() => {
    window.addEventListener('resize', recalcArrows);
    return () => {
      window.removeEventListener('resize', recalcArrows);
    };
    // eslint-disable-next-line
  }, [children.length]);

  // Пересчёт стрелок при изменении размеров контейнера/карточек
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
      <div className="evo-branch-vert">
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
    <div className="evo-branch-vert" style={{ position: 'relative' }}>
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
              d={`M${arrow.x1},${arrow.y1} C${arrow.x1},${arrow.y1 + 32} ${arrow.x2},${arrow.y2 - 32} ${arrow.x2},${arrow.y2}`}
              stroke="#888"
              strokeWidth="2.5"
              fill="none"
            />
          ))}
        </svg>
        <div className="evo-branch-children-row">
          {children.map((child, idx) => (
            <div className="evo-branch-child-with-condition" key={idx} ref={childRefs[idx]}>
              <Link to={`/pokemon/${getIdFromSpecies(child.species)}`} className="mini-pokemon-link">
                <EvoMiniCard
                  id={getIdFromSpecies(child.species)}
                  name={child.species.name}
                  sprites={child.sprites || {}}
                  types={child.types || []}
                  isCurrent={Number(currentPokemonId) === getIdFromSpecies(child.species)}
                />
              </Link>
              <div className="evo-condition-multiline" title={parseEvolutionDetails(child.evolution_details)}>
                {parseEvolutionDetails(child.evolution_details)}
              </div>
              {child.evolves_to && child.evolves_to.length > 0 && (
                <EvolutionBranch node={child} currentPokemonId={currentPokemonId} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function collectLinearChain(node) {
  const chain = [node];
  let current = node;
  while (current.evolves_to && current.evolves_to.length === 1) {
    current = current.evolves_to[0];
    chain.push(current);
  }
  return chain;
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