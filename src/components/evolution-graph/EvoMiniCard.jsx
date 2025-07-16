import React, { memo } from 'react';
import { getLocalPokemonImage } from '../../utils/imageUtils';
import { getGradientByTypes } from '../../utils/colorUtils';
import pokemonNamesRu from '../../assets/translate/pokemon-names-ru.json';

/**
 * Мини-карточка покемона для эволюционного дерева
 */
const EvoMiniCard = memo(React.forwardRef(({ id, name, sprites, types, isCurrent }, ref) => {
  const { src: imageUrl } = getLocalPokemonImage(id);
  const displayName = pokemonNamesRu[name] || name;
  const background = getGradientByTypes(types);
  
  // Получаем адаптивные размеры изображения для предотвращения layout shift
  const getImageSize = () => {
    if (window.innerWidth <= 776) return 48;
    if (window.innerWidth <= 1180) return 56;
    return 72;
  };
  const [imgSize, setImgSize] = React.useState(getImageSize());
  React.useEffect(() => {
    const handleResize = () => setImgSize(getImageSize());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div
      className={`evo-mini-card${isCurrent ? ' current' : ''}`}
      ref={ref}
      style={{ background }}
    >
      <img src={imageUrl} alt={displayName} className="evo-mini-img" loading="lazy" width={imgSize} height={imgSize} onError={e => { e.target.src = '/official-artwork/unknown.webp'; }} />
      <div className="evo-mini-name multi-line">{displayName}</div>
    </div>
  );
}));

EvoMiniCard.displayName = 'EvoMiniCard';

export default EvoMiniCard; 