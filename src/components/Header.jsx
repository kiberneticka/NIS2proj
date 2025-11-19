import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Header({ currentUser, onLogout }) {
  const { t, i18n } = useTranslation();
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          
          {/* Logo / Naslov */}
          <Link to="/" className="text-2xl font-extrabold text-blue-600 tracking-tight">
            NIS2 Compliance
          </Link>

          {/* Navigacija i Akcije */}
          <nav className="flex items-center space-x-4">
            
            {/* Izbornik Jezika */}
            <div className="flex space-x-2">
                {i18n.languages.map((lng) => (
                    <button
                        key={lng}
                        onClick={() => changeLanguage(lng)}
                        className={`text-sm font-medium p-1 rounded transition-colors ${i18n.language === lng ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
                    >
                        {lng.toUpperCase()}
                    </button>
                ))}
            </div>


            {currentUser ? (
              // Prijavljeni korisnik
              <div className="flex items-center space-x-3">
                <Link to="/app" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  {t('dashboard')}
                </Link>
                <span className="text-sm text-gray-500 flex items-center">
                    <User size={18} className="mr-1"/> 
                    {t('user')}
                </span>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                  title={t('logout')}
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              // Neprijavljeni korisnik
              <Link
                to="/login"
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md"
              >
                {t('login')}
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}