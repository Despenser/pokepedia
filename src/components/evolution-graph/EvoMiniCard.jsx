import React, { memo } from 'react';
import { getLocalPokemonImage } from '../../utils/imageUtils';
import { getGradientByTypes } from '../../utils/colorUtils';
import pokemonNamesRu from '../../assets/translate/pokemon-names-ru.json';

/**
 * Мини-карточка покемона для эволюционного дерева
 */
const EvoMiniCard = memo(React.forwardRef(({ id, name, sprites, types, isCurrent }, ref) => {
  const imageUrl = `/official-artwork/${id}-72.webp`;
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
      <img src={imageUrl} alt={displayName} className="evo-mini-img" loading="lazy" width={imgSize} height={imgSize} onError={e => { e.target.src = '/official-artwork/unknown.webp'; }} 
        srcSet={`/official-artwork/${id}-56.webp 56w, /official-artwork/${id}-72.webp 72w, /official-artwork/${id}-90.webp 90w, /official-artwork/${id}-120.webp 120w, /official-artwork/${id}-150.webp 150w`}
        sizes="(max-width: 776px) 56px, (max-width: 1180px) 72px, (max-width: 1400px) 90px, (max-width: 1800px) 120px, 150px"
      />
      <div className="evo-mini-name multi-line">{displayName}</div>
    </div>
  );
}));

EvoMiniCard.displayName = 'EvoMiniCard';

export default EvoMiniCard; 