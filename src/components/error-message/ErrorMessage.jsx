import {Link} from 'react-router-dom';
import './ErrorMessage.css';

const ErrorMessage = ({message, code, hasBackButton = true}) => {

  const errorImages = {
      '404': '/error-404.png',
      '500': '/error-500.png',
      'default': '/error-generic.png'
  };

  const errorTitles = {
      '404': 'Страница не найдена',
      '500': 'Что-то пошло не так',
      'default': 'Произошла ошибка'
  };

    const imageUrl = errorImages[code] || errorImages.default;
    const title = errorTitles[code] || errorTitles.default;

    return (
        <div className="error-container">
            <div className="error-content">
                <img src={imageUrl} alt="Ошибка" className="error-image"/>
                <h2>{title}</h2>
                <p>{message || 'Попробуйте перезагрузить страницу или вернуться на главную'}</p>

                {hasBackButton && (
                    <div className="error-actions">
                        <Link to="/" className="back-button">Вернуться на главную</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ErrorMessage;
