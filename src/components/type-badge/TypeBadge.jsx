import React from 'react';
import { getColorByType, getContrastTextColor } from '../../utils/colorUtils.js';
import { getTypeNameRu } from '../../utils/localizationUtils.js';
import './TypeBadge.css';
import { memo } from 'react';

export const TypeBadge = memo(({ type, onClick, isActive = false, large = false }) => {

    const backgroundColor = getColorByType(type);
    const textColor = getContrastTextColor(backgroundColor);
    const displayName = getTypeNameRu(type);

    const badgeClasses = [
        'type-badge',
        large ? 'large' : '',
        isActive ? 'active' : '',
        onClick ? 'clickable' : ''
    ].filter(Boolean).join(' ');

    return (
        <div className={ badgeClasses }
            style={{ backgroundColor, color: textColor }}
            onClick={ onClick ? () => onClick(type) : undefined }
        >
            { displayName }
        </div>
    );
});