import React from 'react';
import Badge from '../shared/Badge.jsx';
import { getGenerationNameRu } from '../../utils/localizationUtils.js';
import { getColorByGeneration, getContrastTextColor } from '../../utils/colorUtils.js';

const GenerationBadge = ({ generation, onClick, isActive = false }) => {
  const nameRu = getGenerationNameRu(generation);
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

export default GenerationBadge;
