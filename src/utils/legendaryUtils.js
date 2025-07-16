/**
 * Утилиты для работы с легендарными покемонами
 */

// Локальный список имен легендарных покемонов (по данным PokeAPI, только дефолтные формы)
export const LEGENDARY_NAMES = [
    // Gen 1
    'articuno', 'zapdos', 'moltres', 'mewtwo', 'mew',

    // Gen 2
    'raikou', 'entei', 'suicune', 'lugia', 'ho-oh', 'celebi',

    // Gen 3
    'regirock', 'regice', 'registeel', 'latias', 'latios', 'kyogre', 'groudon', 'rayquaza', 'jirachi', 'deoxys-normal',

    // Gen 4
    'uxie', 'mesprit', 'azelf', 'dialga', 'palkia', 'heatran', 'regigigas', 'giratina-altered',
    'cresselia', 'phione', 'manaphy', 'darkrai', 'shaymin-land', 'arceus',

    // Gen 5
    'victini', 'cobalion', 'terrakion', 'virizion', 'tornadus-incarnate', 'thundurus-incarnate', 'reshiram', 'zekrom',
    'landorus-incarnate', 'kyurem', 'keldeo-ordinary', 'meloetta-aria', 'genesect',

    // Gen 6
    'xerneas', 'yveltal', 'zygarde-50', 'diancie', 'hoopa', 'volcanion',

    // Gen 7
    'type-null', 'silvally', 'tapu-koko', 'tapu-lele', 'tapu-bulu', 'tapu-fini', 'cosmog', 'cosmoem', 'solgaleo',
    'lunala', 'nihilego', 'buzzwole', 'pheromosa', 'xurkitree', 'celesteela', 'kartana', 'guzzlord', 'necrozma',
    'magearna', 'marshadow', 'poipole', 'naganadel', 'stakataka', 'blacephalon', 'zeraora',

    // Gen 8
    'zacian', 'zamazenta', 'eternatus', 'kubfu', 'urshifu-single-strike', 'zarude', 'regieleki', 'regidrago', 'glastrier', 'spectrier', 'calyrex',

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
    'enamorus-incarnate', 'darmanitan-standard', 'gourgeist-average', 'pumpkaboo-average'
];

/**
 * Получает базовое имя для species-запроса
 * @param {string} name - Имя покемона
 * @returns {string} Базовое имя для species-запроса
 */
export const getSpeciesName = (name) => {
    if (FORM_NAMES.includes(name)) {
        return name.split('-')[0];
    }
    return name;
};

/**
 * Сортировка поколений по номеру
 */
export const GENERATION_ORDER = [
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