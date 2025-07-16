import React from 'react';
import { Footer } from '../components/footer/Footer.jsx';
import LegendaryContent from '../components/legendary/LegendaryContent.jsx';
import { useLegendaryPokemons } from '../hooks/useLegendaryPokemons.js';
import usePokemonStore from '../store/pokemonStore.js';
import PokemonList from '../components/pokemon-list/PokemonList.jsx';
import './LegendaryPage.css';
import WithGlobalSearch from '../components/search-bar/WithGlobalSearch.jsx';

const LegendaryPage = () => {
  const { grouped, isLoading, error } = useLegendaryPokemons();
  const { searchQuery } = usePokemonStore();

  if (searchQuery) {
    return (
      <div className="favorites-page">
        <main className="main-content">
          <div className="container">
            <PokemonList />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <main className="main-content">
        <div className="container">
          <WithGlobalSearch>
            <h1 className="favorites-title">Легендарные покемоны</h1>
            <LegendaryContent 
              grouped={grouped} 
              isLoading={isLoading} 
              error={error} 
            />
          </WithGlobalSearch>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LegendaryPage; 