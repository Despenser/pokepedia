import React from 'react';
import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { Loader } from './components/loader/Loader.jsx';
import './index.css';
import './styles/theme.css';
import './styles/animations.css';
import { HelmetProvider } from 'react-helmet-async';


const App = lazy(() => import('./components/app/App.jsx')
    .then(module => ({ default: module.App })));

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
    <StrictMode>
        <HelmetProvider>
            <Suspense fallback={ <Loader/> }>
                <App/>
            </Suspense>
        </HelmetProvider>
    </StrictMode>
);