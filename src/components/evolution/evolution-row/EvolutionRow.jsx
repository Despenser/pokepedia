import React from 'react';
import {Link} from 'react-router-dom';
import {getIdFromSpecies} from '../../../utils/evolutionUtils.js';
import UniversalPokemonCard from '../../shared/UniversalPokemonCard.jsx';

/**
 * Компонент для отображения линейной цепочки эволюции
 */
export const EvolutionRow = ({nodes, currentPokemonId}) => {
    return (
        <div className="evo-row">
            {nodes.map((node, idx) => {
                const id = getIdFromSpecies(node.species);
                const isCurrent = Number(currentPokemonId) === id;

                return (
                    <React.Fragment key={id}>
                        <Link to={`/pokemon/${id}`} className="mini-pokemon-link"
                              aria-label={`Покемон ${node.species.name}`}
                              style={{background: 'none', boxShadow: 'none', borderRadius: 0}}>
                            <UniversalPokemonCard
                                idOrName={id}
                                variant="evolution"
                                isCurrent={isCurrent}
                                className="mini-pokemon-card-evo"
                            />
                        </Link>
                        {idx < nodes.length - 1 && (
                            <div className="evo-row-arrow">
                                <svg width="48" height="32" viewBox="0 0 48 32">
                                    <line x1="0" y1="16" x2="36" y2="16" stroke="#888" strokeWidth="2.5"/>
                                    <polygon points="36,10 48,16 36,22" fill="#888"/>
                                </svg>
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

