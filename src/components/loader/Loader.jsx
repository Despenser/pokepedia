import React from 'react';
import './Loader.css';

export const Loader = () => {
    return (
        <div className="loader-container">
            <picture>
                <source srcSet="/pokeball/pokeball-header.webp" type="image/webp"/>
                <img src="/pokeball/pokeball-header.png" alt="Loading..." className="pokeball-image" loading="lazy" width={40} height={40}/>
            </picture>
        </div>
    );
};
