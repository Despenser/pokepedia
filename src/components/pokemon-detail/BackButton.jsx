import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Компонент кнопки "Назад"
 */
const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button 
      className="back-button" 
      onClick={() => navigate(-1)}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: 8, verticalAlign: 'middle'}}>
        <path d="M15 18l-6-6 6-6"/>
      </svg>
      Назад
    </button>
  );
};

export default BackButton; 