import { useEffect, useState, useRef, useCallback } from 'react';
import usePokemonStore from '../../store/pokemonStore.js';
import { getPokemonsByType, getPokemonByNameOrId } from '../../api/pokeApi.js';
import PokemonCard from '../pokemon-card/PokemonCard.jsx';
import PokemonCardSkeleton from '../pokemon-card-skeleton/PokemonCardSkeleton.jsx';

import pokemonNamesRu from '../../assets/translate/pokemon-names-ru.json';
import './SimilarPokemons.css';

const SimilarPokemons = ({ pokemonId, types }) => {
  const [similarPokemons, setSimilarPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  
  const carouselRef = useRef(null);
  const { cache } = usePokemonStore();

  // Количество видимых карточек на разных экранах
  const getVisibleCards = () => {
    if (window.innerWidth >= 1200) return 4;
    if (window.innerWidth >= 768) return 3;
    if (window.innerWidth >= 576) return 2;
    return 1;
  };

  const [visibleCards, setVisibleCards] = useState(getVisibleCards());

  // Обновляем количество видимых карточек при изменении размера окна
  useEffect(() => {
    const handleResize = () => {
      setVisibleCards(getVisibleCards());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Загрузка похожих покемонов
  useEffect(() => {
    const fetchSimilarPokemons = async () => {
      if (!types || types.length === 0) return;

      setLoading(true);

      try {
        const mainType = types[0].type.name;
        const cacheKey = `similar-${mainType}`;

        // Проверяем кеш
        if (cache[cacheKey]) {
          const filteredCache = cache[cacheKey].filter(p => p.id !== Number(pokemonId));
          setSimilarPokemons(filteredCache.slice(0, 8));
          setLoading(false);
          return;
        }

        // Получаем покемонов того же типа
        const typeData = await getPokemonsByType(mainType);
        
        // Перемешиваем и берем первые 20 для разнообразия
        const shuffled = [...typeData]
          .sort(() => 0.5 - Math.random())
          .slice(0, 20);

        // Получаем детальную информацию
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

        // Фильтруем и ограничиваем количество
        const filtered = detailedPokemons
          .filter(p => p !== null && p.id !== Number(pokemonId))
          .slice(0, 8)
          .map(p => ({ ...p, nameRu: pokemonNamesRu[p.name] || p.name }));

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

  // Навигация по карусели
  const goToNext = useCallback(() => {
    if (similarPokemons.length <= visibleCards) return;
    
    setCurrentIndex(prev => {
      const maxIndex = similarPokemons.length - visibleCards;
      return prev >= maxIndex ? 0 : prev + 1;
    });
  }, [similarPokemons.length, visibleCards]);

  const goToPrev = useCallback(() => {
    if (similarPokemons.length <= visibleCards) return;
    
    setCurrentIndex(prev => {
      const maxIndex = similarPokemons.length - visibleCards;
      return prev <= 0 ? maxIndex : prev - 1;
    });
  }, [similarPokemons.length, visibleCards]);

  // Обработчики для свайпа/перетаскивания
  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setStartX(e.pageX);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault();
  }, [isDragging]);

  const handleMouseUp = useCallback((e) => {
    if (!isDragging) return;
    
    const endX = e.pageX;
    const diff = startX - endX;
    const minSwipeDistance = 50;
    
    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        // Перетаскивание влево - следующий слайд
        goToNext();
      } else {
        // Перетаскивание вправо - предыдущий слайд
        goToPrev();
      }
    }
    
    setIsDragging(false);
  }, [isDragging, startX, goToNext, goToPrev]);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch события для мобильных устройств
  const handleTouchStart = useCallback((e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault();
  }, [isDragging]);

  const handleTouchEnd = useCallback((e) => {
    if (!isDragging) return;
    
    const endX = e.changedTouches[0].pageX;
    const diff = startX - endX;
    const minSwipeDistance = 50;
    
    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        // Свайп влево - следующий слайд
        goToNext();
      } else {
        // Свайп вправо - предыдущий слайд
        goToPrev();
      }
    }
    
    setIsDragging(false);
  }, [isDragging, startX, goToNext, goToPrev]);

  // Автоматическое переключение слайдов
  useEffect(() => {
    if (similarPokemons.length <= visibleCards) return;

    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [similarPokemons.length, visibleCards, goToNext]);

  // Если нет типов или покемонов, не показываем компонент
  if (!types || types.length === 0) {
    return null;
  }

  // Вычисляем стили для трека карусели
  const trackStyle = {
    transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
    transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
  };

  const maxIndex = Math.max(0, similarPokemons.length - visibleCards);
  const showNavigation = similarPokemons.length > visibleCards;

  return (
    <div className="similar-pokemons">
      <div className="similar-pokemons-header">
        <h3>Похожие покемоны</h3>
      </div>

      <div className="carousel-wrapper">
        {showNavigation && (
          <button
            className="carousel-arrow carousel-arrow-prev"
            onClick={goToPrev}
            aria-label="Предыдущие покемоны"
            disabled={currentIndex === 0}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
        )}

        <div className="carousel-container">
          <div
            ref={carouselRef}
            className="carousel-track"
            style={trackStyle}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {loading ? (
              // Скелетоны во время загрузки
              Array.from({ length: 8 }, (_, index) => (
                <div className="carousel-item" key={`skeleton-${index}`}>
                  <PokemonCardSkeleton />
                </div>
              ))
            ) : similarPokemons.length > 0 ? (
              // Похожие покемоны
              similarPokemons.map((pokemon, index) => (
                <div 
                  className="carousel-item" 
                  key={pokemon.id}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <PokemonCard pokemon={pokemon} />
                </div>
              ))
            ) : (
              // Сообщение об отсутствии похожих покемонов
              <div className="no-similar-pokemons">
                <div className="no-pokemons-content">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M16 16s-1.5-2-4-2-4 2-4 2"/>
                    <line x1="9" y1="9" x2="9.01" y2="9"/>
                    <line x1="15" y1="9" x2="15.01" y2="9"/>
                  </svg>
                  <p>Похожие покемоны не найдены</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {showNavigation && (
          <button
            className="carousel-arrow carousel-arrow-next"
            onClick={goToNext}
            aria-label="Следующие покемоны"
            disabled={currentIndex === maxIndex}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SimilarPokemons;
