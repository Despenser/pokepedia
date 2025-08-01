import React from 'react';

/**
 * Компонент для отрисовки стрелок между элементами эволюции
 */
const EvolutionArrows = ({ arrowData }) => {
  return (
    <svg 
      className="evo-branch-arrows-svg" 
      style={{ 
        position: 'absolute', 
        left: 0, 
        top: 0, 
        width: '100%', 
        height: '100%', 
        pointerEvents: 'none', 
        zIndex: 2 
      }}
    >
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
  );
};

export default EvolutionArrows; 