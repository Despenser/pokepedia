import React, { memo } from 'react';
import { getColorByType, getContrastTextColor } from '../../utils/colorUtils.js';
import { getTypeNameRu } from '../../utils/localizationUtils.js';
import Badge from '../shared/Badge.jsx';

export const TypeBadge = memo(({ type, onClick, isActive = false, large = false }) => {
    const backgroundColor = getColorByType(type);
    const textColor = getContrastTextColor(backgroundColor);
    const displayName = getTypeNameRu(type);
    return (
        <Badge
            label={displayName}
            color={backgroundColor}
            textColor={textColor}
            active={isActive}
            clickable={!!onClick}
            onClick={onClick ? () => onClick(type) : undefined}
            size={large ? 'large' : 'default'}
            bordered={true}
        />
    );
});