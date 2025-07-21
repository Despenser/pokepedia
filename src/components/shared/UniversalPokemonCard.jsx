import React from 'react';
import usePokemonData from '../../hooks/usePokemonData';
import MiniPokemonCard from './MiniPokemonCard.jsx';
import PokemonCard from '../pokemon-card/PokemonCard.jsx';
import PokemonCardSkeleton from '../pokemon-card-skeleton/PokemonCardSkeleton.jsx';

/**
 * Универсальная карточка покемона для всех случаев (главная, эволюция, альтернативные формы, карусель)
 * @param {string|number} idOrName - id или имя покемона
 * @param {string} variant - 'main' | 'evolution' | 'alternative' | 'carousel'
 * @param {boolean} showBadges - показывать ли баджи типов (по умолчанию true для main/carousel)
 * @param {string} size - 'small' | 'medium' | 'large' (по умолчанию medium)
 * @param {string} className - дополнительные классы
 * @param {object} style - inline-стили
 */
const UniversalPokemonCard = ({
  idOrName,
  variant = 'main',
  showBadges,
  size = 'medium',
  className = '',
  style = {},
  ...rest
}) => {
  const { pokemon, loading, error } = usePokemonData(idOrName);

  // Определяем, показывать ли баджи типов
  const shouldShowBadges =
    typeof showBadges === 'boolean'
      ? showBadges
      : variant === 'main' || variant === 'carousel';

  // Скелетон
  if (loading || !pokemon) {
    if (variant === 'main' || variant === 'carousel') {
      return <PokemonCardSkeleton className={className} style={style} />;
    }
    // Для мини-карточек
    return <div className={`mini-pokemon-card mini-pokemon-card--${variant} ${className}`} style={style} />;
  }

  // Для главной и карусели — используем PokemonCard
  if (variant === 'main' || variant === 'carousel') {
    return (
      <PokemonCard
        pokemon={pokemon}
        showBadges={shouldShowBadges}
        size={size}
        className={className}
        style={style}
        {...rest}
      />
    );
  }

  // Для эволюции и альтернативных форм — MiniPokemonCard без баджей
  return (
    <MiniPokemonCard
      id={pokemon.id}
      name={pokemon.name}
      sprites={pokemon.sprites}
      types={pokemon.types}
      isCurrent={rest.isCurrent}
      variant={variant}
      className={className}
      style={style}
      {...rest}
    />
  );
};

export default UniversalPokemonCard; 