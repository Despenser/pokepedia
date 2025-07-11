import React from 'react';
import { Footer } from '../components/footer/Footer.jsx';
import LegendaryContent from '../components/legendary/LegendaryContent.jsx';
import { useLegendaryPokemons } from '../hooks/useLegendaryPokemons.js';
import './LegendaryPage.css';

const LegendaryPage = () => {
  const { grouped, isLoading, error } = useLegendaryPokemons();

  return (
    <div className="favorites-page">
      <main className="main-content">
        <div className="container">
          <h1 className="favorites-title">Легендарные покемоны</h1>
          <LegendaryContent 
            grouped={grouped} 
            isLoading={isLoading} 
            error={error} 
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LegendaryPage; 