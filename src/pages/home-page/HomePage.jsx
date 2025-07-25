import React, { Suspense, lazy, useEffect, useCallback, useMemo, useState } from 'react';
import { Footer } from '../../components/footer/Footer.jsx';
import usePokemonStore from '../../store/pokemonStore.js';
import { getTypeNameRuAsync } from '../../utils/localizationUtils.js';
import './HomePage.css';

const HomeFilters = lazy(() => import('../../components/home/HomeFilters.jsx'));
const HomeContent = lazy(() => import('../../components/home/HomeContent.jsx'));

const HomePage = () => {
  const { loading, offset, pokemons, searchQuery, selectedType, selectedGeneration, resetSearch } = usePokemonStore();

  const [typeNameRu, setTypeNameRu] = useState(selectedType);
  useEffect(() => {
    let mounted = true;
    if (selectedType) {
      getTypeNameRuAsync(selectedType).then(res => { if (mounted) setTypeNameRu(res); });
    } else {
      setTypeNameRu(undefined);
    }
    return () => { mounted = false; };
  }, [selectedType]);

  // Функция для сброса всех фильтров с мемоизацией
  const handleResetFilters = useCallback(() => {
    // Используем встроенный метод сброса из хранилища
    resetSearch();
  }, [resetSearch]);

  // Мемоизируем заголовок раздела для предотвращения ненужных перерендеров
  const sectionTitle = useMemo(() => {
    if (searchQuery) return 'Результаты поиска';
    if (selectedType && selectedGeneration) {
      return `Покемоны типа ${typeNameRu} из поколения ${selectedGeneration.replace('generation-', '').toUpperCase()}`;
    }
    if (selectedType) return `Покемоны типа ${typeNameRu}`;
    if (selectedGeneration) return `Покемоны поколения ${selectedGeneration.replace('generation-', '').toUpperCase()}`;
    return 'Все покемоны';
  }, [searchQuery, selectedType, selectedGeneration, typeNameRu]);

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
          <Suspense fallback={null}>
            <HomeFilters 
              selectedType={selectedType}
              selectedGeneration={selectedGeneration}
              onResetFilters={handleResetFilters}
            />
          </Suspense>

          <h2 className="section-title">{sectionTitle}</h2>

          <Suspense fallback={null}>
            <HomeContent 
              loading={loading}
              offset={offset}
              pokemons={pokemons}
            />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
