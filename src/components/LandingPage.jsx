import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-4xl text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Dobrodošli u NIS2 Compliance Alat
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Upravljajte svojim NIS2 zahtjevima, pratite status i generirajte izvještaje – sve na jednom mjestu.
        </p>
        <div className="space-x-4">
          <Link
            to="/login"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg"
          >
            Počni s prijavi
          </Link>
          <Link
            to="/app"
            className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Demo Dashboard
          </Link>
        </div>
        <div className="mt-12 text-sm text-gray-500">
          © 2025 NIS2 Proj. Sva prava zadržana.
        </div>
      </div>
    </div>
  );
}