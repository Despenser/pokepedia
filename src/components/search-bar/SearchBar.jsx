import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import usePokemonStore from '../../store/pokemonStore.js';
import SearchInput from '../shared/SearchInput.jsx';
import './SearchBar.css';

export const SearchBar = () => {
  const { searchQuery, searchPokemons, resetSearch } = usePokemonStore();
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const navigate = useNavigate();

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const handleChange = (val) => {
    setLocalSearchQuery(val);
    if (!val.trim()) {
      resetSearch();
    } else {
      searchPokemons(val.trim());
    }
  };

  const handleReset = () => {
    setLocalSearchQuery('');
    resetSearch();
  };

  return (
    <SearchInput
      value={localSearchQuery}
      onChange={handleChange}
      onReset={handleReset}
      placeholder="Поиск по имени или номеру"
      debounce={300}
      autoFocus={false}
    />
  );
};

