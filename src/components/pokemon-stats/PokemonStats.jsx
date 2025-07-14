import React from 'react';
import { getColorByType } from '../../utils/colorUtils.js';
import { getStatNameRu } from '../../utils/localizationUtils.js';
import './PokemonStats.css';

const PokemonStats = ({ stats, types }) => {
  if (!stats || !types) return null;

  // Получаем основной цвет из первого типа покемона
  const mainColor = getColorByType(types[0]?.type.name);

  // Максимальные значения статов для визуализации
  const maxStats = {
    'hp': 255,
    'attack': 190,
    'defense': 230,
    'special-attack': 194,
    'special-defense': 230,
    'speed': 180
  };

  return (
    <div className="pokemon-stats">
      <h3>Характеристики</h3>

      <div className="stats-container">
        {stats.map((stat) => {
          const statName = getStatNameRu(stat.stat.name);
          const maxStat = maxStats[stat.stat.name] || 100;
          const percentage = Math.min(100, (stat.base_stat / maxStat) * 100);

          return (
            <div key={stat.stat.name} className="stat-row">
              <div className="stat-name">{statName}</div>
              <div className="stat-value">{stat.base_stat}</div>
              <div className="stat-bar-container">
                <div 
                  className="stat-bar" 
                  style={{ 
                    width: `${percentage}%`, 
                    backgroundColor: mainColor
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PokemonStats;
