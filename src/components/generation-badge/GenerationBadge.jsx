import './GenerationBadge.css';

const GenerationBadge = ({ generation, onClick, isActive = false }) => {
  // Функция для локализации названий поколений
  const localizeGenerationName = (name) => {
    const generationMap = {
      'generation-i': 'I',
      'generation-ii': 'II',
      'generation-iii': 'III',
      'generation-iv': 'IV',
      'generation-v': 'V',
      'generation-vi': 'VI',
      'generation-vii': 'VII',
      'generation-viii': 'VIII',
      'generation-ix': 'IX'
    };
    return generationMap[name] || name;
  };

  const badgeClasses = [
    'generation-badge',
    isActive ? 'active' : '',
    onClick ? 'clickable' : ''
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={badgeClasses}
      onClick={onClick ? () => onClick(generation) : undefined}
    >
      {localizeGenerationName(generation)}
    </div>
  );
};

export default GenerationBadge;
