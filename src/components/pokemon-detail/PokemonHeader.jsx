import React, { memo } from 'react';
import { useParams } from 'react-router-dom';
import { formatPokemonId, formatPokemonName } from '../../utils/formatUtils';
import { getLocalPokemonImage } from '../../utils/imageUtils';

import { TypeBadge } from '../type-badge/TypeBadge';
import FavoritesButton from '../favorites/FavoritesButton';

/**
 * Компонент для отображения заголовка покемона
 */
const PokemonHeader = memo(({ pokemon }) => {
  const { id } = useParams();
  const pokemonId = pokemon?.id || id;
  const { src: imageUrl } = getLocalPokemonImage(pokemonId);

  // Получаем адаптивные размеры изображения для предотвращения layout shift
  const getImageSize = () => {
    if (window.innerWidth <= 576) return 200;
    if (window.innerWidth <= 768) return 240;
    return 300;
  };
  const [imgSize, setImgSize] = React.useState(getImageSize());
  React.useEffect(() => {
    const handleResize = () => setImgSize(getImageSize());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
            width={imgSize}
            height={imgSize}
            onError={e => { e.target.src = '/official-artwork/unknown.webp'; }}
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