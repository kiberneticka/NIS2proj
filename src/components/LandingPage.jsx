// src/components/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle, Zap, Lock, FileText, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <>
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
              Jedini hrvatski alat koji ti omogućuje potpunu usklađenost s NIS2 direktivom – 
              bez konzultanata, bez Excel tablica, bez stresa.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/app"
                className="group inline-flex items-center px-8 py-5 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl hover:from-blue-700 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                Pokreni Demo odmah
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition" />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center px-8 py-5 text-lg font-semibold text-white border-2 border-white/30 backdrop-blur-lg rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                <Lock className="mr-3 w-5 h-5" />
                Prijava za korisnike
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                { icon: CheckCircle, text: "150+ kontrola prema NIS2" },
                { icon: Zap, text: "Automatsko praćenje napretka" },
                { icon: FileText, text: "PDF izvještaj u 1 kliku" }
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
            Već koriste banke, energetski operateri i kritična infrastruktura u HR · EU · SEE regiji
          </p>
        </div>
      </div>
    </>
  );
}