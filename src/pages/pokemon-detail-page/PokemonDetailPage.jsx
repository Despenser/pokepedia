import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import usePokemonStore from '../../store/pokemonStore.js';
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
  formatWeight,
  getRussianDescription
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

  // Если данных нет и загрузка завершена, показываем ошибку
  if (!pokemon && !isLoading) {
    return <ErrorMessage message="Покемон не найден" code="404" />;
  }

  // Показываем ошибку только если она есть и загрузка завершена
  if (error && !isLoading) {
    const errorMessage = getUserFriendlyErrorMessage(error, 'POKEMON_LOAD');
    return <ErrorMessage message={errorMessage} code="404" />;
  }

  // Если покемон загружен, рендерим детали
  const background = getGradientByTypes(pokemon.types);
  // Проверяем наличие русского описания
  let description = null;
  if (species && species.flavor_text_entries) {
    const ruEntry = species.flavor_text_entries.find(
      (entry) => entry.language?.name === 'ru'
    );
    description = ruEntry ? ruEntry.flavor_text.replace(/\s+/g, ' ').replace(/[\n\r\u2028\u2029]+/g, ' ').trim() : null;
  }
  const imageUrl = getPokemonImage(pokemon.sprites, pokemon.id);
  const pokemonId = pokemon.id || id;

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
      }).catch(e => {
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

  return (
    <div className="pokemon-detail-page">
      <Header />

      <main className="detail-content">
        <div className="container">
          <button 
            className="back-button" 
            onClick={() => navigate(-1)}
          >
            ← Назад
          </button>

          <div className="pokemon-detail-card" style={{ background }}>
            <div className="pokemon-detail-header">
              <div className="pokemon-detail-info">
                <div className="pokemon-detail-title">
                  <h1 className="pokemon-detail-name">
                    {formatPokemonName(pokemon.name, pokemon.nameRu)}
                  </h1>
                  <FavoritesButton 
                    pokemonId={pokemonId} 
                    pokemonName={formatPokemonName(pokemon.name, pokemon.nameRu)} 
                  />
                </div>
                <div className="pokemon-detail-id">
                  {formatPokemonId(pokemonId)}
                </div>
                <div className="pokemon-detail-types">
                  {pokemon.types.map((typeInfo, index) => (
                    <TypeBadge key={index} type={typeInfo.type.name} large />
                  ))}
                </div>
              </div>

              <div className="pokemon-detail-image-container">
                <img 
                  src={imageUrl} 
                  alt={pokemon.nameRu || pokemon.name} 
                  className="pokemon-detail-image"
                  loading="eager"
                  fetchPriority="high"
                />
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
                <div className="attribute">
                  <span className="attribute-label">Высота:</span>
                  <span className="attribute-value">{formatHeight(pokemon.height)}</span>
                </div>
                <div className="attribute">
                  <span className="attribute-label">Вес:</span>
                  <span className="attribute-value">{formatWeight(pokemon.weight)}</span>
                </div>
                <div className="attribute">
                  <span className="attribute-label">Способности:</span>
                  <span className="attribute-value">
                    {isTranslatingAbilities ? (
                      <div className="description-skeleton" style={{width: '100%', maxWidth: 300}}>
                        <div className="skeleton-line"></div>
                        <div className="skeleton-line short"></div>
                      </div>
                    ) : (
                      pokemon.abilities.map((ability, index) => (
                        <span key={index} className="ability">
                          {translatedAbilities[index] || formatPokemonName(ability.ability.name)}
                          {ability.is_hidden && ' (скрытая)'}
                          {index < pokemon.abilities.length - 1 ? ', ' : ''}
                        </span>
                      ))
                    )}
                  </span>
                </div>
              </div>

              <PokemonStats stats={pokemon.stats} types={pokemon.types} />
            </div>
          </div>

          <div className="evolution-section">
            <h2>Эволюция</h2>
            {species && evolutionChain ? (
              <EvolutionTree 
                evolutionChain={evolutionChain}
                currentPokemonId={pokemon.id}
              />
            ) : (
              <div>Информация о цепочке эволюции недоступна</div>
            )}
          </div>

          <SimilarPokemons pokemonId={pokemonId} types={pokemon.types} />
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
