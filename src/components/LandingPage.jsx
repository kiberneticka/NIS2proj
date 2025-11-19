import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Shield, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function LandingPage() {
    const { t } = useTranslation();
    
  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl">{t('landingTitle')}</h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
          {t('landingSubtitle')}
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg transform hover:scale-105"
          >
            {t('startFreeTrial')}
          </Link>
        </div>
      </div>

      <div className="mt-20">
        <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                <CheckCircle size={24} />
              </div>
            </div>
            <dt className="mt-5 text-lg leading-6 font-medium text-gray-900">{t('feature1Title')}</dt>
            <dd className="mt-2 text-base text-gray-500">{t('feature1Description')}</dd>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white">
                <Shield size={24} />
              </div>
            </div>
            <dt className="mt-5 text-lg leading-6 font-medium text-gray-900">{t('feature2Title')}</dt>
            <dd className="mt-2 text-base text-gray-500">{t('feature2Description')}</dd>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                <TrendingUp size={24} />
              </div>
            </div>
            <dt className="mt-5 text-lg leading-6 font-medium text-gray-900">{t('feature3Title')}</dt>
            <dd className="mt-2 text-base text-gray-500">{t('feature3Description')}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}