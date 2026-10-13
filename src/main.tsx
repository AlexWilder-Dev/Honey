import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/libre-caslon-text/latin-400.css'
import '@fontsource/libre-caslon-text/latin-400-italic.css'
import '@fontsource/della-respira/latin-400.css'
import '@fontsource-variable/jost/wght.css'
import './styles/base.css'
import './styles/chrome.css'
import './styles/hero.css'
import './styles/home.css'
import './styles/menu.css'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
