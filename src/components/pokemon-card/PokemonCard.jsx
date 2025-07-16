import React from 'react';
import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getGradientByTypes, getColorByType, getContrastTextColor } from '../../utils/colorUtils.js';
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
    const { src: imageUrl } = useMemo(() => getLocalPokemonImage(id), [id]);

    // Мемоизируем вычисляемые значения для оптимизации
    const background = useMemo(() => getGradientByTypes(types), [types]);
    const displayName = useMemo(() => formatPokemonName(name, pokemon?.nameRu), [name, pokemon?.nameRu]);
    const formattedId = useMemo(() => formatPokemonId(id), [id]);

    // Вычисляем основной цвет первого типа для подбора цвета текста
    const mainType = types?.[0]?.type?.name;
    const mainBgColor = mainType ? getColorByType(mainType) : undefined;
    const textColor = mainBgColor ? getContrastTextColor(mainBgColor) : undefined;

    // Используем хук для управления загрузкой изображения (без fallback)
    const { isLoaded, handleLoad } = useImageLoad();

    // Получаем адаптивные размеры изображения для предотвращения layout shift
    const getImageSize = () => {
      if (window.innerWidth <= 400) return 90;
      if (window.innerWidth <= 600) return 100;
      if (window.innerWidth <= 899) return 120;
      return 150;
    };
    const [imgSize, setImgSize] = React.useState(getImageSize());
    React.useEffect(() => {
      const handleResize = () => setImgSize(getImageSize());
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

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
                    <h2 className="pokemon-name" style={{ color: textColor }}>{displayName}</h2>
                    <span className="pokemon-id" style={{ color: textColor }}>{formattedId}</span>
                </div>

                <div className="pokemon-image-container">
                    {!isLoaded && <div className="pokemon-image-skeleton" aria-hidden="true"></div>}
                    <img 
                        src={imageUrl} 
                        alt={name} 
                        loading="lazy" 
                        width={imgSize} 
                        height={imgSize} 
                        className="pokemon-image" 
                        onLoad={handleLoad} 
                        onError={e => { e.target.src = '/official-artwork/unknown.webp'; }}
                        srcSet={`${imageUrl} 90w, ${imageUrl} 100w, ${imageUrl} 120w, ${imageUrl} 150w`}
                        sizes="(max-width: 400px) 90px, (max-width: 600px) 100px, (max-width: 899px) 120px, 150px"
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