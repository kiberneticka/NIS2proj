// src/components/LandingPage.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Globe, CheckCircle, Zap, FileText, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const { t, i18n } = useTranslation();

  // Postavi default jezik na hrvatski ako nije postavljen
  useEffect(() => {
    if (!i18n.language) {
      i18n.changeLanguage('hr');
    }
  }, [i18n]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <>
      {/* Language Switcher - gornji desni kut */}
      <div className="absolute top-6 right-6 z-50">
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl px-4 py-2">
          <Globe className="w-5 h-5 text-cyan-300" />
          <button
            onClick={() => changeLanguage('hr')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
              i18n.language === 'hr' 
                ? 'bg-white text-gray-900' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            HR
          </button>
          <span className="text-gray-500">|</span>
          <button
            onClick={() => changeLanguage('en')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
              i18n.language === 'en' 
                ? 'bg-white text-gray-900' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 min-h-screen flex items-center">
        <div className="absolute inset-0 bg-grid-white/5"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-blue-600/20 backdrop-blur-lg rounded-2xl border border-blue-500/30">
                <Shield className="w-16 h-16 text-blue-400" />
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              NIS2 Direktiva<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Pod tvojom kontrolom
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-4xl mx-auto">
              {t('heroSubtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/app"
                className="group inline-flex items-center px-8 py-5 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl hover:from-blue-700 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                {t('demoButton') || 'Pokreni Demo odmah'}
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition" />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center px-8 py-5 text-lg font-semibold text-white border-2 border-white/30 backdrop-blur-lg rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                <Shield className="mr-3 w-5 h-5" />
                {t('loginButton') || 'Prijava za korisnike'}
              </Link>
            </div>

            {/* Stvarni brojevi prema NIS2 direktivi */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                { icon: CheckCircle, text: t('controlsCount') || '38 obveznih mjera sigurnosti' },
                { icon: Zap, text: t('autoTracking') || 'Automatsko praćenje napretka' },
                { icon: FileText, text: t('pdfReport') || 'PDF izvještaj u 1 kliku' }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                  <item.icon className="w-12 h-12 text-cyan-400 mb-4" />
                  <p className="text-gray-300 text-lg">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="bg-black/50 backdrop-blur-md border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400">
            {t('trustedBy') || 'Već koriste banke, energetski operateri i kritična infrastruktura u Hrvatskoj i regiji'}
          </p>
        </div>
      </div>
    </>
  );
}