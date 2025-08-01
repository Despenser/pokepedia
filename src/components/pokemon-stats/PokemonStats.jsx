import React, { useEffect, useState } from 'react';
import { getColorByType } from '../../utils/colorUtils.js';
import { getStatNameRuAsync } from '../../utils/localizationUtils.js';
import StatBar from '../shared/StatBar.jsx';
import StatLabel from '../shared/StatLabel.jsx';
import StatValue from '../shared/StatValue.jsx';
import './PokemonStats.css';

const MAX_STATS = {
  'hp': 255,
  'attack': 190,
  'defense': 230,
  'special-attack': 194,
  'special-defense': 230,
  'speed': 180
};

const PokemonStats = ({ stats, types }) => {
  if (!stats || !types) return null;
  const mainColor = getColorByType(types[0]?.type.name);

  const [statNames, setStatNames] = useState({});
  useEffect(() => {
    let mounted = true;
    Promise.all(stats.map(stat => getStatNameRuAsync(stat.stat.name))).then(names => {
      if (mounted) {
        const namesMap = {};
        stats.forEach((stat, i) => { namesMap[stat.stat.name] = names[i]; });
        setStatNames(namesMap);
      }
    });
    return () => { mounted = false; };
  }, [stats]);

  return (
    <div className="pokemon-stats">
      <h2>Статистика покемона</h2>
      <div className="stats-container">
        {stats.map((stat) => {
          const statName = statNames[stat.stat.name] || stat.stat.name;
          const maxStat = MAX_STATS[stat.stat.name] || 100;
          const percentage = Math.min(100, (stat.base_stat / maxStat) * 100);
          return (
            <div key={stat.stat.name} className="stat-row">
              <StatLabel>{statName}</StatLabel>
              <StatValue>{stat.base_stat}</StatValue>
              <StatBar value={percentage} color={mainColor} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PokemonStats;
