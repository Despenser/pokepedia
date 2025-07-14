import './Loader.css';

export const Loader = () => {
  return (
    <div className="loader-container">
      <picture>
        <source srcSet="/pokeball-header.webp" type="image/webp" />
        <img src="/pokeball-header.png" alt="Loading..." className="pokeball-image" loading="lazy" />
      </picture>
    </div>
  );
};


