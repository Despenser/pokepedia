import React, { useEffect, useState } from 'react';
import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getGradientByTypes, getColorByType, getContrastTextColor, getContrastTextColorOnTypeGradient } from '../../utils/colorUtils.js';
import { formatPokemonId, formatPokemonName } from '../../utils/formatUtils.js';
import { getLocalPokemonImage } from '../../utils/imageUtils.js';
import {useImageLoad} from '../../hooks/useImageLoad.js';
import {TypeBadge} from '../type-badge/TypeBadge.jsx';
import PokemonCardSkeleton from '../pokemon-card-skeleton/PokemonCardSkeleton.jsx';
import './PokemonCard.css';
import usePokemonStore from '../../store/pokemonStore.js';

/**
 * Компонент карточки покемона для отображения основной информации
 * @param {Object} props - Свойства компонента
 * @param {Object} props.pokemon - Данные покемона из API
 * @param {string} [props.className] - Дополнительные CSS классы для карточки
 * @param {boolean} [props.asDiv=false] - Рендерить как div вместо Link
 */
const PokemonCard = memo(({ pokemon, className = '', asDiv = false }) => {
    const { id, name, types, sprites } = pokemon || {};
    const [details, setDetails] = useState(null);
    const { processPokemonData } = usePokemonStore();

    // Асинхронная подгрузка деталей, если их нет
    useEffect(() => {
        let isMounted = true;
        if (id && name && (!types || !sprites)) {
            processPokemonData(id).then((data) => {
                if (isMounted && data) setDetails(data);
            });
        }
        return () => { isMounted = false; };
    }, [id, name, types, sprites, processPokemonData]);

    const fullPokemon = details || pokemon;
    const fullId = fullPokemon?.id ?? '';
    const fullName = fullPokemon?.name;
    const fullTypes = fullPokemon?.types;
    const fullSprites = fullPokemon?.sprites;

    // Получаем локальный путь к изображению
    // const { src: imageUrl } = useMemo(() => getLocalPokemonImage(id), [id]);
    const imageUrl = fullId ? `/official-artwork/${fullId}-150.webp` : '/official-artwork/unknown.webp';

    // Мемоизируем вычисляемые значения для оптимизации
    const background = useMemo(() => getGradientByTypes(fullTypes), [fullTypes]);
    const displayName = useMemo(() => formatPokemonName(fullName, fullPokemon?.nameRu), [fullName, fullPokemon?.nameRu]);
    const formattedId = useMemo(() => formatPokemonId(fullId), [fullId]);
    const nameTextColor = useMemo(() => getContrastTextColorOnTypeGradient(fullTypes, 'start', 'horizontal'), [fullTypes]);
    const idTextColor = useMemo(() => getContrastTextColorOnTypeGradient(fullTypes, 'end', 'horizontal'), [fullTypes]);

    // Используем хук для управления загрузкой изображения (без fallback)
    const { isLoaded, handleLoad } = useImageLoad();



    // Мемоизируем типы покемона для предотвращения ненужных перерисовок
    const typesBadges = useMemo(() => {
        return fullTypes?.map((typeInfo) => (
            <TypeBadge key={`${fullId || 'unknown'}-${typeInfo.type.name}`} type={typeInfo.type.name} />
        ));
    }, [fullTypes, fullId]);

    // Prefetch детальной страницы и данных покемона
    const handlePrefetch = () => {
        // Prefetch чанка страницы
        import('../../pages/pokemon-detail-page/PokemonDetailPage.jsx');
    };

    // Проверка наличия данных
    if (!fullPokemon) return null;

    // Если есть только имя и id — показываем минимальную карточку
    if (!fullTypes && !fullSprites) {
        return (
            <div className={`pokemon-card minimal ${className}`.trim()}>
                <div className="pokemon-card-content">
                    <div className="pokemon-card-header">
                        <h2 className="pokemon-name">{fullName}</h2>
                        <span className="pokemon-id">#{fullId || '?'}</span>
                    </div>
                </div>
            </div>
        );
    }

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
                        srcSet={fullId ? `/official-artwork/${fullId}-90.webp 90w, /official-artwork/${fullId}-120.webp 120w, /official-artwork/${fullId}-150.webp 150w, /official-artwork/${fullId}-200.webp 200w, /official-artwork/${fullId}-240.webp 240w, /official-artwork/${fullId}-300.webp 300w` : undefined}
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
            to={fullId ? `/pokemon/${fullId}` : '#'}
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