import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t } = useTranslation();
  return (
    <footer className="bg-gray-800 text-white mt-8">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} NIS2 Compliance Tool. {t('allRightsReserved')}
          </p>
          <div className="mt-2 space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">{t('privacyPolicy')}</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">{t('termsOfService')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}