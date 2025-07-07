import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import usePokemonStore from '../../store/pokemonStore.js';
import usePokemonData from '../../hooks/usePokemonData.js';
import FavoritesButton from '../../components/favorites/FavoritesButton.jsx';
import {Header} from '../../components/header/Header.jsx';
import {Footer} from '../../components/footer/Footer.jsx';
import {Loader} from '../../components/loader/Loader.jsx';
import {ErrorMessage} from '../../components/error-message/ErrorMessage.jsx';
import TypeBadge from '../../components/type-badge/TypeBadge.jsx';
import PokemonStats from '../../components/pokemon-stats/PokemonStats.jsx';
import {EvolutionChain} from '../../components/evolution-chain/EvolutionChain.jsx';
import SimilarPokemons from '../../components/similar-pokemons/SimilarPokemons.jsx';
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
import './PokemonDetailPage.css';

  export const PokemonDetailContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    pokemonDetails, 
    species, 
    evolutionChain,
    loading, 
    error, 
    fetchPokemonDetails,
    clearSelectedPokemon
  } = usePokemonStore();

  // Используем состояние, чтобы отслеживать первую загрузку
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Устанавливаем флаг начальной загрузки
    setIsInitialLoad(true);

    // Загружаем данные покемона
    fetchPokemonDetails(id).then(() => {
      // После завершения загрузки сбрасываем флаг
      setIsInitialLoad(false);
    });

    // Очистка при размонтировании
    return () => {
      clearSelectedPokemon();
    };
  }, [id, fetchPokemonDetails, clearSelectedPokemon]);

  // Во время первой загрузки показываем только индикатор загрузки
  if (isInitialLoad || loading) {
    return <Loader />;
  }

  // Показываем ошибку только если она есть и загрузка завершена
  if (error && !loading) {
    return <ErrorMessage message={error} code="404" />;
  }

  // Показываем ошибку отсутствия покемона только если нет данных и загрузка завершена
  if (!pokemonDetails && !loading) {
    return <ErrorMessage message="Покемон не найден" code="404" />;
  }

  const background = getGradientByTypes(pokemonDetails.types);
  const description = getRussianDescription(species);
  const imageUrl = getPokemonImage(pokemonDetails.sprites, pokemonDetails.id);

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
                <h1 className="pokemon-detail-name">
                  {formatPokemonName(pokemonDetails.name, pokemonDetails.nameRu)}
                </h1>
                <div className="pokemon-detail-id">
                  {formatPokemonId(pokemonDetails.id)}
                </div>
                <div className="pokemon-detail-types">
                  {pokemonDetails.types.map((typeInfo, index) => (
                    <TypeBadge key={index} type={typeInfo.type.name} large />
                  ))}
                </div>
              </div>

              <div className="pokemon-detail-image-container">
                <img 
                  src={imageUrl} 
                  alt={pokemonDetails.nameRu || pokemonDetails.name} 
                  className="pokemon-detail-image"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
            </div>

            <div className="pokemon-detail-body">
              {description && (
                <div className="pokemon-description">
                  <h3>Описание</h3>
                  <p>{description}</p>
                </div>
              )}

              <div className="pokemon-attributes">
                <div className="attribute">
                  <span className="attribute-label">Высота:</span>
                  <span className="attribute-value">{formatHeight(pokemonDetails.height)}</span>
                </div>
                <div className="attribute">
                  <span className="attribute-label">Вес:</span>
                  <span className="attribute-value">{formatWeight(pokemonDetails.weight)}</span>
                </div>
                <div className="attribute">
                  <span className="attribute-label">Способности:</span>
                  <span className="attribute-value">
                    {pokemonDetails.abilities.map((ability, index) => (
                      <span key={index} className="ability">
                        {formatPokemonName(ability.ability.name)}
                        {ability.is_hidden && ' (скрытая)'}
                        {index < pokemonDetails.abilities.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </span>
                </div>
              </div>

              <PokemonStats stats={pokemonDetails.stats} types={pokemonDetails.types} />
            </div>
          </div>

          <div className="evolution-section">
            <h2>Эволюция</h2>
            <EvolutionChain evolutionChain={evolutionChain} />
          </div>

          <SimilarPokemons pokemonId={id} types={pokemonDetails.types} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Альтернативная версия с использованием хука usePokemonData
export const PokemonDetailWithHook = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Используем хук для загрузки данных о покемоне
  const { pokemon, species, isLoading, error, refetch } = usePokemonData(id);

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

  // Показываем ошибку только если она есть и загрузка завершена
  if (error && !isLoading) {
    const errorMessage = getUserFriendlyErrorMessage(error, 'POKEMON_LOAD');
    return <ErrorMessage message={errorMessage} code="404" />;
  }

  // Показываем ошибку отсутствия покемона только если нет данных и загрузка завершена
  if (!pokemon && !isLoading) {
    return <ErrorMessage message="Покемон не найден" code="404" />;
  }

  const background = getGradientByTypes(pokemon.types);
  const description = getRussianDescription(species);
  const imageUrl = getPokemonImage(pokemon.sprites, pokemon.id);

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
                    pokemonId={pokemon.id} 
                    pokemonName={formatPokemonName(pokemon.name, pokemon.nameRu)} 
                  />
                </div>
                <div className="pokemon-detail-id">
                  {formatPokemonId(pokemon.id)}
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
              {description && (
                <div className="pokemon-description">
                  <h3>Описание</h3>
                  <p>{description}</p>
                </div>
              )}

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
                    {pokemon.abilities.map((ability, index) => (
                      <span key={index} className="ability">
                        {formatPokemonName(ability.ability.name)}
                        {ability.is_hidden && ' (скрытая)'}
                        {index < pokemon.abilities.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </span>
                </div>
              </div>

              <PokemonStats stats={pokemon.stats} types={pokemon.types} />
            </div>
          </div>

          <div className="evolution-section">
            <h2>Эволюция</h2>
            <EvolutionChain species={species} />
          </div>

          <SimilarPokemons pokemonId={id} types={pokemon.types} />
        </div>
      </main>

      <Footer />
    </div>
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
      {/* Вы можете выбрать, какую версию использовать: */}
      {/* <PokemonDetailContent /> */}
      <PokemonDetailWithHook />
    </ErrorBoundary>
  );
};

export default PokemonDetailPage;
