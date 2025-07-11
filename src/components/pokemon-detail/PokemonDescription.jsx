import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { getRussianDescription, getEnglishDescription, isSpeciesInfoAvailable } from '../../utils/speciesUtils';

/**
 * Компонент для отображения описания покемона
 */
const PokemonDescription = ({ species }) => {
  const russianDescription = getRussianDescription(species);
  const englishDescription = getEnglishDescription(species);
  
  const { translatedText: translatedDescription, isTranslating } = useTranslation(
    !russianDescription ? englishDescription : null
  );

  // Если информация о виде недоступна
  if (!isSpeciesInfoAvailable(species)) {
    return (
      <div className="pokemon-description">
        <h3>Описание</h3>
        <p>Информация отсутствует для этой формы покемона</p>
      </div>
    );
  }

  // Если есть русское описание
  if (russianDescription) {
    return (
      <div className="pokemon-description">
        <h3>Описание</h3>
        <p>{russianDescription}</p>
      </div>
    );
  }

  // Если есть переведенное описание
  if (translatedDescription) {
    return (
      <div className="pokemon-description">
        <h3>Описание</h3>
        <p>{translatedDescription}</p>
      </div>
    );
  }

  // Если идет перевод
  if (isTranslating) {
    return (
      <div className="pokemon-description">
        <h3>Описание</h3>
        <p>Переводим описание...</p>
      </div>
    );
  }

  // Скелетон загрузки
  return (
    <div className="pokemon-description">
      <h3>Описание</h3>
      <div className="description-skeleton">
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line short"></div>
      </div>
    </div>
  );
};

export default PokemonDescription; 