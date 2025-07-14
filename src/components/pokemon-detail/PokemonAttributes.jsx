import React, { useMemo, memo } from 'react';
import { formatHeight, formatWeight, formatPokemonName } from '../../utils/formatUtils';
import { useBatchTranslation } from '../../hooks/useTranslation';

/**
 * Компонент для отображения атрибутов покемона (рост, вес, способности)
 */
const PokemonAttributes = memo(({ pokemon }) => {
  // abilities мемоизирован для стабильности зависимостей
  const abilities = useMemo(() => pokemon?.abilities || [], [pokemon?.abilities]);
  const abilityNames = useMemo(
    () => abilities.map(ability => ability.ability.name),
    [abilities]
  );
  const { translatedTexts: translatedAbilities, isTranslating: isTranslatingAbilities } = useBatchTranslation(abilityNames);

  return (
    <div className="pokemon-attributes">
      <div className="attribute height-attribute">
        <div className="attribute-header">
          <svg className="attribute-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L5 9h4v8h6V9h4z"/>
          </svg>
          <span className="attribute-label">Рост</span>
        </div>
        <span className="attribute-value">{formatHeight(pokemon?.height)}</span>
      </div>
      
      <div className="attribute weight-attribute">
        <div className="attribute-header">
          <svg className="attribute-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 8a4 4 0 0 1 8 0"/>
            <circle cx="12" cy="15" r="7"/>
          </svg>
          <span className="attribute-label">Вес</span>
        </div>
        <span className="attribute-value">{formatWeight(pokemon?.weight)}</span>
      </div>
      
      <div className="attribute abilities-attribute">
        <div className="attribute-header">
          <svg className="attribute-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 2v2"/>
            <path d="M12 20v2"/>
            <path d="M2 12h2"/>
            <path d="M20 12h2"/>
            <path d="M4.93 4.93l1.41 1.41"/>
            <path d="M17.66 17.66l1.41 1.41"/>
            <path d="M4.93 19.07l1.41-1.41"/>
            <path d="M17.66 6.34l1.41-1.41"/>
          </svg>
          <span className="attribute-label">Способности</span>
        </div>
        <div className="attribute-value">
          {isTranslatingAbilities ? (
            <div className="description-skeleton" style={{width: '100%', maxWidth: 300}}>
              <div className="skeleton-line"></div>
              <div className="skeleton-line short"></div>
            </div>
          ) : (
            <ul className="abilities-list">
              {abilities.map((ability, index) => (
                <li key={index} className="ability-item">
                  <span className="ability-name">
                    {translatedAbilities[index] || formatPokemonName(ability.ability.name)}
                    {ability.is_hidden && <span className="hidden-ability"> (скрытая)</span>}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
});

export default PokemonAttributes; 