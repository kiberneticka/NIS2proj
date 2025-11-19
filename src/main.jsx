import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import i18next from 'i18next'
import { I18nextProvider } from 'react-i18next'

// Uvoz jezičnih datoteka: 
// Morate osigurati da su sve ove datoteke prisutne u mapi src/locales.
import hr from './locales/hr.json' 
import en from './locales/en.json' 
import de from './locales/de.json' // Rješava Uncaught ReferenceError: de is not defined
import it from './locales/it.json' 
import sl from './locales/sl.json' 
import es from './locales/es.json' 

i18next.init({
    interpolation: { escapeValue: false },
    lng: 'hr',
    resources: { 
        hr: { translation: hr.translation }, 
        en: { translation: en.translation }, 
        de: { translation: de.translation }, 
        it: { translation: it.translation }, 
        sl: { translation: sl.translation }, 
        es: { translation: es.translation } 
    }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18next}>
      <App />
    </I18nextProvider>
  </React.StrictMode>,
)