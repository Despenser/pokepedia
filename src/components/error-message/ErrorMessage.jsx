import { Link } from 'react-router-dom';
import { getErrorInfo } from '../../utils/errorHandlingUtils';
import { ERROR_MESSAGES } from '../../utils/errors';
import './ErrorMessage.css';

/**
 * Компонент для отображения сообщений об ошибках
 * @param {Object|string} message - Сообщение об ошибке или объект ошибки
 * @param {string} code - Код ошибки (404, 500 и т.д.)
 * @param {string} errorType - Тип ошибки из ERROR_MESSAGES для автоматического выбора сообщения
 * @param {boolean} hasBackButton - Показывать ли кнопку возврата на главную
 * @returns {JSX.Element} Компонент сообщения об ошибке
 */
export const ErrorMessage = ({message, code, errorType, hasBackButton = true}) => {

    const errorCode = code || (message && message.status ? message.status.toString() : null);
    let errorInfo;

    if (typeof message === 'string') {
        errorInfo = {
            title: ERROR_MESSAGES.DEFAULT.title,
            message: message
        };
    } else if (errorCode && ERROR_MESSAGES[errorCode]) {
        errorInfo = ERROR_MESSAGES[errorCode];
    } else if (errorType) {
        errorInfo = getErrorInfo(null, errorType);
    } else if (message && typeof message === 'object') {
        errorInfo = getErrorInfo(message);
    } else {
        errorInfo = ERROR_MESSAGES.DEFAULT;
    }

    const errorImages = {
        '404': '/error-404.png',
        '500': '/error-500.png',
        'default': '/error-generic.png'
    };

    // Выбираем изображение для ошибки
    const imageUrl = errorImages[errorCode] || errorImages.default;

    return (
        <div className="error-container">
            <div className="error-content">
                <img src={imageUrl} alt="Ошибка" className="error-image"/>
                <h2>{errorInfo.title}</h2>
                <p>{errorInfo.message}</p>
                <div className="error-actions">
                    {hasBackButton && (
                        <Link to="/" className="back-button">Вернуться на главную</Link>
                    )}
                </div>
            </div>
        </div>
    );
};


