import React from 'react';
import { useEffect, useCallback, useMemo } from 'react';
import { Footer } from '../../components/footer/Footer.jsx';
import HomeFilters from '../../components/home/HomeFilters.jsx';
import HomeContent from '../../components/home/HomeContent.jsx';
import usePokemonStore from '../../store/pokemonStore.js';
import { getTypeNameRu } from '../../utils/localizationUtils.js';
import './HomePage.css';

const HomePage = () => {
  const { loading, offset, pokemons, searchQuery, selectedType, selectedGeneration, resetSearch } = usePokemonStore();

  // Функция для сброса всех фильтров с мемоизацией
  const handleResetFilters = useCallback(() => {
    // Используем встроенный метод сброса из хранилища
    resetSearch();
  }, [resetSearch]);

  // Мемоизируем заголовок раздела для предотвращения ненужных перерендеров
  const sectionTitle = useMemo(() => {
    if (searchQuery) return 'Результаты поиска';
    if (selectedType && selectedGeneration) {
      return `Покемоны типа ${getTypeNameRu(selectedType)} из поколения ${selectedGeneration.replace('generation-', '').toUpperCase()}`;
    }
    if (selectedType) return `Покемоны типа ${getTypeNameRu(selectedType)}`;
    if (selectedGeneration) return `Покемоны поколения ${selectedGeneration.replace('generation-', '').toUpperCase()}`;
    return 'Все покемоны';
  }, [searchQuery, selectedType, selectedGeneration]);

  // Сбрасываем прокрутку при первой загрузке страницы
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Следим за изменениями фильтров и загружаем данные, если список пуст
  useEffect(() => {
    // Если список пуст и нет активных фильтров - загружаем данные
    if (pokemons.length === 0 && !selectedType && !selectedGeneration && !searchQuery && !loading) {
      const fetchInitialData = async () => {
        const store = usePokemonStore.getState();
        await store.fetchPokemons();
      };
      fetchInitialData();
    }
  }, [pokemons.length, selectedType, selectedGeneration, searchQuery, loading]);

  return (
    <div className="home-page">
      <main className="home-main">
        <div className="container">
          <HomeFilters 
            selectedType={selectedType}
            selectedGeneration={selectedGeneration}
            onResetFilters={handleResetFilters}
          />

          <h2 className="section-title">{sectionTitle}</h2>

          <HomeContent 
            loading={loading}
            offset={offset}
            pokemons={pokemons}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
