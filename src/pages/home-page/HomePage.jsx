import { useEffect } from 'react';
import {Header} from '../../components/header/Header.jsx';
import {Footer} from '../../components/footer/Footer.jsx';
import PokemonList from '../../components/pokemon-list/PokemonList.jsx';
import TypesFilter from '../../components/types-filter/TypesFilter.jsx';
import GenerationsFilter from '../../components/generations-filter/GenerationsFilter.jsx';
import {Loader} from '../../components/loader/Loader.jsx';
import usePokemonStore from '../../store/pokemonStore.js';
import { getTypeNameRu } from '../../utils/localizationUtils.js';
import './HomePage.css';

const HomePage = () => {
  const { loading, offset, pokemons, searchQuery, selectedType, selectedGeneration, resetSearch } = usePokemonStore();

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
      <Header />

      <main className="main-content">
        <div className="container">
          <div className="filters-container">
            <TypesFilter />
            <GenerationsFilter />
            {(selectedType || selectedGeneration) && (
              <button 
                className="reset-all-filters" 
                onClick={() => {
                  // Создаем уникальный идентификатор запроса
                  const requestId = Date.now();

                  // Сначала очищаем список и устанавливаем состояние загрузки
                  usePokemonStore.setState({ 
                    pokemons: [], 
                    loading: true,
                    offset: 0,
                    hasMore: true,
                    selectedType: null,
                    selectedGeneration: null,
                    error: null,
                    lastRequestId: requestId
                  });

                  // Используем setTimeout для гарантии выполнения после обновления состояния
                  setTimeout(() => {
                    // Проверяем, не был ли этот запрос перезаписан новым
                    if (usePokemonStore.getState().lastRequestId === requestId) {
                      const store = usePokemonStore.getState();
                      store.fetchPokemons();
                    } else {
                      console.log('Пропуск устаревшего запроса при сбросе всех фильтров');
                    }
                  }, 50);
                }}
              >
                Сбросить все фильтры
              </button>
            )}
          </div>

          <h2 className="section-title">
            {searchQuery ? 'Результаты поиска' : 
             selectedType && selectedGeneration ? 
               `Покемоны типа ${getTypeNameRu(selectedType)} из поколения ${selectedGeneration.replace('generation-', '').toUpperCase()}` : 
             selectedType ? `Покемоны типа ${getTypeNameRu(selectedType)}` : 
             selectedGeneration ? `Покемоны поколения ${selectedGeneration.replace('generation-', '').toUpperCase()}` : 
             'Все покемоны'}
          </h2>

          {/* Индикатор обновления данных */}
          {loading && <div className="filter-updating">Обновление данных...</div>}

          {loading && offset === 0 && pokemons.length === 0 ? (
            <Loader />
          ) : (
            <PokemonList />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
