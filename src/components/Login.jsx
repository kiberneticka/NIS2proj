// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Mail, Lock, LogIn } from 'lucide-react';

export default function Login({ onLogin }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onLogin(email, password);
      navigate('/app');
    } catch (err) {
      setError('Pogrešan email ili lozinka. Demo: demo@nis2.hr / n1s2demo2025');
    }
  };

  const fillDemo = () => {
    setEmail('demo@nis2.hr');
    setPassword('n1s2demo2025');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="flex justify-center">
            <div className="p-4 bg-blue-600/20 backdrop-blur-lg rounded-2xl border border-blue-500/30">
              <Shield className="w-16 h-16 text-blue-400" />
            </div>
          </div>
          <h2 className="mt-6 text-4xl font-bold text-white">Dobrodošli natrag</h2>
          <p className="mt-2 text-gray-300">Prijavite se na svoj NIS2 portal</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Mail className="inline w-4 h-4 mr-2" /> Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="vas@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Lock className="inline w-4 h-4 mr-2" /> Lozinka
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center"
            >
              <LogIn className="mr-3 w-5 h-5" />
              Prijava
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/20">
            <button
              onClick={fillDemo}
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-cyan-300 font-medium rounded-lg transition backdrop-blur"
            >
              Demo pristup: demo@nis2.hr / n1s2demo2025
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-400">
            Nemaš račun? Kontaktiraj nas na kiberneticka@proton.me
          </p>
        </div>
      </div>
    </div>
  );
}