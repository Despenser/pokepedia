import {useState, useEffect, useMemo} from 'react';
import {getPokemonByNameOrId, getPokemonSpecies} from '../api/pokeApi';
import {getPokemonNameRu} from '../utils/localizationUtils';
import {LEGENDARY_NAMES, getSpeciesName} from '../utils/legendaryUtils';

/**
 * Хук для загрузки легендарных покемонов
 * @returns {Object} Объект с состоянием загрузки и данными
 */
export const useLegendaryPokemons = () => {
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

                        const nameRu = await getPokemonNameRu(pokemon.name);
                        return {
                            ...pokemon,
                            nameRu,
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

    return useMemo(() => ({grouped, isLoading, error}), [grouped, isLoading, error]);
}; 
