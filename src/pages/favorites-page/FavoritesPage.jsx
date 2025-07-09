import { useState, useEffect } from 'react';
import { useFavorites } from '../../hooks/useFavorites';
import {Header} from '../../components/header/Header.jsx';
import {Footer} from '../../components/footer/Footer.jsx';
import PokemonCard from '../../components/pokemon-card/PokemonCard.jsx';
import PokemonCardSkeleton from '../../components/pokemon-card-skeleton/PokemonCardSkeleton.jsx';
import { ErrorMessage } from '../../components/error-message/ErrorMessage.jsx';
import { getPokemonByNameOrId } from '../../api/pokeApi';
import { safeAsync } from '../../utils/errorHandlingUtils';
import './FavoritesPage.css';

/**
 * Страница со списком избранных покемонов
 */
const FavoritesPage = () => {
  // Получаем список избранных покемонов из хука
  const { favorites: favoriteIds } = useFavorites();

  // Состояние для хранения загруженных данных о покемонах
  const [favoritePokemons, setFavoritePokemons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка данных о покемонах
  useEffect(() => {
    const loadFavoritePokemons = async () => {
      // Если нет избранных покемонов, не выполняем запросы
      if (favoriteIds.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      // Создаем массив промисов для параллельной загрузки данных
      const pokemonPromises = favoriteIds.map(id => 
        safeAsync(() => getPokemonByNameOrId(id), {
          errorContext: `загрузка покемона #${id}`,
          errorType: 'POKEMON_LOAD'
        })
      );

      // Ожидаем выполнения всех запросов
      const results = await Promise.all(pokemonPromises);

      // Фильтруем и обрабатываем результаты
      const loadedPokemons = [];
      let hasErrors = false;

      results.forEach(([error, pokemon], index) => {
        if (error) {
          console.error(`Ошибка при загрузке покемона #${favoriteIds[index]}:`, error);
          hasErrors = true;
        } else if (pokemon) {
          loadedPokemons.push(pokemon);
        }
      });

      // Если возникли ошибки при загрузке, но некоторые покемоны все же загрузились,
      // мы отображаем их, но также показываем предупреждение
      if (hasErrors && loadedPokemons.length < favoriteIds.length) {
        setError({
          message: 'Не удалось загрузить некоторых покемонов. Пожалуйста, попробуйте позже.'
        });
      }

      // Сортируем покемонов по их ID
      loadedPokemons.sort((a, b) => a.id - b.id);
      setFavoritePokemons(loadedPokemons);
      setIsLoading(false);
    };

    loadFavoritePokemons();
  }, [favoriteIds]);

  return (
    <div className="favorites-page">
      <Header />

      <main className="main-content">
        <div className="container">
          <h1 className="favorites-title">Избранные покемоны</h1>

          {error && (
            <div className="favorites-error-container">
              <ErrorMessage message={error.message} />
            </div>
          )}

          {!isLoading && favoriteIds.length === 0 ? (
            <div className="empty-favorites">
              <img src="/favorites.svg" alt="Нет избранных покемонов" className="empty-favorites-img" />
              <h2>У вас пока нет избранных покемонов</h2>
              <p>Добавляйте покемонов в избранное, нажимая на значок сердечка на странице покемона</p>
            </div>
          ) : (
            <div className="pokemon-grid">
              {favoritePokemons.map(pokemon => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} showFavoriteButton={true} />
              ))}

              {isLoading && favoriteIds.map((id, index) => (
                <PokemonCardSkeleton key={`skeleton-${id}-${index}`} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FavoritesPage;



