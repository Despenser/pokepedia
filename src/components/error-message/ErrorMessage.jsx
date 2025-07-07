import {Link} from 'react-router-dom';
import { ERROR_MESSAGES, getErrorInfo } from '../../utils/errorHandlingUtils';
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
  // Определяем код ошибки на основе HTTP статуса, если он присутствует
  const errorCode = code || (message && message.status ? message.status.toString() : null);

  // Получаем информацию об ошибке
  let errorInfo;

  if (typeof message === 'string') {
    // Если передана строка сообщения
    errorInfo = {
      title: ERROR_MESSAGES.DEFAULT.title,
      message: message
    };
  } else if (errorCode && ERROR_MESSAGES[errorCode]) {
    // Если есть код ошибки и для него есть сообщение
    errorInfo = ERROR_MESSAGES[errorCode];
  } else if (errorType) {
    // Если указан тип ошибки
    errorInfo = getErrorInfo(null, errorType);
  } else if (message && typeof message === 'object') {
    // Если передан объект ошибки
    errorInfo = getErrorInfo(message);
  } else {
    // По умолчанию
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
                {message && typeof message === 'object' && message.stack && process.env.NODE_ENV === 'development' && (
                    <details className="error-details">
                        <summary>Техническая информация</summary>
                        <pre>{message.stack}</pre>
                    </details>
                )}

                <div className="error-actions">
                    {hasBackButton && (
                        <Link to="/" className="back-button">Вернуться на главную</Link>
                    )}
                    <button 
                        onClick={() => window.location.reload()} 
                        className="retry-button"
                    >
                        Повторить попытку
                    </button>
                </div>
            </div>
        </div>
    );
};


