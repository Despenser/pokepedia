import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {getUserFriendlyErrorMessage, logError} from '../utils/errorHandlingUtils.js';
import { getPokemonNameRu } from '../utils/localizationUtils';
import {
    getPokemonList,
    getPokemonByNameOrId,
    getPokemonSpecies,
    getEvolutionChain,
    getPokemonTypes,
    getPokemonsByType,
    getGenerations,
    getGenerationDetails
} from '../api/pokeApi';
import { safeLocalStorage } from './safeLocalStorage';

// Универсальная функция ограничения размера кеша (FIFO)
const MAX_CACHE_SIZE = 30;
function manageCacheSize(cache, maxEntries = MAX_CACHE_SIZE) {
  const keys = Object.keys(cache);
  if (keys.length <= maxEntries) return cache;
  // FIFO: удаляем самые старые ключи
  const newCache = { ...cache };
  const toDelete = keys.slice(0, keys.length - maxEntries);
  toDelete.forEach(key => { delete newCache[key]; });
  return newCache;
}

const usePokemonStore = create(
    persist(
        (set, get) => ({
            // Состояние
            pokemons: [],
            generations: [],
            generationPokemons: {},
            currentGeneration: null,
            loading: false,
            error: null,
            selectedPokemon: null,
            pokemonDetails: null,
            species: null,
            evolutionChain: null,
            pokemonTypes: [],
            selectedType: null,
            selectedGeneration: null,
            searchQuery: '',
            offset: 0,
            limit: 20,
            hasMore: true,
            cache: {},
            lastRequestId: 0,

            updateEvolutionChain: (evolutionData) => {
                set({evolutionChain: evolutionData});
            },

            fetchPokemons: async () => {
                const {offset, limit, pokemons} = get();
                set({loading: true});
                try {
                    const newPokemons = await fetchPokemonsFromApi(offset, limit);
                    set({
                        pokemons: [...pokemons, ...newPokemons],
                        offset: offset + limit,
                        hasMore: newPokemons.length === limit,
                        loading: false,
                    });
                } catch (error) {
                    set({error, loading: false});
                }
            },
            //TODO resetPokemons: () => set({pokemons: [], offset: 0, hasMore: true, error: null}),

            // Вспомогательная функция для работы с кешем
            withCache: async (cacheKey, fetchData, setStateOnHit, setStateOnFetch) => {
                const {cache} = get();
                set({loading: true, error: null});

                try {
                    // Проверяем кеш
                    if (cache[cacheKey]) {
                        setStateOnHit(cache[cacheKey]);
                        return cache[cacheKey];
                    }

                    // Если данных нет в кеше, загружаем их
                    const data = await fetchData();

                    // Обновляем кеш и состояние
                    let updatedCache = {...cache, [cacheKey]: data};
                    updatedCache = manageCacheSize(updatedCache);
                    setStateOnFetch(data, updatedCache);

                    return data;
                } catch (error) {
                    set({error: error instanceof Error ? error : new Error(error?.message || error), loading: false});
                    return Promise.reject(error);
                }
            },

            fetchPokemonDetails: async (nameOrId) => {
                // Возвращаем промис для возможности ожидания завершения загрузки
                const cacheKey = `pokemon-${nameOrId}`;

                const fetchPokemonData = async () => {
                    const pokemonDetails = await getPokemonByNameOrId(nameOrId);
                    // Добавляем русское имя к данным покемона
                    pokemonDetails.nameRu = await getPokemonNameRu(pokemonDetails.name) || pokemonDetails.name;

                    const species = await getPokemonSpecies(nameOrId);
                    const evolutionData = await getEvolutionChain(species.evolution_chain.url);

                    return {pokemonDetails, species, evolutionChain: evolutionData};
                };

                const setStateOnHit = (cachedData) => {
                    set({
                        pokemonDetails: cachedData.pokemonDetails,
                        species: cachedData.species,
                        evolutionChain: cachedData.evolutionChain,
                        loading: false
                    });
                };

                const setStateOnFetch = (data, updatedCache) => {
                    set({
                        pokemonDetails: data.pokemonDetails,
                        species: data.species,
                        evolutionChain: data.evolutionChain,
                        loading: false,
                        error: null,
                        cache: updatedCache,
                        hasMore: false
                    });
                };

                try {
                    return await get().withCache(cacheKey, fetchPokemonData, setStateOnHit, setStateOnFetch);
                } catch (error) {
                    set({error: error instanceof Error ? error : new Error(error?.message || error), loading: false});
                    return Promise.reject(error);
                }
            },

            fetchPokemonTypes: async () => {
                const {cache} = get();
                set({loading: true, error: null});

                try {
                    // Проверяем кеш
                    const cacheKey = 'pokemon-types';
                    if (cache[cacheKey]) {
                        // Фильтруем типы перед сохранением в стор
                        const filteredTypes = cache[cacheKey].filter(
                            t => t.name !== 'stellar' && t.name !== 'unknown'
                        );
                        set({pokemonTypes: filteredTypes, loading: false});
                        return;
                    }

                    const types = await getPokemonTypes();
                    // Фильтруем типы перед сохранением в стор и кеш
                    const filteredTypes = types.filter(
                        t => t.name !== 'stellar' && t.name !== 'unknown'
                    );

                    // Обновляем кеш
                    let updatedCache = {...cache};
                    updatedCache = manageCacheSize(updatedCache);
                    updatedCache[cacheKey] = filteredTypes;

                    set({pokemonTypes: filteredTypes, loading: false, cache: updatedCache});
                } catch (error) {
                    set({error: error instanceof Error ? error : new Error(error?.message || error), loading: false});
                }
            },

            // Создаем переиспользуемую функцию для преобразования данных покемона
            processPokemonData: async (pokemonNameOrId) => {
                try {
                    const detailedPokemon = await getPokemonByNameOrId(pokemonNameOrId);
                    return {
                        id: detailedPokemon.id,
                        name: detailedPokemon.name,
                        nameRu: await getPokemonNameRu(detailedPokemon.name) || detailedPokemon.name,
                        types: detailedPokemon.types,
                        sprites: detailedPokemon.sprites,
                        stats: detailedPokemon.stats,
                        abilities: detailedPokemon.abilities,
                        height: detailedPokemon.height,
                        weight: detailedPokemon.weight,
                    };
                } catch (err) {
                    logError(`Ошибка при загрузке данных покемона ${pokemonNameOrId}:`, err);
                    return null;
                }
            },

            fetchPokemonsByType: async (type) => {
                const {cache, processPokemonData} = get();
                set({loading: true, error: null, pokemons: []});

                try {
                    // Проверяем кеш
                    const cacheKey = `type-${type}`;
                    if (cache[cacheKey]) {
                        set({pokemons: cache[cacheKey], loading: false});
                        return;
                    }

                    const pokemonsByType = await getPokemonsByType(type);

                    const detailedPokemons = await Promise.all(
                        pokemonsByType.slice(0, 20).map(async (pokemonData) => {
                            return processPokemonData(pokemonData.pokemon.name);
                        })
                    );

                    const filteredPokemons = detailedPokemons.filter(Boolean);

                    // Проверяем, не был ли фильтр сброшен во время загрузки
                    const currentState = get();
                    if (currentState.selectedType !== type) {
                        return;
                    }

                    // Проверяем были ли найдены покемоны
                    const errorMessage = filteredPokemons.length === 0 ? 'Покемоны не найдены' : null;

                    let updatedCache = {...cache, [cacheKey]: filteredPokemons};
                    updatedCache = manageCacheSize(updatedCache);
                    set({
                        pokemons: filteredPokemons,
                        loading: false,
                        hasMore: false,
                        error: errorMessage,
                        cache: updatedCache
                    });
                } catch (error) {
                    set({error: getUserFriendlyErrorMessage(error, 'POKEMON_LOAD'), loading: false});
                }
            },

            searchPokemons: async (query) => {
                // Если запрос не изменился, не делаем новый поиск
                if (query === get().searchQuery) return;

                set({loading: true, error: null, pokemons: [], searchQuery: query});

                if (!query.trim()) {
                    set({searchQuery: '', loading: false, offset: 0});
                    get().fetchPokemons();
                    return;
                }

                try {
                    const lowerQuery = query.trim().toLowerCase();
                    // 1. Получаем список всех покемонов (имя, url)
                    const data = await getPokemonList(1000, 0);

                    // 2. Получаем ru-имена для всех покемонов
                    const namesRu = await Promise.all(data.results.map(p => getPokemonNameRu(p.name)));
                    // 3. Фильтруем по подстроке (en/ru/id)
                    const filtered = data.results.filter((pokemon, idx) => {
                        const name = pokemon.name.toLowerCase();
                        const nameRu = namesRu[idx] ? namesRu[idx].toLowerCase() : '';
                        // id можно получить из url
                        const idMatch = pokemon.url.match(/\/pokemon\/(\d+)\/?$/);
                        const id = idMatch ? idMatch[1] : '';
                        return (
                            name.includes(lowerQuery) ||
                            nameRu.includes(lowerQuery) ||
                            id === lowerQuery
                        );
                    });

                    // 3. Ограничиваем количество (например, 20)
                    const limited = filtered.slice(0, 20);

                    // 4. Загружаем подробности только для них
                    const detailed = await Promise.all(limited.map(async (p) => {
                        try {
                            const detailedPokemon = await getPokemonByNameOrId(p.name);
                            return {
                                id: detailedPokemon.id,
                                name: detailedPokemon.name,
                                nameRu: await getPokemonNameRu(detailedPokemon.name) || detailedPokemon.name,
                                types: detailedPokemon.types,
                                sprites: detailedPokemon.sprites,
                                stats: detailedPokemon.stats,
                                abilities: detailedPokemon.abilities,
                                height: detailedPokemon.height,
                                weight: detailedPokemon.weight,
                            };
                        } catch {
                            return null;
                        }
                    }));
                    const filteredDetailed = detailed.filter(Boolean);

                    if (filteredDetailed.length > 0) {
                        set({
                            pokemons: filteredDetailed,
                            loading: false,
                            hasMore: false
                        });
                    } else {
                        set({
                            pokemons: [],
                            error: null,
                            loading: false,
                            hasMore: false
                        });
                    }
                } catch {
                    set({
                        pokemons: [],
                        error: 'Ошибка поиска покемонов',
                        loading: false,
                        hasMore: false
                    });
                }
            },

            setSelectedType: (type) => {
                // Сохраняем текущее состояние перед обновлением
                const currentState = get();
                const {selectedGeneration} = currentState;

                // Если тип не указан, устанавливаем null
                const newType = type || null;

                // Обновляем состояние с указанием загрузки
                set({selectedType: newType, pokemons: [], offset: 0, loading: true});

                // Используем Promise.resolve() вместо setTimeout для микрозадачи
                Promise.resolve().then(() => {
                    // Проверяем комбинацию фильтров
                    if (newType && selectedGeneration) {
                        // Если выбраны и тип и поколение
                        get().fetchCombinedFilter(newType, selectedGeneration);
                    } else if (newType) {
                        // Если выбран только тип
                        get().fetchPokemonsByType(newType);
                    } else if (selectedGeneration) {
                        // Если выбран только generation
                        get().fetchPokemonsByGeneration(selectedGeneration);
                    } else {
                        // Если нет активных фильтров
                        get().fetchPokemons();
                    }
                });
            },

            resetSearch: () => {
                // Создаем уникальный идентификатор запроса для защиты от гонок
                const requestId = Date.now();

                // Сбрасываем все состояния фильтрации
                set({
                    searchQuery: '',
                    pokemons: [],
                    offset: 0,
                    selectedType: null,
                    selectedGeneration: null,
                    hasMore: true,
                    loading: true,
                    error: null,
                    lastRequestId: requestId
                });

                // Используем Promise.resolve с небольшой задержкой через requestAnimationFrame для плавного UI
                requestAnimationFrame(() => {
                    // Проверяем, не был ли этот запрос перезаписан новым
                    if (get().lastRequestId === requestId) {
                        get().fetchPokemons();
                    } else {
                        // Удалено все console.log/info/debug по всему файлу
                    }
                });
            },

            clearSelectedPokemon: () => {
                // Сбрасываем все связанные с выбором покемона состояния
                set({
                    selectedPokemon: null,
                    pokemonDetails: null,
                    species: null,
                    evolutionChain: null,
                    searchQuery: '',
                    selectedType: null,
                    selectedGeneration: null,
                    pokemons: [],
                    offset: 0,
                    hasMore: true,
                    loading: true
                });

                // Используем Promise.resolve для микрозадачи вместо setTimeout
                Promise.resolve().then(() => {
                    get().fetchPokemons();
                });
            },

            fetchGenerations: async () => {
                const {cache} = get();
                set({loading: true, error: null});

                try {
                    // Проверяем кеш
                    const cacheKey = 'generations';
                    if (cache[cacheKey]) {
                        set({generations: cache[cacheKey], loading: false});
                        return;
                    }

                    const generations = await getGenerations();

                    // Сортируем поколения по номеру (извлекаем из URL)
                    const sortedGenerations = generations.sort((a, b) => {
                        const aId = parseInt(a.url.split('/').filter(Boolean).pop());
                        const bId = parseInt(b.url.split('/').filter(Boolean).pop());
                        return aId - bId;
                    });

                    // Обновляем кеш
                    let updatedCache = {...cache};
                    updatedCache = manageCacheSize(updatedCache);
                    updatedCache[cacheKey] = sortedGenerations;

                    set({generations: sortedGenerations, loading: false, cache: updatedCache});
                } catch (error) {
                    set({error: error instanceof Error ? error : new Error(error?.message || error), loading: false});
                }
            },

            setSelectedGeneration: (generation) => {
                // Сохраняем текущее состояние перед обновлением
                const currentState = get();
                const {selectedType} = currentState;

                // Обновляем состояние с указанием загрузки
                set({selectedGeneration: generation, pokemons: [], offset: 0, loading: true});

                // Используем Promise.resolve для микрозадачи вместо setTimeout
                Promise.resolve().then(() => {

                    // Проверяем комбинацию фильтров
                    if (generation && selectedType) {
                        // Если выбраны и тип и поколение
                        get().fetchCombinedFilter(selectedType, generation);
                    } else if (generation) {
                        // Если выбрано только поколение
                        get().fetchPokemonsByGeneration(generation);
                    } else if (selectedType) {
                        // Если выбран только тип
                        get().fetchPokemonsByType(selectedType);
                    } else {
                        // Если нет активных фильтров
                        get().fetchPokemons();
                    }
                });
            },

            // Функция для комбинированной фильтрации по типу и поколению
            fetchCombinedFilter: async (type, generationId) => {
                const {cache} = get();
                set({loading: true, error: null});

                try {
                    // Проверяем кеш
                    const cacheKey = `combined-${type}-${generationId}`;
                    if (cache[cacheKey]) {
                        set({
                            pokemons: cache[cacheKey],
                            loading: false,
                            hasMore: false
                        });
                        return;
                    }

                    // Получаем список покемонов выбранного поколения
                    const generation = await getGenerationDetails(generationId);
                    const pokemonSpeciesInGeneration = generation.pokemon_species;

                    // Получаем список покемонов выбранного типа
                    const pokemonsByType = await getPokemonsByType(type);
                    const pokemonNamesOfType = pokemonsByType.map(p => p.pokemon.name);

                    // Создаем Set для быстрого поиска
                    const typeNamesSet = new Set(pokemonNamesOfType);

                    // Получаем детальную информацию о покемонах, которые соответствуют обоим фильтрам
                    const detailedPokemons = await Promise.all(
                        pokemonSpeciesInGeneration.map(async (species) => {
                            try {
                                // Извлекаем ID из URL
                                const speciesId = species.url.split('/').filter(Boolean).pop();

                                // Проверяем, есть ли этот покемон в списке типов
                                // Для этого получаем детальную информацию о покемоне
                                const detailedPokemon = await getPokemonByNameOrId(speciesId);

                                // Проверяем, соответствует ли покемон выбранному типу
                                if (typeNamesSet.has(detailedPokemon.name)) {
                                    return {
                                        id: detailedPokemon.id,
                                        name: detailedPokemon.name,
                                        nameRu: await getPokemonNameRu(detailedPokemon.name) || detailedPokemon.name,
                                        types: detailedPokemon.types,
                                        sprites: detailedPokemon.sprites,
                                        stats: detailedPokemon.stats,
                                        abilities: detailedPokemon.abilities,
                                        height: detailedPokemon.height,
                                        weight: detailedPokemon.weight,
                                        generation: generationId
                                    };
                                }
                                return null;
                            } catch (err) {
                                logError(`Ошибка при загрузке данных покемона ${species.name}:`, err);
                                return null;
                            }
                        })
                    );

                    const filteredPokemons = detailedPokemons.filter(p => p !== null);

                    // Обновляем кеш
                    let updatedCache = {...cache};
                    updatedCache = manageCacheSize(updatedCache);
                    updatedCache[cacheKey] = filteredPokemons;

                    // Проверяем, не были ли фильтры сброшены во время загрузки
                    const currentState = get();
                    if (currentState.selectedType !== type || currentState.selectedGeneration !== generationId) {
                        return;
                    }

                    set({
                        pokemons: filteredPokemons,
                        loading: false,
                        cache: updatedCache,
                        hasMore: false,
                        error: filteredPokemons.length === 0 ? 'Покемоны не найдены' : null
                    });
                } catch (error) {
                    set({error: error instanceof Error ? error : new Error(error?.message || error), loading: false});
                }
            },

            fetchPokemonsByGeneration: async (generationId) => {
                const {cache, generationPokemons} = get();
                set({loading: true, error: null, currentGeneration: generationId});

                try {
                    // Проверяем, есть ли уже данные для этого поколения в generationPokemons
                    if (generationPokemons[generationId]) {
                        set({loading: false});
                        return;
                    }

                    // Проверяем кеш
                    const cacheKey = `generation-${generationId}`;
                    if (cache[cacheKey]) {
                        set({
                            generationPokemons: {
                                ...generationPokemons,
                                [generationId]: cache[cacheKey]
                            },
                            loading: false
                        });
                        return;
                    }

                    const generation = await getGenerationDetails(generationId);
                    const pokemonSpecies = generation.pokemon_species;

                    // Получаем детальную информацию о первых 20 покемонах для отображения
                    const detailedPokemons = await Promise.all(
                        pokemonSpecies.slice(0, 20).map(async (species) => {
                            try {
                                // Извлекаем ID из URL вида https://pokeapi.co/api/v2/pokemon-species/1/
                                const speciesId = species.url.split('/').filter(Boolean).pop();
                                const detailedPokemon = await getPokemonByNameOrId(speciesId);
                                return {
                                    id: detailedPokemon.id,
                                    name: detailedPokemon.name,
                                    nameRu: await getPokemonNameRu(detailedPokemon.name) || detailedPokemon.name,
                                    types: detailedPokemon.types,
                                    sprites: detailedPokemon.sprites,
                                    stats: detailedPokemon.stats,
                                    abilities: detailedPokemon.abilities,
                                    height: detailedPokemon.height,
                                    weight: detailedPokemon.weight,
                                    generation: generationId
                                };
                            } catch (err) {
                                logError(`Ошибка при загрузке данных покемона ${species.name}:`, err);
                                return null;
                            }
                        })
                    );

                    const filteredPokemons = detailedPokemons.filter(p => p !== null);

                    // Обновляем кеш
                    let updatedCache = {...cache};
                    updatedCache = manageCacheSize(updatedCache);
                    updatedCache[cacheKey] = filteredPokemons;

                    set({
                        generationPokemons: {
                            ...generationPokemons,
                            [generationId]: filteredPokemons
                        },
                        pokemons: filteredPokemons,
                        loading: false,
                        cache: updatedCache,
                        hasMore: false
                    });
                } catch (error) {
                    set({error: error instanceof Error ? error : new Error(error?.message || error), loading: false});
                }
            },


            clearAll: () => {
                set({
                    pokemons: [],
                    generations: [],
                    generationPokemons: {},
                    currentGeneration: null,
                    loading: false,
                    error: null,
                    selectedPokemon: null,
                    pokemonDetails: null,
                    species: null,
                    evolutionChain: null,
                    offset: 0,
                    hasMore: true,
                    searchQuery: '',
                    selectedType: null,
                    selectedGeneration: null,
                    cache: {} // Очищаем кеш для предотвращения утечек памяти
                });
            },

            // Метод для очистки кеша при низком уровне памяти
            clearCache: () => {
                set({ cache: {} });
            }
        }), {
            name: 'pokemon-storage', // уникальное имя для localStorage
            storage: safeLocalStorage,
            partialize: (state) => ({
                // Сохраняем только нужные данные
                pokemonTypes: state.pokemonTypes,
                generations: state.generations,
                selectedType: state.selectedType,
                selectedGeneration: state.selectedGeneration,
                cache: manageCacheSize(state.cache, MAX_CACHE_SIZE),
                // Не сохраняем кеш и подробные данные о покемонах!
                // Не сохраняем временные данные
                loading: false,
                error: null
            }),
        }
    ));

// Реализация функции для загрузки и преобразования списка покемонов
async function fetchPokemonsFromApi(offset, limit) {
    // Получаем список покемонов (метаданные)
    const data = await getPokemonList(limit, offset);
    // Возвращаем только базовую информацию (имя, id)
    const pokemons = data.results.map((p, idx) => {
        // id можно получить из url
        const idMatch = p.url.match(/\/pokemon\/(\d+)\/?$/);
        const id = idMatch ? parseInt(idMatch[1], 10) : offset + idx + 1;
        return {
            id,
            name: p.name
        };
    });
    return pokemons;
}

export default usePokemonStore;
