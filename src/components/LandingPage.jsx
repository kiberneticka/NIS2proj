// src/components/LandingPage.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Shield, Globe, CheckCircle, Zap, FileText, ArrowRight } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const item = {
  hidden: { y: 60, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

const cardHover = {
  rest: { scale: 1, rotateX: 0, rotateY: 0 },
  hover: {
    scale: 1.05,
    rotateX: 10,
    rotateY: -10,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
    transition: { duration: 0.4 }
  }
};

export default function LandingPage() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (!i18n.language) i18n.changeLanguage('hr');
  }, [i18n]);

  const changeLanguage = (lang) => i18n.changeLanguage(lang);

  return (
    <>
      {/* Language Switcher */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-6 right-6 z-50"
      >
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl px-4 py-2">
          <Globe className="w-5 h-5 text-cyan-300" />
          {['hr', 'en'].map((lang) => (
            <button
              key={lang}
              onClick={() => changeLanguage(lang)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                i18n.language === lang 
                  ? 'bg-white text-gray-900 shadow-lg' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Hero */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={container}
        className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 min-h-screen flex items-center pt-16 pb-24"
      >
        <div className="absolute inset-0 bg-grid-white/[0.05] animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            {/* Logo */}
            <motion.div variants={item} className="flex justify-center mb-10">
              <div className="p-5 bg-blue-600/20 backdrop-blur-xl rounded-3xl border border-blue-500/30 shadow-2xl">
                <Shield className="w-20 h-20 text-blue-400" />
              </div>
            </motion.div>

            {/* Naslov */}
            <motion.h1 variants={item} className="text-5xl md:text-6xl lg:text-8xl font-bold text-white mb-6 leading-tight">
              NIS2 Direktiva
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 block text-6xl md:text-7xl lg:text-9xl">
                Pod tvojom kontrolom
              </span>
            </motion.h1>

            <motion.p variants={item} className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-12 max-w-5xl mx-auto leading-relaxed">
              {t('heroSubtitle')}
            </motion.p>

            {/* Gumbi */}
            <motion.div variants={item} className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
              <Link
                to="/app"
                className="group relative inline-flex items-center px-10 py-6 text-xl font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">{t('demoButton')}</span>
                <ArrowRight className="ml-4 w-7 h-7 group-hover:translate-x-3 transition" />
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center px-10 py-6 text-xl font-bold text-white border-4 border-white/40 backdrop-blur-lg rounded-2xl hover:bg-white/10 transition-all duration-300"
                whileHover={{ borderColor: '#67e8f9' }}
              >
                <Shield className="mr-4 w-6 h-6" />
                {t('loginButton')}
              </Link>
            </motion.div>

            {/* Kartice sa 3D hover efektom */}
            <motion.div
              variants={container}
              className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto"
            >
              {[
                { icon: CheckCircle, text: t('controlsCount') },
                { icon: Zap, text: t('autoTracking') },
                { icon: FileText, text: t('pdfReport') }
              ].map((card, i) => (
                <motion.div
                  key={i}
                  variants={item}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  className="relative"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <motion.div
                    variants={cardHover}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 text-center shadow-2xl"
                  >
                    <card.icon className="w-16 h-16 mx-auto mb-6 text-cyan-400" />
                    <p className="text-gray-200 text-lg font-medium">{card.text}</p>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Trust bar sa parallax */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="bg-black/60 backdrop-blur-md border-t border-white/10 py-10"
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-300 text-lg font-light tracking-wider">
            {t('trustedBy')}
          </p>
        </div>
      </motion.div>
    </>
  );
}