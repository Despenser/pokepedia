import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import {usePokemonData} from '../../hooks/usePokemonData.js';
import FavoritesButton from '../../components/favorites/FavoritesButton.jsx';
import {Header} from '../../components/header/Header.jsx';
import {Footer} from '../../components/footer/Footer.jsx';
import {Loader} from '../../components/loader/Loader.jsx';
import {ErrorMessage} from '../../components/error-message/ErrorMessage.jsx';
import {TypeBadge} from '../../components/type-badge/TypeBadge.jsx';
import PokemonStats from '../../components/pokemon-stats/PokemonStats.jsx';
import SimilarPokemons from '../../components/similar-pokemons/SimilarPokemons.jsx';
import EvolutionTree from '../../components/evolution-graph/EvolutionTree.jsx';
import { getGradientByTypes } from '../../utils/colorUtils.js';
import { getUserFriendlyErrorMessage } from '../../utils/errorHandlingUtils.js';
import { 
  formatPokemonId, 
  formatPokemonName, 
  formatHeight, 
  formatWeight
} from '../../utils/formatUtils.js';
import { getPokemonImage } from '../../utils/imageUtils.js';
import { translateText } from '../../utils/localizationUtils.js';
import './PokemonDetailPage.css';

// Общий компонент для отображения деталей покемона
export const PokemonDetailInfo = ({ pokemon, species, evolutionChain, isLoading, error }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Состояние для перевода описания
  const [translatedDescription, setTranslatedDescription] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);

  // Состояние для перевода способностей
  const [translatedAbilities, setTranslatedAbilities] = useState([]);
  const [isTranslatingAbilities, setIsTranslatingAbilities] = useState(false);

  // Проверяем наличие русского описания
  let description = null;
  if (species && species.flavor_text_entries) {
    const ruEntry = species.flavor_text_entries.find(
      (entry) => entry.language?.name === 'ru'
    );
    description = ruEntry ? ruEntry.flavor_text.replace(/\s+/g, ' ').replace(/[\n\r\u2028\u2029]+/g, ' ').trim() : null;
  }
  // Получаем английское описание, если русского нет
  let englishDescription = null;
  if (species && species.flavor_text_entries) {
    const enEntry = species.flavor_text_entries.find(
      (entry) => entry.language?.name === 'en'
    );
    englishDescription = enEntry ? enEntry.flavor_text.replace(/\s+/g, ' ').replace(/[\n\r\u2028\u2029]+/g, ' ').trim() : null;
  }

  // Переводим описание, если русского нет
  useEffect(() => {
    let ignore = false;
    if (!description && englishDescription) {
      setIsTranslating(true);
      translateText(englishDescription, 'ru', 'en').then(translated => {
        if (!ignore) {
          setTranslatedDescription(translated);
          setIsTranslating(false);
        }
      }).catch(() => {
        // Игнорируем ошибки перевода
      });
    } else {
      setTranslatedDescription(null);
      setIsTranslating(false);
    }
    return () => { ignore = true; };
  }, [description, englishDescription]);

  // Переводим способности
  useEffect(() => {
    let ignore = false;
    if (pokemon && pokemon.abilities && pokemon.abilities.length > 0) {
      setIsTranslatingAbilities(true);
      Promise.all(
        pokemon.abilities.map(abilityObj =>
          translateText(abilityObj.ability.name, 'ru', 'en')
        )
      ).then(translatedArr => {
        if (!ignore) {
          setTranslatedAbilities(translatedArr);
          setIsTranslatingAbilities(false);
        }
      }).catch(e => {
        console.error('Ошибка при переводе способностей:', e);
        setIsTranslatingAbilities(false);
      });
    } else {
      setTranslatedAbilities([]);
      setIsTranslatingAbilities(false);
    }
    return () => { ignore = true; };
  }, [pokemon]);

  // Если данных нет и загрузка завершена, показываем ошибку
  if (!pokemon && !isLoading) {
    return <ErrorMessage error={new Error('Покемон не найден')} code="404" />;
  }

  // Показываем ошибку только если она есть и загрузка завершена
  if (error && !isLoading) {
    return <ErrorMessage error={error} code="404" />;
  }

  // Если покемон загружен, рендерим детали
  const background = getGradientByTypes(pokemon?.types || []);
  const imageUrl = getPokemonImage(pokemon?.sprites, pokemon?.id);
  const pokemonId = pokemon?.id || id;

  return (
    <div className="pokemon-detail-page">
      <main className="detail-content">
        <div className="container">
          <button 
            className="back-button" 
            onClick={() => navigate(-1)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: 8, verticalAlign: 'middle'}}>
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            Назад
          </button>

          <div className="pokemon-detail-card" style={{ background }}>
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
                    loading="eager"
                    fetchPriority="high"
                  />
                </div>
                <div className="pokemon-detail-types pokemon-detail-types--image">
                  {pokemon?.types?.map((typeInfo, index) => (
                    <TypeBadge key={index} type={typeInfo.type.name} large />
                  ))}
                </div>
              </div>
            </div>

            <div className="pokemon-detail-body">
              {species === null ? (
                <div className="pokemon-description">
                  <h3>Описание</h3>
                  <p>Информация отсутствует для этой формы покемона</p>
                </div>
              ) : (description || translatedDescription ? (
                <div className="pokemon-description">
                  <h3>Описание</h3>
                  {description && <p>{description}</p>}
                  {!description && isTranslating && <p>Переводим описание...</p>}
                  {!description && !isTranslating && translatedDescription && <p>{translatedDescription}</p>}
                </div>
              ) : (
                <div className="pokemon-description">
                  <h3>Описание</h3>
                  <div className="description-skeleton">
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line short"></div>
                  </div>
                </div>
              ))}

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
                        {pokemon?.abilities?.map((ability, index) => (
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

              <PokemonStats stats={pokemon?.stats} types={pokemon?.types} />
            </div>
          </div>

          <div className="evolution-section">
            <h2>Эволюция</h2>
            {species && evolutionChain ? (
              <EvolutionTree 
                evolutionChain={evolutionChain}
                currentPokemonId={pokemon?.id}
              />
            ) : (
              <div>Информация о цепочке эволюции недоступна</div>
            )}
          </div>

          <SimilarPokemons pokemonId={pokemonId} types={pokemon?.types} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Компонент с использованием хука
const PokemonDetailWithHook = () => {
  const { id } = useParams();
  const { pokemon, species, evolutionChain, isLoading, error } = usePokemonData(id);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsInitialLoad(true);

    // После завершения загрузки сбрасываем флаг
    if (!isLoading) {
      setIsInitialLoad(false);
    }
  }, [id, isLoading]);

  // Во время первой загрузки показываем только индикатор загрузки
  if (isInitialLoad || isLoading) {
    return <Loader />;
  }

  return (
    <PokemonDetailInfo 
      pokemon={pokemon} 
      species={species} 
      evolutionChain={evolutionChain} 
      error={error} 
      isLoading={isLoading} 
    />
  );
};

const PokemonDetailPage = () => {
  return (
    <ErrorBoundary 
      FallbackComponent={({ error }) => (
        <div className="error-page">
          <Header />
          <ErrorMessage 
            message={getUserFriendlyErrorMessage(error, 'SERVER')} 
            code="500" 
          />
          <Footer />
        </div>
      )}
    >
      <PokemonDetailWithHook />
    </ErrorBoundary>
  );
};

export default PokemonDetailPage;