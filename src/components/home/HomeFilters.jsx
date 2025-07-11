import React from 'react';
import TypesFilter from '../types-filter/TypesFilter';
import GenerationsFilter from '../generations-filter/GenerationsFilter';

/**
 * Компонент для отображения фильтров на главной странице
 */
const HomeFilters = ({ selectedType, selectedGeneration, onResetFilters }) => {
  return (
    <div className="filters-container">
      <TypesFilter />
      <GenerationsFilter />
      {(selectedType || selectedGeneration) && (
        <button
          className="reset-all-filters back-button"
          onClick={onResetFilters}
        >
          Сбросить все фильтры
        </button>
      )}
    </div>
  );
};

export default HomeFilters; 