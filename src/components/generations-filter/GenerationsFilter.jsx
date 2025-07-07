import { useEffect } from 'react';
import usePokemonStore from '../../store/pokemonStore.js';
import GenerationBadge from '../generation-badge/GenerationBadge.jsx';
import './GenerationsFilter.css';

const GenerationsFilter = () => {
  const { 
    generations, 
    selectedGeneration, 
    fetchGenerations, 
    setSelectedGeneration 
  } = usePokemonStore();

  useEffect(() => {
    fetchGenerations();
  }, [fetchGenerations, generations.length]);

  const handleGenerationClick = (generation) => {
    // Создаем уникальный идентификатор запроса
    const requestId = Date.now();

    // Получаем текущее состояние
    const store = usePokemonStore.getState();
    const { selectedType } = store;

    // Определяем новое значение для selectedGeneration
    const newGeneration = selectedGeneration === generation ? null : generation;

    // Показываем состояние загрузки и сохраняем идентификатор запроса
    usePokemonStore.setState({
      loading: true,
      pokemons: [],
      error: null,
      lastRequestId: requestId
    });

    // Выполняем действие с небольшой задержкой
    setTimeout(() => {
      // Проверяем, не был ли этот запрос перезаписан новым
      if (usePokemonStore.getState().lastRequestId === requestId) {
        setSelectedGeneration(newGeneration);
      } else {
        console.log('Пропуск устаревшего запроса');
      }
    }, 50);
  };

  return (
    <div className="generations-filter">
      <div className="generations-filter-header">
        <h3>Фильтр по поколениям</h3>
        {selectedGeneration && (
          <button 
            className="clear-filter-button"
            onClick={() => {
              // Создаем уникальный идентификатор запроса
              const requestId = Date.now();

              // Сначала устанавливаем состояние загрузки и сохраняем идентификатор запроса
              usePokemonStore.setState({ 
                loading: true, 
                pokemons: [],
                error: null,
                lastRequestId: requestId 
              });

              // Выполняем действие с небольшой задержкой
              setTimeout(() => {
                // Проверяем, не был ли этот запрос перезаписан новым
                if (usePokemonStore.getState().lastRequestId === requestId) {
                  setSelectedGeneration(null);
                } else {
                  console.log('Пропуск устаревшего запроса');
                }
              }, 50);
            }}
          >
            Сбросить поколение
          </button>
        )}
      </div>

      <div className="generations-badges">
        {generations.map((generationInfo) => (
          <GenerationBadge
            key={generationInfo.name}
            generation={generationInfo.name}
            onClick={handleGenerationClick}
            isActive={selectedGeneration === generationInfo.name}
          />
        ))}
      </div>
    </div>
  );
};

export default GenerationsFilter;
