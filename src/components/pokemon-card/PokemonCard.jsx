import React from 'react';
import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getGradientByTypes, getColorByType, getContrastTextColor, getContrastTextColorOnTypeGradient } from '../../utils/colorUtils.js';
import { formatPokemonId, formatPokemonName } from '../../utils/formatUtils.js';
import { getLocalPokemonImage } from '../../utils/imageUtils.js';
import {useImageLoad} from '../../hooks/useImageLoad.js';
import {TypeBadge} from '../type-badge/TypeBadge.jsx';
import './PokemonCard.css';

/**
 * Компонент карточки покемона для отображения основной информации
 * @param {Object} props - Свойства компонента
 * @param {Object} props.pokemon - Данные покемона из API
 * @param {string} [props.className] - Дополнительные CSS классы для карточки
 * @param {boolean} [props.asDiv=false] - Рендерить как div вместо Link
 */
const PokemonCard = memo(({ pokemon, className = '', asDiv = false }) => {
    const { id, name, types, sprites } = pokemon || {};

    // Получаем локальный путь к изображению
    // const { src: imageUrl } = useMemo(() => getLocalPokemonImage(id), [id]);
    const imageUrl = `/official-artwork/${id}-150.webp`;

    // Мемоизируем вычисляемые значения для оптимизации
    const background = useMemo(() => getGradientByTypes(types), [types]);
    const displayName = useMemo(() => formatPokemonName(name, pokemon?.nameRu), [name, pokemon?.nameRu]);
    const formattedId = useMemo(() => formatPokemonId(id), [id]);
    const nameTextColor = useMemo(() => getContrastTextColorOnTypeGradient(types, 'start', 'horizontal'), [types]);
    const idTextColor = useMemo(() => getContrastTextColorOnTypeGradient(types, 'end', 'horizontal'), [types]);

    // Используем хук для управления загрузкой изображения (без fallback)
    const { isLoaded, handleLoad } = useImageLoad();



    // Мемоизируем типы покемона для предотвращения ненужных перерисовок
    const typesBadges = useMemo(() => {
        return types?.map((typeInfo) => (
            <TypeBadge key={`${id}-${typeInfo.type.name}`} type={typeInfo.type.name} />
        ));
    }, [types, id]);

    // Prefetch детальной страницы и данных покемона
    const handlePrefetch = () => {
        // Prefetch чанка страницы
        import('../../pages/pokemon-detail-page/PokemonDetailPage.jsx');
    };

    // Проверка наличия данных
    if (!pokemon) return null;

    const cardContent = (
        <div
            className={`pokemon-card ${isLoaded ? 'loaded' : ''} ${className}`}
            style={{ background }}
        >
            <div className="pokemon-card-content">
                <div className="pokemon-card-header">
                    <h2 className="pokemon-name" style={{ color: nameTextColor }}>{displayName}</h2>
                    <span className="pokemon-id" style={{ color: idTextColor }}>{formattedId}</span>
                </div>

                <div className="pokemon-image-container">
                    {!isLoaded && <div className="pokemon-image-skeleton" aria-hidden="true"></div>}
                    <img 
                        src={imageUrl} 
                        alt={name} 
                        loading="lazy" 
                        className="pokemon-image" 
                        onLoad={handleLoad} 
                        onError={e => { e.target.src = '/official-artwork/unknown.webp'; }}
                        srcSet={`/official-artwork/${id}-90.webp 90w, /official-artwork/${id}-120.webp 120w, /official-artwork/${id}-150.webp 150w, /official-artwork/${id}-200.webp 200w, /official-artwork/${id}-240.webp 240w, /official-artwork/${id}-300.webp 300w`}
                        sizes="(max-width: 600px) 100px, (max-width: 900px) 120px, 200px"
                    />
                </div>

                <div className="pokemon-types">
                    {typesBadges}
                </div>
            </div>
        </div>
    );

    if (asDiv) {
        return cardContent;
    }

    return (
        <Link
            to={`/pokemon/${id}`}
            className="pokemon-card-link"
            onMouseEnter={handlePrefetch}
            onFocus={handlePrefetch}
            onTouchStart={handlePrefetch}
        >
            {cardContent}
        </Link>
    );
});

// Добавляем отображаемое имя для отладки
PokemonCard.displayName = 'PokemonCard';

export default PokemonCard;