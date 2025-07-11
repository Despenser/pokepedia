import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getGradientByTypes } from '../../utils/colorUtils.js';
import { formatPokemonId, formatPokemonName } from '../../utils/formatUtils.js';
import { getPokemonImage, getFallbackImage } from '../../utils/imageUtils.js';
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

    // Получаем URL изображения и запасного изображения
    const imageUrl = useMemo(() => getPokemonImage(sprites, id), [sprites, id]);
    const fallbackUrl = useMemo(() => getFallbackImage(id), [id]);

    // Мемоизируем вычисляемые значения для оптимизации
    const background = useMemo(() => getGradientByTypes(types), [types]);
    const displayName = useMemo(() => formatPokemonName(name, pokemon?.nameRu), [name, pokemon?.nameRu]);
    const formattedId = useMemo(() => formatPokemonId(id), [id]);

    // Используем хук для управления загрузкой изображения
    const { isLoaded, handleLoad, handleError } = useImageLoad({
        fallbackSrc: fallbackUrl
    });

    // Мемоизируем типы покемона для предотвращения ненужных перерисовок
    const typesBadges = useMemo(() => {
        return types?.map((typeInfo) => (
            <TypeBadge key={`${id}-${typeInfo.type.name}`} type={typeInfo.type.name} />
        ));
    }, [types, id]);

    // Проверка наличия данных
    if (!pokemon) return null;

    const cardContent = (
        <div
            className={`pokemon-card ${isLoaded ? 'loaded' : ''} ${className}`}
            style={{ background }}
        >
            <div className="pokemon-card-content">
                <div className="pokemon-card-header">
                    <h2 className="pokemon-name">{displayName}</h2>
                    <span className="pokemon-id">{formattedId}</span>
                </div>

                <div className="pokemon-image-container">
                    {!isLoaded && <div className="pokemon-image-skeleton" aria-hidden="true"></div>}
                    <img
                        src={imageUrl}
                        alt={displayName}
                        className="pokemon-image"
                        style={{ opacity: isLoaded ? 1 : 0 }}
                        loading="eager"
                        fetchPriority="high"
                        onLoad={handleLoad}
                        onError={handleError}
                        width="150"
                        height="150"
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
        <Link to={`/pokemon/${id}`} className="pokemon-card-link" aria-label={`Покемон ${displayName}, ${formattedId}`}>
            {cardContent}
        </Link>
    );
});

// Добавляем отображаемое имя для отладки
PokemonCard.displayName = 'PokemonCard';

export default PokemonCard;