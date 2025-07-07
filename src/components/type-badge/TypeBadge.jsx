import { getColorByType } from '../../utils/colorUtils.js';
import { getTypeNameRu } from '../../utils/localizationUtils.js';
import './TypeBadge.css';

const TypeBadge = ({ type, onClick, isActive = false, large = false }) => {
  const backgroundColor = getColorByType(type);
  const displayName = getTypeNameRu(type);

  const badgeClasses = [
    'type-badge',
    large ? 'large' : '',
    isActive ? 'active' : '',
    onClick ? 'clickable' : ''
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={badgeClasses}
      style={{ 
        backgroundColor,
        color: '#ffffff',
        textShadow: '0 1px 1px rgba(0, 0, 0, 0.5)'
      }}
      onClick={onClick ? () => onClick(type) : undefined}
    >
      {displayName}
    </div>
  );
};

export default TypeBadge;
