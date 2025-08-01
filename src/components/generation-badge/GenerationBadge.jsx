import React, {useEffect, useState} from 'react';
import Badge from '../shared/Badge.jsx';
import {getGenerationNameRuAsync} from '../../utils/localizationUtils.js';
import {getColorByGeneration, getContrastTextColor} from '../../utils/colorUtils.js';

export const GenerationBadge = ({generation, onClick, isActive = false}) => {
    const [nameRu, setNameRu] = useState(generation);
    useEffect(() => {
        let mounted = true;
        getGenerationNameRuAsync(generation).then(res => {
            if (mounted) setNameRu(res);
        });
        return () => {
            mounted = false;
        };
    }, [generation]);
    const backgroundColor = getColorByGeneration(generation);
    const textColor = getContrastTextColor(backgroundColor);
    return (
        <Badge
            label={nameRu}
            color={backgroundColor}
            textColor={textColor}
            active={isActive}
            clickable={!!onClick}
            onClick={onClick ? () => onClick(generation) : undefined}
            size="default"
            bordered={true}
        />
    );
};
