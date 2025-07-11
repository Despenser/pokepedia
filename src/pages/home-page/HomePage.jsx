import {useEffect, useCallback, useMemo} from 'react';
import {Footer} from '../../components/footer/Footer.jsx';
import PokemonList from '../../components/pokemon-list/PokemonList.jsx';
import TypesFilter from '../../components/types-filter/TypesFilter.jsx';
import GenerationsFilter from '../../components/generations-filter/GenerationsFilter.jsx';
import {Loader} from '../../components/loader/Loader.jsx';
import usePokemonStore from '../../store/pokemonStore.js';
import {getTypeNameRu} from '../../utils/localizationUtils.js';
import {SearchBar} from '../../components/search-bar/SearchBar';
import './HomePage.css';

const HomePage = () => {
    const {loading, offset, pokemons, searchQuery, selectedType, selectedGeneration, resetSearch} = usePokemonStore();

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
            <main className="main-content">
                <div className="container">
                    <div className="filters-container">
                        <TypesFilter/>
                        <GenerationsFilter/>
                        {(selectedType || selectedGeneration) && (
                            <button
                                className="reset-all-filters back-button"
                                onClick={handleResetFilters}
                            >
                                Сбросить все фильтры
                            </button>
                        )}
                    </div>

                    <h2 className="section-title">{sectionTitle}</h2>

                    {/* Индикатор обновления данных */}
                    {loading && <div className="filter-updating">Обновление данных...</div>}

                    {/* Мемоизируем условие для отображения загрузчика */}
                    {useMemo(() => {
                        return loading && offset === 0 && pokemons.length === 0 ? (
                            <Loader/>
                        ) : (
                            <PokemonList/>
                        );
                    }, [loading, offset, pokemons.length])}
                </div>
            </main>

            <Footer/>
        </div>
    );
};

export default HomePage;
