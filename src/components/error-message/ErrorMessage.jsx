import { Link, useLocation } from 'react-router-dom';
import { getErrorInfo } from '../../utils/errorHandlingUtils';
import './ErrorMessage.css';

/**
 * Универсальный компонент для отображения ошибок
 * @param {Object|null} error - Объект ошибки или null
 * @param {string} code - Код ошибки (404, 500 и т.д.) для выбора картинки
 * @param {boolean} hasBackButton - Показывать ли кнопку возврата на главную (по умолчанию true)
 */
export const ErrorMessage = ({ error, code, hasBackButton = true }) => {
    const location = useLocation();
    const errorInfo = getErrorInfo(error, code);
    const errorCode = code || (error && error.status ? error.status.toString() : null);
    const errorImages = {
        '404': '/error-404.png',
        '500': '/error-500.png',
        'default': '/error-500.png'
    };
    const imageUrl = errorImages[errorCode] || errorImages.default;

    // Кнопка не показывается, если уже на главной или hasBackButton === false
    const showBackButton = hasBackButton && location.pathname !== '/';

    return (
        <div className="error-container">
            <div className="error-content">
                <img src={imageUrl} alt="Ошибка" className="error-image"/>
                <h2>{errorInfo.title}</h2>
                <p>{errorInfo.message}</p>
                <div className="error-actions">
                    {showBackButton && (
                        <Link to="/" className="back-button">Вернуться на главную</Link>
                    )}
                </div>
            </div>
        </div>
    );
};


