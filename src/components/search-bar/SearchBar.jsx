import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import usePokemonStore from '../../store/pokemonStore.js';
import './SearchBar.css';

console.log('SearchBar rendered');

export const SearchBar = () => {
  const { searchQuery, searchPokemons, resetSearch } = usePokemonStore();
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const navigate = useNavigate();

  // Синхронизация с глобальным состоянием
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Динамический поиск при изменении значения в поле ввода
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearchQuery.trim() !== searchQuery) {
        if (!localSearchQuery.trim()) {
          resetSearch();
          // navigate('/'); // убираем переход
        } else {
          searchPokemons(localSearchQuery.trim());
          navigate('/');
        }
      }
    }, 300); // Задержка в 300мс для предотвращения частых запросов

    return () => clearTimeout(handler);
  }, [localSearchQuery, searchQuery, searchPokemons, resetSearch, navigate]);

  const handleReset = () => {
    setLocalSearchQuery('');
    resetSearch();
    // navigate('/'); // убираем переход
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Поиск по имени или номеру"
        value={localSearchQuery}
        onChange={(e) => setLocalSearchQuery(e.target.value)}
        className="search-input"
      />

      {localSearchQuery && (
        <button 
          type="button" 
          className="search-reset-button"
          onClick={handleReset}
          aria-label="Очистить поиск"
        >
          ×
        </button>
      )}
    </div>
  );
};
