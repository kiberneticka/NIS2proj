import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { I18nextProvider } from 'react-i18next'
import i18next from 'i18next'
import hr from './locales/hr.json' // Pretpostavlja da hr.json postoji
import en from './locales/en.json' // Pretpostavlja da en.json postoji
import de from './locales/de.json' // Pretpostavlja da de.json postoji
import it from './locales/it.json' // Pretpostavlja da it.json postoji
import sl from './locales/sl.json' // Pretpostavlja da sl.json postoji
import es from './locales/es.json' // Pretpostavlja da es.json postoji

// Dodajte minimalne potrebne prijevode ako ne postoje
if (!hr.translation) {
    hr.translation = {
        title: "NIS2 GAP Analiza",
        compliance: "Trenutna usklađenost",
        demoLimit: "Trenutno u DEMO modu (6/18 kontrola)",
        "Nije započeto": "Nije započeto",
        "Neusklađeno": "Neusklađeno",
        "Djelomično": "Djelomično",
        "Usklađeno": "Usklađeno"
    };
}
if (!en.translation) {
    en.translation = {
        title: "NIS2 GAP Analysis",
        compliance: "Current Compliance Level",
        demoLimit: "Currently in DEMO mode (6/18 controls)",
        "Nije započeto": "Not Started",
        "Neusklađeno": "Non-Compliant",
        "Djelomično": "Partial",
        "Usklađeno": "Compliant"
    };
}


i18next.init({
  interpolation: { escapeValue: false },
  lng: 'hr',
  resources: { hr: { translation: hr.translation }, en: { translation: en.translation }, de: { translation: de.translation }, it: { translation: it.translation }, sl: { translation: sl.translation }, es: { translation: es.translation } }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18next}>
      <App />
    </I18nextProvider>
  </React.StrictMode>
)