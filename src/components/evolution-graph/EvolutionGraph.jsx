import React, { useMemo } from 'react';
import PokemonCard from '../pokemon-card/PokemonCard.jsx';
import './EvolutionGraph.css';
import { formatPokemonName } from '../../utils/formatUtils';

function parseEvolutionDetails(details) {
  if (!details || details.length === 0) return '—';
  const d = details[0];
  if (d.trigger?.name === 'level-up' && d.min_level) return `Уровень ${d.min_level}`;
  if (d.trigger?.name === 'use-item' && d.item) return `Предмет: ${formatPokemonName(d.item.name)}`;
  if (d.trigger?.name === 'trade') return 'Обмен';
  if (d.min_happiness) return 'Дружба';
  if (d.time_of_day && d.time_of_day !== '') return `Время суток: ${d.time_of_day}`;
  if (d.held_item) return `Держит: ${formatPokemonName(d.held_item.name)}`;
  if (d.known_move) return `Знает приём: ${formatPokemonName(d.known_move.name)}`;
  if (d.location) return `Локация: ${formatPokemonName(d.location.name)}`;
  if (d.gender === 1) return 'Только самка';
  if (d.gender === 2) return 'Только самец';
  return d.trigger?.name ? formatPokemonName(d.trigger.name) : '—';
}

function getIdFromSpecies(species) {
  return Number(species.url.split('/').filter(Boolean).pop());
}

const NODE_WIDTH = 110;
const NODE_HEIGHT = 120;
const H_GAP = 40;
const V_GAP = 18;
const PADDING = 16;

function buildEvolutionColumns(chain) {
  const columns = [];
  function traverse(node, depth = 0) {
    if (!columns[depth]) columns[depth] = [];
    const thisRow = columns[depth].length;
    columns[depth].push({ node, row: thisRow });
    if (node.evolves_to && node.evolves_to.length > 0) {
      node.evolves_to.forEach(child => traverse(child, depth + 1));
    }
  }
  traverse(chain);
  return columns;
}

function assignColumnPositions(columns) {
  const maxRows = Math.max(...columns.map(col => col.length));
  const height = Math.max(maxRows * (NODE_HEIGHT + V_GAP), 180);
  const nodeMap = new Map();
  columns.forEach((col, colIdx) => {
    const count = col.length;
    const totalHeight = height - NODE_HEIGHT;
    const colHeight = (count - 1) * (NODE_HEIGHT + V_GAP);
    const yOffset = PADDING + (totalHeight - colHeight) / 2;
    col.forEach((item, rowIdx) => {
      const x = PADDING + colIdx * (NODE_WIDTH + H_GAP);
      const y = yOffset + rowIdx * (NODE_HEIGHT + V_GAP);
      nodeMap.set(getIdFromSpecies(item.node.species), { node: item.node, x, y, col: colIdx, row: rowIdx });
    });
  });
  return { nodeMap, height, columns };
}

function getPokemonForCard(node) {
  return {
    id: getIdFromSpecies(node.species),
    name: node.species.name,
    sprites: {},
    types: node.types || [],
    nameRu: node.nameRu
  };
}

const EvolutionGraph = ({ evolutionChain, currentPokemonId }) => {
  const columns = useMemo(() => {
    if (!evolutionChain?.chain) return [];
    return buildEvolutionColumns(evolutionChain.chain);
  }, [evolutionChain]);

  const { nodeMap, height } = useMemo(() => {
    if (!columns.length) return { nodeMap: new Map(), height: 180 };
    return assignColumnPositions(columns);
  }, [columns]);

  // Стрелки: строго горизонтальные между уровнями
  const arrows = useMemo(() => {
    let arr = [];
    nodeMap.forEach(({ node, x, y }) => {
      (node.evolves_to || []).forEach(child => {
        const childId = getIdFromSpecies(child.species);
        const target = nodeMap.get(childId);
        if (target) {
                  const startX = x + NODE_WIDTH;
        const startY = y + NODE_HEIGHT / 2;
        const endX = target.x;
          arr.push({
            path: `M${startX},${startY} H${endX}`,
            labelX: (startX + endX) / 2 - 10,
            labelY: startY - 2,
            details: parseEvolutionDetails(child.evolution_details),
            width: Math.abs(endX - startX),
            height: 32,
            x: Math.min(startX, endX),
            y: startY - 24
          });
        }
      });
    });
    return arr;
  }, [nodeMap]);

  if (!evolutionChain?.chain) return null;

  const width = columns.length * (NODE_WIDTH + H_GAP) + PADDING * 2;

  return (
    <div className="evolution-graph-svg-root evolution-graph-wide" style={{ position: 'relative', overflowX: 'auto', minWidth: '100%', minHeight: 180 }}>
      <svg width={width} height={height} className="evolution-graph-svg" style={{ position: 'absolute', left: 0, top: 0, zIndex: 0 }}>
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto" markerUnits="strokeWidth">
            <polygon points="0 0, 10 3.5, 0 7" fill="#888" />
          </marker>
        </defs>
                {arrows.map((arrow, i) => {
          return (
            <g key={i}>
              <path d={arrow.path} stroke="#888" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
            </g>
          );
        })}
      </svg>
      <div style={{ position: 'relative', zIndex: 1, minWidth: width, minHeight: height, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
        <div style={{ position: 'relative', width, height, margin: '0 auto' }}>
          {[...nodeMap.values()].map(({ node, x, y }) => {
            const id = getIdFromSpecies(node.species);
            const isCurrent = Number(currentPokemonId) === id;
            return (
              <div
                key={id}
                className={`evolution-graph-card-wrapper mini${isCurrent ? ' current' : ''}`}
                style={{ position: 'absolute', left: x, top: y, width: NODE_WIDTH, height: NODE_HEIGHT, zIndex: isCurrent ? 2 : 1 }}
              >
                <PokemonCard pokemon={getPokemonForCard(node)} className="evolution-graph-card mini" asDiv={true} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EvolutionGraph; 