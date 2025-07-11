import React from 'react';
import { getPokemonImage, getFallbackImage } from '../../utils/imageUtils';
import { getGradientByTypes } from '../../utils/colorUtils';
import pokemonNamesRu from '../../assets/translate/pokemon-names-ru.json';

/**
 * Мини-карточка покемона для эволюционного дерева
 */
const EvoMiniCard = React.forwardRef(({ id, name, sprites, types, isCurrent }, ref) => {
  const imageUrl = getPokemonImage(sprites, id) || getFallbackImage(id);
  const displayName = pokemonNamesRu[name] || name;
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

EvoMiniCard.displayName = 'EvoMiniCard';

export default EvoMiniCard; 