// src/components/LandingPage.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Shield, Globe, CheckCircle, Zap, FileText, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (!i18n.language) i18n.changeLanguage('hr');
  }, [i18n]);

  const changeLanguage = (lang) => i18n.changeLanguage(lang);

  return (
    <>
      {/* Language Switcher – bez DEV gumba */}
      <div className="absolute top-6 right-6 z-50">
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl px-4 py-2">
          <Globe className="w-5 h-5 text-cyan-300" />
          <button
            onClick={() => changeLanguage('hr')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${i18n.language === 'hr' ? 'bg-white text-gray-900' : 'text-gray-300 hover:text-white'}`}
          >
            HR
          </button>
          <span className="text-gray-500">|</span>
          <button
            onClick={() => changeLanguage('en')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${i18n.language === 'en' ? 'bg-white text-gray-900' : 'text-gray-300 hover:text-white'}`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 min-h-screen flex items-center pt-20 pb-32">
        <div className="absolute inset-0 bg-grid-white/[0.04]"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center mb-12"
          >
            <div className="p-6 bg-blue-600/20 backdrop-blur-xl rounded-3xl border border-blue-500/30">
              <Shield className="w-24 h-24 text-blue-400" />
            </div>
          </motion.div>

          {/* Naslov */}
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
          >
            NIS2 Direktiva
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 block text-6xl md:text-8xl lg:text-9xl">
              Pod tvojom kontrolom
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            {t('heroSubtitle')}
          </motion.p>

          {/* Gumbi */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-20"
          >
            <Link
              to="/app"
              className="group inline-flex items-center px-10 py-6 text-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl hover:from-cyan-400 hover:to-blue-500 transform hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              {t('demoButton')}
              <ArrowRight className="ml-4 w-7 h-7 group-hover:translate-x-2 transition" />
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center px-10 py-6 text-xl font-bold text-white border-4 border-white/40 backdrop-blur-lg rounded-2xl hover:bg-white/10 transition-all duration-300"
            >
              <Shield className="mr-4 w-6 h-6" />
              {t('loginButton')}
            </Link>
          </motion.div>

          {/* 3 kartice – SVE ZAGRADICE SU NA MJESTU */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: CheckCircle, text: t('controlsCount') },
              { icon: Zap, text: t('autoTracking') },
              { icon: FileText, text: t('pdfReport') }
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 + i * 0.2 }}
                whileHover={{ y: -10 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 text-center shadow-2xl"
              >
                <card.icon className="w-16 h-16 mx-auto mb-6 text-cyan-400" />
                <p className="text-gray-200 text-lg font-medium whitespace-pre-line leading-relaxed">
                  {card.text}
                </p>
              </motion.div>
            ))}
          </div>
          {/* ← OVDJE JE BILA NEDOSTAJUĆA ZAGRADA – SADA JE ISPRAVLJENO */}
        </div>
      </div>

      {/* Trust bar */}
      <div className="bg-black/50 backdrop-blur-md border-t border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-300 text-lg">{t('trustedBy')}</p>
        </div>
      </div>
    </>
  );
}