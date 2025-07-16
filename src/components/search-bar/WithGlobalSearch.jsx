import React from 'react';
import usePokemonStore from '../../store/pokemonStore.js';
import PokemonList from '../pokemon-list/PokemonList.jsx';

const WithGlobalSearch = ({ children }) => {
  const { searchQuery } = usePokemonStore();
  if (searchQuery) {
    return <PokemonList />;
  }
  return children;
};

export default WithGlobalSearch; 
