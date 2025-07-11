import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import { usePokemonData } from '../../hooks/usePokemonData.js';
import { Header } from '../../components/header/Header.jsx';
import { Footer } from '../../components/footer/Footer.jsx';
import { Loader } from '../../components/loader/Loader.jsx';
import { ErrorMessage } from '../../components/error-message/ErrorMessage.jsx';
import SimilarPokemons from '../../components/similar-pokemons/SimilarPokemons.jsx';
import BackButton from '../../components/pokemon-detail/BackButton.jsx';
import PokemonDetailCard from '../../components/pokemon-detail/PokemonDetailCard.jsx';
import EvolutionSection from '../../components/pokemon-detail/EvolutionSection.jsx';
import { getUserFriendlyErrorMessage } from '../../utils/errorHandlingUtils.js';
import './PokemonDetailPage.css';

// Компонент для отображения деталей покемона
const PokemonDetailInfo = ({ pokemon, species, evolutionChain, isLoading, error }) => {
  const { id } = useParams();
  const pokemonId = pokemon?.id || id;

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
      <main className="detail-content">
        <div className="container">
          <BackButton />
          
          <PokemonDetailCard pokemon={pokemon} species={species} />
          
          <EvolutionSection 
            species={species} 
            evolutionChain={evolutionChain} 
            pokemonId={pokemonId} 
          />
          
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