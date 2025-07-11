import { useEffect, useState } from 'react';
import { Footer } from '../components/footer/Footer.jsx';
import PokemonCard from '../components/pokemon-card/PokemonCard.jsx';
import PokemonCardSkeleton from '../components/pokemon-card-skeleton/PokemonCardSkeleton.jsx';
import { getPokemonByNameOrId, getPokemonSpecies } from '../api/pokeApi';
import pokemonNamesRu from '../assets/translate/pokemon-names-ru.json';
import { getGenerationNameRu } from '../utils/localizationUtils';
import './favorites-page/FavoritesPage.css';

// Локальный список имен легендарных покемонов (по данным PokeAPI, только дефолтные формы)
const LEGENDARY_NAMES = [
  // Gen 1
  'articuno', 'zapdos', 'moltres', 'mewtwo', 'mew',
  // Gen 2
  'raikou', 'entei', 'suicune', 'lugia', 'ho-oh', 'celebi',
  // Gen 3
  'regirock', 'regice', 'registeel', 'latias', 'latios', 'kyogre', 'groudon', 'rayquaza', 'jirachi', 'deoxys-normal', // deoxys
  // Gen 4
  'uxie', 'mesprit', 'azelf', 'dialga', 'palkia', 'heatran', 'regigigas', 'giratina-altered', // giratina
  'cresselia', 'phione', 'manaphy', 'darkrai', 'shaymin-land', // shaymin
  'arceus',
  // Gen 5
  'victini', 'cobalion', 'terrakion', 'virizion', 'tornadus-incarnate', // tornadus
  'thundurus-incarnate', // thundurus
  'reshiram', 'zekrom', 'landorus-incarnate', // landorus
  'kyurem', 'keldeo-ordinary', // keldeo
  'meloetta-aria', // meloetta
  'genesect',
  // Gen 6
  'xerneas', 'yveltal', 'zygarde-50', // zygarde
  'diancie', 'hoopa', 'volcanion',
  // Gen 7
  'type-null', 'silvally', 'tapu-koko', 'tapu-lele', 'tapu-bulu', 'tapu-fini', 'cosmog', 'cosmoem', 'solgaleo', 'lunala', 'nihilego', 'buzzwole', 'pheromosa', 'xurkitree', 'celesteela', 'kartana', 'guzzlord', 'necrozma', 'magearna', 'marshadow', 'poipole', 'naganadel', 'stakataka', 'blacephalon', 'zeraora',
  // Gen 8
  'zacian', 'zamazenta', 'eternatus', 'kubfu', 'urshifu-single-strike', // urshifu
  'zarude', 'regieleki', 'regidrago', 'glastrier', 'spectrier', 'calyrex',
  // Gen 9 (Paldea)
  'ting-lu', 'chien-pao', 'wo-chien', 'chi-yu', 'koraidon', 'miraidon', 'walking-wake', 'iron-leaves', 'ogerpon', 'terapagos'
];

// Список имён с формами, для которых species-запрос идёт по базовому имени
const FORM_NAMES = [
  'deoxys-normal', 'giratina-altered', 'shaymin-land', 'tornadus-incarnate',
  'thundurus-incarnate', 'landorus-incarnate', 'keldeo-ordinary', 'meloetta-aria',
  'zygarde-50', 'urshifu-single-strike', 'oricorio-baile', 'lycanroc-midday',
  'wishiwashi-solo', 'minior-red-meteor', 'mimikyu-disguised', 'toxtricity-amped',
  'eiscue-ice', 'indeedee-male', 'morpeko-full-belly', 'basculegion-male',
  'enamorus-incarnate', 'darmanitan-standard', 'gourgeist-average', 'pumpkaboo-average',
  // ... можно добавить другие формы, если потребуется
];

function getSpeciesName(name) {
  if (FORM_NAMES.includes(name)) {
    return name.split('-')[0];
  }
  return name;
}

const LegendaryPage = () => {
  const [grouped, setGrouped] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLegendaryPokemons = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Получаем данные и species для каждого покемона
        const promises = LEGENDARY_NAMES.map(async (name) => {
          try {
            const [pokemon, species] = await Promise.all([
              getPokemonByNameOrId(name),
              getPokemonSpecies(getSpeciesName(name))
            ]);
            return {
              ...pokemon,
              nameRu: pokemonNamesRu[pokemon.name],
              generation: species?.generation?.name || 'unknown',
            };
          } catch {
            return null;
          }
        });
        const all = (await Promise.all(promises)).filter(Boolean);
        // Группируем по generation
        const byGen = {};
        for (const poke of all) {
          if (!byGen[poke.generation]) byGen[poke.generation] = [];
          byGen[poke.generation].push(poke);
        }
        setGrouped(byGen);
      } catch (e) {
        setError(e instanceof Error ? e : new Error(e?.message || e));
      }
      setIsLoading(false);
    };
    loadLegendaryPokemons();
  }, []);

  // Сортировка поколений по номеру
  const generationOrder = [
    'generation-i',
    'generation-ii',
    'generation-iii',
    'generation-iv',
    'generation-v',
    'generation-vi',
    'generation-vii',
    'generation-viii',
    'generation-ix',
    'unknown'
  ];

  return (
    <div className="favorites-page">
      <main className="main-content">
        <div className="container">
          <h1 className="favorites-title">Легендарные покемоны</h1>
          {error && (
            <div className="favorites-error-container">
              <div style={{ color: 'red' }}>{error.message}</div>
            </div>
          )}
          {isLoading && (
            <div className="pokemon-grid">
              {Array(6).fill(0).map((_, i) => <PokemonCardSkeleton key={`skeleton-${i}`} />)}
            </div>
          )}
          {!isLoading && generationOrder.map(gen => (
            grouped[gen]?.length ? (
              <div key={gen} style={{ marginBottom: 40 }}>
                <h2 className="section-title generation" style={{ marginTop: 32 }}>{getGenerationNameRu(gen)}</h2>
                <div className="pokemon-grid">
                  {grouped[gen].map(pokemon => (
                    <PokemonCard key={pokemon.id} pokemon={pokemon} showFavoriteButton={false} />
                  ))}
                </div>
              </div>
            ) : null
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LegendaryPage; 