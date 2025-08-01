import React, {memo} from 'react';
import TypesFilter from '../types-filter/TypesFilter';
import {GenerationsFilter} from '../generations-filter/GenerationsFilter';
import Button from '../shared/Button.jsx';

/**
 * Компонент для отображения фильтров на главной странице
 */
const HomeFilters = memo(({selectedType, selectedGeneration, onResetFilters}) => {
    return (
        <div className="filters-container">
            <TypesFilter/>
            <GenerationsFilter/>
            {(selectedType || selectedGeneration) && (
                <Button
                    variant="secondary"
                    className="reset-all-filters"
                    onClick={onResetFilters}
                >
                    Сбросить все фильтры
                </Button>
            )}
        </div>
    );
});

export default HomeFilters; 