import React, { memo, useState, useEffect, forwardRef } from 'react';
import { getLocalPokemonImage } from '../../utils/imageUtils';
import { getGradientByTypes, getContrastTextColor, getContrastTextColorOnTypeGradient } from '../../utils/colorUtils';
import { getPokemonNameRu } from '../../utils/localizationUtils';
import './MiniPokemonCard.css';

/**
 * Универсальная мини-карточка покемона для эволюции и альтернативных форм
 * @param {number} id - id покемона
 * @param {string} name - имя покемона
 * @param {object} sprites - спрайты
 * @param {array} types - типы
 * @param {boolean} isCurrent - выделять ли как текущего
 * @param {string} [variant] - 'evolution' | 'alternative'
 * @param {string} [className] - дополнительные классы
 */
const MiniPokemonCard = memo(forwardRef(({
  id,
  name,
  sprites = {},
  types = [],
  isCurrent = false,
  variant = 'evolution',
  className = '',
}, ref) => {
  const [displayName, setDisplayName] = useState(name);
  useEffect(() => {
    let mounted = true;
    getPokemonNameRu(name).then(res => {
      if (mounted && res) setDisplayName(res);
    });
    return () => { mounted = false; };
  }, [name]);
  const background = getGradientByTypes(types);
  // Определяем позицию и направление градиента для имени
  let textColor;
  if (variant === 'evolution' || variant === 'alternative') {
    textColor = getContrastTextColorOnTypeGradient(types, 'end', 'vertical');
  } else {
    textColor = getContrastTextColorOnTypeGradient(types, 'start', 'horizontal');
  }
  // Размеры по варианту
  const sizeMap = {
    evolution: { img: 72, card: 110 },
    alternative: { img: 100, card: 160 },
  };
  const sizes = sizeMap[variant] || sizeMap.evolution;
  // Адаптивный размер
  const getImageSize = () => {
    if (window.innerWidth <= 600) return Math.round(sizes.img * 0.6);
    if (window.innerWidth <= 900) return Math.round(sizes.img * 0.8);
    return sizes.img;
  };
  const [imgSize, setImgSize] = useState(getImageSize());
  useEffect(() => {
    const handleResize = () => setImgSize(getImageSize());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <div
      className={`mini-pokemon-card mini-pokemon-card--${variant}${isCurrent ? ' current' : ''}${className ? ' ' + className : ''}`.trim()}
      ref={ref}
      style={{ background, maxWidth: sizes.card, minWidth: sizes.card + 25 }}
    >
      <img
        src={`/official-artwork/${id}-150.webp`}
        alt={displayName}
        className="mini-pokemon-img"
        loading="lazy"
        onError={e => { e.target.src = '/official-artwork/unknown.webp'; }}
        srcSet={`/official-artwork/${id}-72.webp 72w, /official-artwork/${id}-90.webp 90w, /official-artwork/${id}-120.webp 120w, /official-artwork/${id}-150.webp 150w, /official-artwork/${id}-200.webp 200w`}
        sizes="(max-width: 600px) 110px, (max-width: 900px) 130px, 160px"
      />
      <div className="mini-pokemon-name multi-line" style={{ color: textColor }}>{displayName}</div>
    </div>
  );
}));

MiniPokemonCard.displayName = 'MiniPokemonCard';

export default MiniPokemonCard; 