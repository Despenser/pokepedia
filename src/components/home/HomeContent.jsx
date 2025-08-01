import React, {useMemo} from 'react';
import {Loader} from '../loader/Loader';
import PokemonList from '../pokemon-list/PokemonList';

/**
 * Компонент для отображения основного контента главной страницы
 */
export const HomeContent = ({loading, offset, pokemons}) => {
    // Мемоизируем условие для отображения загрузчика
    const shouldShowLoader = useMemo(() => {
        return loading && offset === 0 && pokemons.length === 0;
    }, [loading, offset, pokemons.length]);

    return (
        <>
            {/* Индикатор обновления данных */}
            {loading && <div className="filter-updating">Обновление данных...</div>}

            {shouldShowLoader ? <Loader/> : <PokemonList/>}
        </>
    );
};
