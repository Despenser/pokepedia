import {Footer} from '../components/footer/Footer.jsx';
import {ErrorMessage} from '../components/error-message/ErrorMessage.jsx';
import {ERROR_MESSAGES} from "../utils/errors.js";

const NotFoundPage = () => {
    return (
        <div className="not-found-page">
            {/* <Header /> удалён */}
            <main className="main-content">
                <ErrorMessage
                    // message="Страница, которую вы ищете, не существует"
                    code="404"
                />
            </main>
            <Footer/>
        </div>
    );
};

export default NotFoundPage;
