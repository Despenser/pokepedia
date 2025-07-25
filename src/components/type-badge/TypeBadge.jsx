import React, { memo, useEffect, useState } from 'react';
import { getColorByType, getContrastTextColor } from '../../utils/colorUtils.js';
import { getTypeNameRuAsync } from '../../utils/localizationUtils.js';
import Badge from '../shared/Badge.jsx';

export const TypeBadge = memo(({ type, onClick, isActive = false, large = false }) => {
    const backgroundColor = getColorByType(type);
    const textColor = getContrastTextColor(backgroundColor);
    const [displayName, setDisplayName] = useState(type);
    useEffect(() => {
        let mounted = true;
        getTypeNameRuAsync(type).then(res => { if (mounted) setDisplayName(res); });
        return () => { mounted = false; };
    }, [type]);
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