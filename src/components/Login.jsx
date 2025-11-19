import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // <-- nova import
import { useTranslation } from 'react-i18next';

export default function Login({ onLogin }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();  // <-- zamjena za useHistory

const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  try {
    await onLogin(email, password);
    navigate('/app');
  } catch (err) {
    let errorMessage = t('loginError');  // Default: "Greška pri prijavi"

    // Specifični errorovi
    if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
      errorMessage = t('wrongPassword') || 'Pogrešna lozinka. Pokušaj ponovno.';
    } else if (err.code === 'auth/user-not-found') {
      errorMessage = t('userNotFound') || 'Korisnik nije pronađen. Registriraj se ili koristi demo: demo@nis2.com / demo123';
    } else if (err.code === 'auth/invalid-email') {
      errorMessage = 'Nevažeći email format.';
    }

    setError(errorMessage);
    console.error('Login error:', err.code, err.message);  // Dodaj ovo za debug
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {t('signInTitle')}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                {t('emailAddress')}
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={t('emailAddressPlaceholder')}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                {t('password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={t('passwordPlaceholder')}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              {t('signInButton')}
            </button>
          </div>
<div className="mt-4">
  <button
    type="button"  // Ne submit, već direktno
    onClick={() => {
      setEmail('demo@nis2.com');
      setPassword('demo123');
      // Ili automatski submit: handleSubmit({ preventDefault: () => {} });
    }}
    className="w-full py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-gray-50 hover:bg-gray-100 transition"
  >
    Popuni demo podatke
  </button>
</div>
        </form>
      </div>
    </div>
  );
}