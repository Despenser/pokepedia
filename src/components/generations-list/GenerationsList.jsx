import { useEffect } from 'react';
import usePokemonStore from '../../store/pokemonStore.js';
import PokemonList from '../pokemon-list/PokemonList.jsx';
import {Loader} from '../loader/Loader.jsx';
import ErrorMessage from '../error-message/ErrorMessage.jsx';
import { getGenerationNameRu } from '../../utils/localizationUtils.js';
import './GenerationsList.css';

const GenerationsList = () => {
  const { 
    generations, 
    generationPokemons, 
    loading, 
    error, 
    fetchGenerations, 
    fetchPokemonsByGeneration,
    searchQuery,
    selectedType
  } = usePokemonStore();

  // Загрузка списка поколений при монтировании компонента
  useEffect(() => {
    if (generations.length === 0 && !searchQuery && !selectedType) {
      fetchGenerations();
    }
  }, [fetchGenerations, generations.length, searchQuery, selectedType]);

  // При поиске или выборе типа не показываем поколения
  if (searchQuery || selectedType) {
    return <PokemonList />;
  }

  if (error && generations.length === 0) {
    return <ErrorMessage message={error} />;
  }

  if (loading && generations.length === 0) {
    return <Loader />;
  }

  // Используем функцию из утилиты для локализации названий поколений
  const localizeGenerationName = getGenerationNameRu;

  return (
    <div className="generations-list">
      {generations.map(generation => {
        const generationId = generation.name;
        const genPokemons = generationPokemons[generationId] || [];
        const isLoaded = !!generationPokemons[generationId];

        return (
          <div key={generationId} className="generation-section">
            <h2 className="generation-title">{localizeGenerationName(generation.name)}</h2>

            {isLoaded ? (
              <div className="pokemon-grid">
                {genPokemons.map(pokemon => (
                  <div key={pokemon.id} className="pokemon-preview">
                    <img 
                      src={pokemon.sprites.other?.['official-artwork']?.front_default || 
                           `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`} 
                      alt={pokemon.nameRu || pokemon.name}
                      onError={(e) => {
                        e.target.onerror = null;
                      }}
                    />
                    <p>{pokemon.nameRu || (pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1))}</p>
                  </div>
                ))}
                <div className="view-all-button-container">
                  <button 
                    className="view-all-button"
                    onClick={() => {
                      const { setSelectedGeneration } = usePokemonStore.getState();
                      setSelectedGeneration(generationId);
                    }}
                  >
                    Показать всех покемонов
                  </button>
                </div>
              </div>
            ) : (
              <div className="load-generation-container">
                <button 
                  className="load-generation-button"
                  onClick={() => fetchPokemonsByGeneration(generationId)}
                  disabled={loading}
                >
                  {loading ? 'Загрузка...' : 'Загрузить покемонов'}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GenerationsList;
