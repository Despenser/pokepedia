import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {App} from './components/app/App.jsx'
import './index.css'
import './styles/theme.css'
import './styles/animations.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)