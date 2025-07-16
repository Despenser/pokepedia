import React, { useEffect, useState } from 'react';
import EvoMiniCard from '../evolution-graph/EvoMiniCard.jsx';
import { Link } from 'react-router-dom';
import { getPokemonByNameOrId } from '../../api/pokeApi';
import './AlternativeForms.css';

/**
 * Альтернативные формы покемона (например, mega, gmax)
 * @param {Object} props
 * @param {Object} props.species - species-объект покемона
 * @param {Object} props.pokemon - текущий покемон (для фильтрации)
 */
const AlternativeForms = ({ species, pokemon }) => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!species || !species.varieties) {
      setForms([]);
      setLoading(false);
      return;
    }
    const fetchForms = async () => {
      setLoading(true);
      // Фильтруем текущую форму
      const altVarieties = species.varieties.filter(
        v => !v.is_default && v.pokemon.name !== pokemon.name
      );
      // Загружаем данные по каждой форме
      const detailed = await Promise.all(
        altVarieties.map(async v => {
          try {
            const data = await getPokemonByNameOrId(v.pokemon.name);
            return data;
          } catch {
            return null;
          }
        })
      );
      setForms(detailed.filter(Boolean));
      setLoading(false);
    };
    fetchForms();
  }, [species, pokemon]);

  if (loading || !species || !species.varieties) return null;
  if (forms.length === 0) return null;

  return (
    <div className="alternative-forms-section">
      <h2 className="evolution-section-title">Альтернативные формы</h2>
      <div className="alternative-forms-row">
        {forms.map(form => (
          <Link to={`/pokemon/${form.id}`} key={form.id} className="mini-pokemon-link">
            <EvoMiniCard
              id={form.id}
              name={form.name}
              sprites={form.sprites || {}}
              types={form.types || []}
              isCurrent={false}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AlternativeForms; 