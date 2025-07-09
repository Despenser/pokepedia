import { useEffect, useState, useRef } from 'react';
import usePokemonStore from '../../store/pokemonStore.js';
import { getPokemonsByType, getPokemonByNameOrId } from '../../api/pokeApi.js';
import PokemonCard from '../pokemon-card/PokemonCard.jsx';
import PokemonCardSkeleton from '../pokemon-card-skeleton/PokemonCardSkeleton.jsx';
import './SimilarPokemons.css';

const SimilarPokemons = ({ pokemonId, types }) => {
  const [similarPokemons, setSimilarPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const { cache } = usePokemonStore();

  // Фиксированное количество слайдов для всех устройств
  const slidesPerView = 4;

  // Используем фиксированное количество видимых покемонов на всех устройствах
  // CSS определяет, сколько из них будет показано на разных экранах

  useEffect(() => {
    const fetchSimilarPokemons = async () => {
      if (!types || types.length === 0) return;

      setLoading(true);

      try {
        // Берем первый тип покемона для поиска похожих
        const mainType = types[0].type.name;

        // Проверяем кеш
        const cacheKey = `similar-${mainType}`;
        if (cache[cacheKey]) {
          const filteredCache = cache[cacheKey].filter(p => p.id !== Number(pokemonId));
          setSimilarPokemons(filteredCache.slice(0, 4));
          setLoading(false);
          return;
        }

        // Получаем покемонов того же типа
        const typeData = await getPokemonsByType(mainType);

        // Перемешиваем результаты для разнообразия
        const shuffled = [...typeData]
          .sort(() => 0.5 - Math.random())
          .slice(0, 20); // Берем больше покемонов для карусели

        // Получаем детальную информацию о каждом покемоне
        const detailedPokemons = await Promise.all(
          shuffled.map(async ({ pokemon }) => {
            try {
              return await getPokemonByNameOrId(pokemon.name);
            } catch (error) {
              console.error(`Ошибка при загрузке данных покемона ${pokemon.name}:`, error);
              return null;
            }
          })
        );

        // Фильтруем null значения и исключаем текущего покемона
        const filtered = detailedPokemons
          .filter(p => p !== null && p.id !== Number(pokemonId))
          .slice(0, 12); // Загружаем больше покемонов для карусели

        setSimilarPokemons(filtered);
      } catch (error) {
        console.error('Ошибка при получении похожих покемонов:', error);
        setSimilarPokemons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarPokemons();
  }, [pokemonId, types, cache]);

  if (!types || types.length === 0) {
    return null;
  }

  // Функции навигации по карусели
  const nextSlide = () => {
    const maxSlide = Math.max(0, similarPokemons.length - slidesPerView);
    setCurrentSlide(prev => (prev >= maxSlide ? 0 : prev + 1));
  };

  const prevSlide = () => {
    const maxSlide = Math.max(0, similarPokemons.length - slidesPerView);
    setCurrentSlide(prev => (prev <= 0 ? maxSlide : prev - 1));
  };

  // Обработчики событий свайпа
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) { // Свайп влево
      nextSlide();
    } else if (diff < -50) { // Свайп вправо
      prevSlide();
    }
  };

  // Стиль трансформации для слайдера с учетом адаптивного количества слайдов
  const slideStyle = {
    transform: `translateX(-${currentSlide * (100 / slidesPerView)}%)`,
    width: similarPokemons.length > 0 
      ? `${Math.max(100, (similarPokemons.length / slidesPerView) * 100)}%`
      : '100%',
    gap: '8px' // Добавляем gap между элементами
  };

  return (
    <div className="similar-pokemons">
      <div className="similar-pokemons-header">
        <h3>Похожие покемоны</h3>
      </div>

      <div className="carousel-wrapper">
        <button 
          className="carousel-arrow carousel-arrow-prev" 
          onClick={prevSlide}
          aria-label="Предыдущие покемоны"
        >
          &larr;
        </button>

        <div 
          className="carousel-container"
          ref={carouselRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="carousel-track" style={slideStyle}>
            {loading ? (
              // Показываем скелетоны во время загрузки
              Array(slidesPerView).fill(0).map((_, index) => (
                <div className="carousel-item" key={`similar-skeleton-${index}`}>
                  <PokemonCardSkeleton />
                </div>
              ))
            ) : similarPokemons.length > 0 ? (
              // Показываем похожих покемонов
              similarPokemons.map(pokemon => (
                <div className="carousel-item" key={pokemon.id}>
                  <PokemonCard pokemon={pokemon} showFavoriteButton={false} />
                </div>
              ))
            ) : (
              // Если не нашли похожих покемонов
              <div className="no-similar-pokemons">
                <p>Похожие покемоны не найдены</p>
              </div>
            )}
          </div>
        </div>

        <button 
          className="carousel-arrow carousel-arrow-next" 
          onClick={nextSlide}
          aria-label="Следующие покемоны"
        >
          &rarr;
        </button>
      </div>
    </div>
  );
};

export default SimilarPokemons;
