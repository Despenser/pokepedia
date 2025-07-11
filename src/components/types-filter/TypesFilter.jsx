import { useEffect } from 'react';
import usePokemonStore from '../../store/pokemonStore.js';
import {TypeBadge} from '../type-badge/TypeBadge.jsx';
import './TypesFilter.css';

const TypesFilter = () => {
  const { 
    pokemonTypes, 
    selectedType, 
    fetchPokemonTypes, 
    setSelectedType 
  } = usePokemonStore();

  useEffect(() => {
    fetchPokemonTypes();
  }, [fetchPokemonTypes]);

  const handleTypeClick = (type) => {
    // Создаем уникальный идентификатор запроса
    const requestId = Date.now();

    // Определяем новое значение для selectedType
    const newType = selectedType === type ? null : type;

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
        setSelectedType(newType);
      }
    }, 50);
  };

  return (
    <div className="types-filter">
      <div className="types-filter-header">
        <h3>Фильтр по типам</h3>
        {selectedType && (
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
                  setSelectedType(null);
                }
              }, 50);
            }}
          >
            Сбросить тип
          </button>
        )}
      </div>

      <div className="types-badges">
        {pokemonTypes.map((typeInfo) => (
          <TypeBadge
            key={typeInfo.name}
            type={typeInfo.name}
            onClick={handleTypeClick}
            isActive={selectedType === typeInfo.name}
          />
        ))}
      </div>
    </div>
  );
};

export default TypesFilter;
