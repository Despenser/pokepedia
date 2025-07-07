import { useEffect, useState, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { getPokemonByNameOrId } from '../../api/pokeApi.js';
import { formatPokemonName } from '../../utils/formatUtils.js';
import { getPokemonImage, getFallbackImage } from '../../utils/imageUtils.js';
import './EvolutionChain.css';

// Отдельный компонент для условий эволюции
const EvolutionConditions = memo(({ conditions }) => {
  if (!conditions) return null;
  return <div className="evolution-conditions">{conditions}</div>;
});

// Отдельный компонент для изображения покемона
const PokemonImage = memo(({ imageUrl, name, nameRu, id }) => {
  const handleError = (e) => {
    e.target.onerror = null;
    e.target.src = getFallbackImage(id);
  };

  return (
    <div className="evolution-image-container">
      <img 
        src={imageUrl} 
        alt={nameRu || name} 
        className="evolution-image" 
        loading="eager"
        fetchPriority="high"
        onError={handleError}
      />
    </div>
  );
});

// Отдельный компонент для стрелки эволюции
const EvolutionArrow = memo(({ conditions, isLastLevel }) => {
  if (isLastLevel) return null;

  return (
    <div className="evolution-arrow">
      <div className="arrow-line"></div>
      <div className="arrow-head">▶</div>
      <EvolutionConditions conditions={conditions} />
    </div>
  );
});

export const EvolutionChain = ({ evolutionChain }) => {
  const [evolutionData, setEvolutionData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Функция для извлечения условий эволюции
  const getEvolutionConditions = useCallback((evolutionDetails) => {
    if (!evolutionDetails) return '';

    const conditions = [];

    if (evolutionDetails.min_level) {
      conditions.push(`Уровень ${evolutionDetails.min_level}`);
    }

    if (evolutionDetails.item) {
      conditions.push(`${formatPokemonName(evolutionDetails.item.name)}`);
    }

    if (evolutionDetails.trigger?.name === 'trade') {
      conditions.push('Обмен');
    }

    if (evolutionDetails.time_of_day) {
      const timeMap = {
        'day': 'Днём',
        'night': 'Ночью'
      };
      conditions.push(timeMap[evolutionDetails.time_of_day] || evolutionDetails.time_of_day);
    }

    if (evolutionDetails.happiness) {
      conditions.push(`Счастье ${evolutionDetails.happiness}`);
    }

    return conditions.join(', ');
  }, []);

  // Обработка цепочки эволюции
  const processEvolution = useCallback(async (current, level = 0, branch = 0) => {
    try {
      const pokemonDetails = await getPokemonByNameOrId(current.species.name);
      const evolutionDetails = current.evolution_details[0] || {};

      const evoNode = {
        id: pokemonDetails.id,
        name: pokemonDetails.name,
        nameRu: pokemonDetails.nameRu,
        imageUrl: getPokemonImage(pokemonDetails.sprites, pokemonDetails.id),
        level,
        branch,
        conditions: getEvolutionConditions(evolutionDetails)
      };

      const evolutions = [];
      if (current.evolves_to?.length > 0) {
        for (let i = 0; i < current.evolves_to.length; i++) {
          const nextBranch = current.evolves_to.length > 1 ? i : branch;
          const childEvolutions = await processEvolution(current.evolves_to[i], level + 1, nextBranch);
          evolutions.push(...childEvolutions);
        }
      }

      return [evoNode, ...evolutions];
    } catch (error) {
      console.error('Ошибка при обработке эволюции:', error);
      return [];
    }
  }, [getEvolutionConditions]);

  // Загрузка данных эволюции
  useEffect(() => {
    if (!evolutionChain) return;

    const fetchEvolutionData = async () => {
      setLoading(true);
      try {
        const result = await processEvolution(evolutionChain.chain);
        setEvolutionData(result);
      } catch (error) {
        console.error('Ошибка при получении данных эволюции:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvolutionData();
  }, [evolutionChain, processEvolution]);

  if (loading) {
    return <div className="evolution-chain-skeleton"></div>;
  }

  if (!evolutionData.length) {
    return <div className="no-evolution">У этого покемона нет эволюций</div>;
  }

  // Группируем по уровням для отображения
  const evolutionsByLevel = evolutionData.reduce((acc, evo) => {
    if (!acc[evo.level]) acc[evo.level] = [];
    acc[evo.level].push(evo);
    return acc;
  }, {});

  const maxLevel = Math.max(...Object.keys(evolutionsByLevel).map(Number));

  return (
    <div className="evolution-chain-container">
      {Array.from({ length: maxLevel + 1 }, (_, level) => {
        if (!evolutionsByLevel[level]) return null;

        return (
          <div key={level} className="evolution-level">
            {evolutionsByLevel[level].map((evo, index) => (
              <div key={index} className="evolution-item">
                <Link to={`/pokemon/${evo.id}`} className="evolution-link">
                  <div className="evolution-pokemon">
                    <PokemonImage 
                      imageUrl={evo.imageUrl} 
                      name={evo.name} 
                      nameRu={evo.nameRu} 
                      id={evo.id} 
                    />
                    <div className="evolution-name">{formatPokemonName(evo.name, evo.nameRu)}</div>
                  </div>
                </Link>

                <EvolutionArrow 
                  conditions={evo.conditions} 
                  isLastLevel={evo.level >= maxLevel} 
                />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};
