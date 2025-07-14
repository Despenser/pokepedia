import React from 'react';

/**
 * Компонент для отображения пустого состояния избранного
 */
const EmptyFavorites = () => {
  return (
    <div className="empty-favorites">
      <picture>
        <img src="/favorites.svg" alt="Нет избранных покемонов" className="empty-favorites-img" loading="lazy" />
      </picture>
      <h2>У вас пока нет избранных покемонов</h2>
      <p>Добавляйте покемонов в избранное, нажимая на значок сердечка на странице покемона</p>
    </div>
  );
};

export default EmptyFavorites; 