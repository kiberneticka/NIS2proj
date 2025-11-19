// src/i18n/index.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Hrvatski prijevodi (točni, sa NIS2 ispravkama)
const hr = {
  heroSubtitle: 'Jedini Hrvatski alat koji ti omogućuje potpunu usklađenost s NIS2 direktivom – bez konzultanata, bez Excel tablica, bez stresa.',
  controlsCount: '10 obveznih mjera rizik upravljanja (Članak 21)',
  autoTracking: 'Automatsko praćenje napretka',
  pdfReport: 'PDF izvještaj u 1 kliku',
  demoButton: 'Pokreni Demo odmah',
  loginButton: 'Prijava za korisnike',
  trustedBy: 'Već koriste banke, energetski operateri i kritična infrastruktura u Hrvatskoj i regiji'
};

// Engleski prijevodi
const en = {
  heroSubtitle: 'The only Croatian tool that gives you full NIS2 Directive compliance – no consultants, no Excel, no stress.',
  controlsCount: '10 mandatory risk management measures (Article 21)',
  autoTracking: 'Automatic progress tracking',
  pdfReport: 'PDF report in 1 click',
  demoButton: 'Start Demo Now',
  loginButton: 'Login for Users',
  trustedBy: 'Already used by banks, energy operators and critical infrastructure in Croatia and the region'
};

i18n
  .use(LanguageDetector)  // Automatski detektira jezik
  .use(initReactI18next)
  .init({
    resources: {
      hr: { translation: hr },
      en: { translation: en }
    },
    lng: 'hr',  // Default: Hrvatski
    fallbackLng: 'hr',
    interpolation: {
      escapeValue: false  // React već escape-a
    }
  });

export default i18n;