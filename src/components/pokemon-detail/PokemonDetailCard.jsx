import React from 'react';
import { getGradientByTypes } from '../../utils/colorUtils';
import PokemonHeader from './PokemonHeader';
import PokemonDescription from './PokemonDescription';
import PokemonAttributes from './PokemonAttributes';
import PokemonStats from '../pokemon-stats/PokemonStats';

/**
 * Компонент для отображения основной карточки деталей покемона
 */
const PokemonDetailCard = ({ pokemon, species }) => {
  const background = getGradientByTypes(pokemon?.types || []);

  return (
    <div className="pokemon-detail-card" style={{ background }}>
      <PokemonHeader pokemon={pokemon} />
      
      <div className="pokemon-detail-body">
        <PokemonDescription species={species} />
        <PokemonAttributes pokemon={pokemon} />
        <PokemonStats stats={pokemon?.stats} types={pokemon?.types} />
      </div>
    </div>
  );
};

export default PokemonDetailCard; 