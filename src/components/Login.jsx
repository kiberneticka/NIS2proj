// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Shield, Mail, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/app');
    } catch (err) {
      setError('Pogrešan email ili lozinka');
    }
    setLoading(false);
  };

  const fillDemo = () => {
    setEmail('demo@nis2.com');
    setPassword('demo123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-600/20 backdrop-blur-lg rounded-2xl border border-blue-500/30">
              <Shield className="w-16 h-16 text-blue-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Dobrodošli natrag</h1>
          <p className="text-gray-300">Prijavite se na svoj NIS2 portal</p>
        </div>

        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8">
          {error && <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-center">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="flex items-center gap-3 text-gray-300 mb-2"><Mail className="w-5 h-5" /> Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 transition" placeholder="vas@email.hr" />
            </div>
            <div>
              <label className="flex items-center gap-3 text-gray-300 mb-2"><Lock className="w-5 h-5" /> Lozinka</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 transition" placeholder="••••••" />
            </div>

            <button type="submit" disabled={loading} className="w-full py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xl font-bold rounded-xl hover:from-cyan-400 hover:to-blue-500 transform hover:scale-105 transition-all duration-300 shadow-xl flex items-center justify-center gap-3">
              {loading ? 'Prijavljujem...' : <>Prijava <ArrowRight className="w-6 h-6" /></>}
            </button>
          </form>

          <div className="mt-8 p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 text-center">
            <p className="text-gray-300 mb-4 font-medium">Demo pristup:</p>
            <button onClick={fillDemo} className="px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-lg border border-cyan-500/50 transition font-mono text-sm">
              demo@nis2.com / demo123
            </button>
            <p className="text-xs text-gray-400 mt-4">
              Nemaš račun? Kontaktiraj nas na <span className="text-cyan-300">kiberneticka@proton.me</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}