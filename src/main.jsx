import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './locales'
import i18n from './locales'

// Inicializar português brasileiro imediatamente
i18n.changeLanguage('pt-br')

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
