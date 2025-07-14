import React, { memo } from 'react';
import { useParams } from 'react-router-dom';
import { formatPokemonId, formatPokemonName } from '../../utils/formatUtils';
import { getPokemonImage } from '../../utils/imageUtils';

import { TypeBadge } from '../type-badge/TypeBadge';
import FavoritesButton from '../favorites/FavoritesButton';

/**
 * Компонент для отображения заголовка покемона
 */
const PokemonHeader = memo(({ pokemon }) => {
  const { id } = useParams();
  const pokemonId = pokemon?.id || id;
  const imageUrl = getPokemonImage(pokemon?.sprites, pokemon?.id);

  return (
    <div className="pokemon-detail-header">
      <div className="pokemon-detail-info">
        <div className="pokemon-detail-id">
          {formatPokemonId(pokemonId)}
        </div>
        <div className="pokemon-detail-title">
          <h1 className="pokemon-detail-name">
            {formatPokemonName(pokemon?.name, pokemon?.nameRu)}
          </h1>
          <FavoritesButton 
            pokemonId={pokemonId} 
            pokemonName={formatPokemonName(pokemon?.name, pokemon?.nameRu)} 
          />
        </div>
        <div className="pokemon-detail-types pokemon-detail-types--info">
          {pokemon?.types?.map((typeInfo, index) => (
            <TypeBadge key={index} type={typeInfo.type.name} large />
          ))}
        </div>
      </div>

      <div className="pokemon-detail-image-row">
        <div className="pokemon-detail-image-container">
          <img 
            src={imageUrl} 
            alt={pokemon?.nameRu || pokemon?.name} 
            className="pokemon-detail-image"
            loading="lazy"
          />
        </div>
        <div className="pokemon-detail-types pokemon-detail-types--image">
          {pokemon?.types?.map((typeInfo, index) => (
            <TypeBadge key={index} type={typeInfo.type.name} large />
          ))}
        </div>
      </div>
    </div>
  );
});

export default PokemonHeader; 