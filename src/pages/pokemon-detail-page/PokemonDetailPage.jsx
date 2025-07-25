import React, { Suspense, lazy, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { usePokemonData } from '../../hooks/usePokemonData.js';
import { Header } from '../../components/header/Header.jsx';
import { Footer } from '../../components/footer/Footer.jsx';
import { Loader } from '../../components/loader/Loader.jsx';
import { ErrorMessage } from '../../components/error-message/ErrorMessage.jsx';
import BackButton from '../../components/pokemon-detail/BackButton.jsx';
import { getUserFriendlyErrorMessage } from '../../utils/errorHandlingUtils.js';
import './PokemonDetailPage.css';
import usePokemonStore from '../../store/pokemonStore.js';
import PokemonList from '../../components/pokemon-list/PokemonList.jsx';
import WithGlobalSearch from '../../components/search-bar/WithGlobalSearch.jsx';

// Компонент для отображения деталей покемона
const PokemonDetailCard = React.lazy(() => import('../../components/pokemon-detail/PokemonDetailCard.jsx'));
const EvolutionSection = React.lazy(() => import('../../components/pokemon-detail/EvolutionSection.jsx'));
const AlternativeForms = React.lazy(() => import('../../components/pokemon-detail/AlternativeForms.jsx'));
const SimilarPokemons = React.lazy(() => import('../../components/similar-pokemons/SimilarPokemons.jsx'));

const PokemonDetailInfo = ({ pokemon, species, evolutionChain, isLoading, error }) => {
  const { id } = useParams();
  const pokemonId = pokemon?.id || id;
  const { searchQuery } = usePokemonStore();

  // Получаем имена альтернативных форм для исключения из похожих
  const alternativeFormNames = (species?.varieties || [])
    .filter(v => !v.is_default && v.pokemon.name !== pokemon?.name)
    .map(v => v.pokemon.name);

  if (searchQuery) {
    return (
      <div className="pokemon-detail-page">
        <main className="page-main">
          <div className="container">
            <PokemonList />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Если данных нет и загрузка завершена, показываем ошибку
  if (!pokemon && !isLoading) {
    return <ErrorMessage error={new Error('Покемон не найден')} code="404" />;
  }

  // Показываем ошибку только если она есть и загрузка завершена
  if (error && !isLoading) {
    return <ErrorMessage error={error} code="404" />;
  }

  return (
    <div className="pokemon-detail-page">
      <main className="page-main">
        <div className="container">
          <WithGlobalSearch>
            <BackButton />
            <Suspense fallback={null}>
              <PokemonDetailCard pokemon={pokemon} species={species} />
            </Suspense>
            <Suspense fallback={null}>
              <EvolutionSection 
                species={species} 
                evolutionChain={evolutionChain} 
                pokemonId={pokemonId} 
              />
            </Suspense>
            <Suspense fallback={null}>
              <AlternativeForms species={species} pokemon={pokemon} />
            </Suspense>
            <Suspense fallback={null}>
              <SimilarPokemons pokemonId={pokemonId} types={pokemon?.types} excludeNames={alternativeFormNames} />
            </Suspense>
          </WithGlobalSearch>
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
