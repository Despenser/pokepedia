import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getGradientByTypes } from '../../utils/colorUtils.js';
import { formatPokemonId, formatPokemonName } from '../../utils/formatUtils.js';
import { getPokemonImage, getFallbackImage } from '../../utils/imageUtils.js';
import TypeBadge from '../type-badge/TypeBadge.jsx';
import './PokemonCard.css';

const PokemonCard = ({ pokemon }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!pokemon) return null;

  const { id, name, types, sprites } = pokemon;
  const background = getGradientByTypes(types);
  const imageUrl = getPokemonImage(sprites, id);

  const handleImageLoad = () => {
    // Короткая задержка для плавного появления
    setTimeout(() => setImageLoaded(true), 50);
  };

  const handleImageError = (e) => {
    // При ошибке загрузки показываем хотя бы контейнер и пробуем запасное изображение
    setImageLoaded(true);
    e.target.onerror = null;
    e.target.src = getFallbackImage(id);
  };

  return (
    <Link to={`/pokemon/${id}`} className="pokemon-card-link">
      <div 
        className={`pokemon-card ${imageLoaded ? 'loaded' : ''}`}
        style={{ background }}
      >
        <div className="pokemon-card-content">
          <div className="pokemon-card-header">
            <h2 className="pokemon-name">{formatPokemonName(name, pokemon.nameRu)}</h2>
            <span className="pokemon-id">{formatPokemonId(id)}</span>
          </div>

          <div className="pokemon-image-container">
            {!imageLoaded && <div className="pokemon-image-skeleton"></div>}
            <img
              src={imageUrl}
              alt={pokemon.nameRu || name}
              className="pokemon-image"
              style={{ display: imageLoaded ? 'block' : 'none' }}
              loading="eager"
              fetchPriority="high"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>

          <div className="pokemon-types">
            {types?.map((typeInfo, index) => (
              <TypeBadge key={index} type={typeInfo.type.name} />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PokemonCard;
