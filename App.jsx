import React, { useState, useEffect, useMemo, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithCustomToken
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import {
  ShieldCheck, Lock, Mail, Activity, FileSpreadsheet, Download,
  CheckCircle, AlertTriangle, ChevronDown, ChevronUp, ListChecks,
  ShieldAlert, Globe, CreditCard, LogOut, Menu, X
} from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useTranslation } from 'react-i18next';

// === STRIPE SETUP ===
const stripePromise = loadStripe('pk_test_51...'); // Zamijeni sa svojim publishable keyjem

// === i18n SETUP ===
import i18next from 'i18next';
i18next.init({
  lng: 'hr',
  resources: {
    hr: { translation: require('./locales/hr.json') },
    en: { translation: require('./locales/en.json') },
    de: { translation: require('./locales/de.json') },
    it: { translation: require('./locales/it.json') },
    sl: { translation: require('./locales/sl.json') },
    es: { translation: require('./locales/es.json') },
  },
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
  }
});

// Firebase config (use environment variables in production)
const firebaseConfig = { /* your config */ };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'nis2-app';

// === TRANSLATIONS (create separate JSON files or inline) ===
const translations = {
  hr: {
    title: "NIS2 Alat za GAP Analizu",
    compliance: "Usklađenost",
    subtasks: "Podzadaci",
    criticalRisks: "Kritični Rizici",
    exportPdf: "Preuzmi PDF Izvještaj",
    upgradeToPro: "Nadogradi na PRO",
    demoLimit: "Demo verzija – prikazuje samo prvih 6 kontrola",
    languages: { hr: "Hrvatski", en: "English", de: "Deutsch", it: "Italiano", sl: "Slovenščina", es: "Español" }
  },
  en: {
    title: "NIS2 GAP Analysis Tool",
    compliance: "Compliance",
    subtasks: "Subtasks",
    criticalRisks: "Critical Gaps",
    exportPdf: "Download PDF Report",
    upgradeToPro: "Upgrade to PRO",
    demoLimit: "Demo version – shows only first 6 controls",
    languages: { hr: "Croatian", en: "English", de: "German", it: "Italian", sl: "Slovenian", es: "Spanish" }
  },
  // ... add de, it, sl, es similarly
};

// Full translations available on request
};

// Status colors (same in all languages)
const STATUS_COLORS = { "Nije započeto": "#9CA3AF", "Neusklađeno": "#EF4444", "Djelomično": "#F59E0B", "Usklađeno": "#10B981" };
const STATUS_EN = { "Not Started": "#9CA3AF", "Non-compliant": "#EF4444", "Partially": "#F59E0B", "Compliant": "#10B981" };

// INITIAL DATA (same as yours, but with translations)
const INITIAL_DATA = [/* your 18 items – same as before */];

// === STRIPE CHECKOUT COMPONENT ===
const CheckoutForm = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useTranslation();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      alert(error.message);
      setProcessing(false);
      return;
    }

    // Call your backend to create subscription (example endpoint)
    const res = await fetch('/.netlify/functions/create-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentMethodId: paymentMethod.id,
        email: auth.currentUser.email,
      }),
    });

    const data = await res.json();
    if (data.clientSecret) {
      const result = await stripe.confirmCardPayment(data.clientSecret);
      if (result.error) alert(result.error.message);
      else onSuccess();
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CardElement options={{ style: { base: { fontSize: '18px' } }} />
      <button disabled={processing || !stripe} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold">
        {processing ? 'Processing...' : '€19/mj – Aktiviraj PRO'}
      </button>
    </form>
  );
};

// === MAIN APP ===
export default function App() {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);
  const [appData, setAppData] = useState(null);
  const pdfRef = useRef();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const proRef = doc(db, 'artifacts', appId, 'users', u.uid, 'subscription');
        const snap = await getDoc(proRef);
        setIsPro(snap.exists() && snap.data().status === 'active');

        const dataRef = doc(db, 'artifacts', appId, 'users', u.uid, 'assessments', 'latest');
        const docSnap = await getDoc(dataRef);
        let data = docSnap.exists() ? docSnap.data().items : INITIAL_DATA;

        if (!isPro) data = data.slice(0, 6); // DEMO LIMIT

        setAppData(data);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [isPro]);

  const saveData = async (data) => {
    if (!user) return;
    await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'assessments', 'latest'), {
      items: data,
      lastUpdated: new Date(),
    });
    setAppData(isPro ? data : data.slice(0, 6));
  };

  // === PDF EXPORT WITH GRAPHS ===
  const exportPDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.setFontSize(20);
    pdf.text("NIS2 Compliance Report", pageWidth / 2, 20, { align: 'center' });

    pdf.setFontSize(12);
    pdf.text(`Generated: ${new Date().toLocaleDateString()} | User: ${user.email}`, 20, 35);

    const canvas = await html2canvas(pdfRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 10, 50, 190, 0);

    pdf.save(`NIS2_Report_${user.email.split('@')[0]}_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-2xl">Loading...</div>;
  if (!user) return <Login />;

  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* TOP BAR */}
        <header className="bg-gradient-to-r from-blue-700 to-purple-800 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <ShieldCheck size={32} />
              <h1 className="text-2xl font-bold">{t('title')}</h1>
              {!isPro && <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">DEMO</span>}
            </div>
            <div className="flex items-center gap-4">
              <select
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="bg-white/10 backdrop-blur px-3 py-2 rounded-lg text-sm"
              >
                {Object.keys(translations.hr.languages).map(code => (
                  <option key={code} value={code}>{translations.hr.languages[code]}</option>
                ))}
              </select>
              <button onClick={() => signOut(auth)} className="bg-white/20 px-4 py-2 rounded-lg flex items-center gap-2">
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </header>

        {/* PRO UPGRADE BANNER */}
        {!isPro && (
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4 text-center font-bold">
            {t('demoLimit')} →{' '}
            <button className="underline mx-2 bg-white text-orange-600 px-6 py-2 rounded-full">
              <CreditCard className="inline mr-2" /> {t('upgradeToPro')}
            </button>
          </div>
        )}

        <div ref={pdfRef} className="max-w-7xl mx-auto p-6">
          {/* Dashboard content same as before but with t('key') for texts */}
          {/* Add your Dashboard component here with translations */}

          {/* BEAUTIFUL PDF EXPORT BUTTON */}
          <div className="text-center my-8">
            <button
              onClick={exportPDF}
              className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transition flex items-center gap-3 mx-auto"
            >
              <Download size={28} />
              {t('exportPdf')} (Professional Layout + Heatmap + Graphs)
            </button>
          </div>
        </div>

        {/* PAYMENT MODAL */}
        {!isPro && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowPayment(false)}>
            <div className="bg-white p-8 rounded-2xl max-w-md" onClick={e => e.stopPropagation()}>
              <h2 className="text-2xl font-bold mb-4">Unlock Full NIS2 Platform</h2>
              <ul className="space-y-3 mb-6">
                <li>✓ All 18 NIS2 controls</li>
                <li>✓ Unlimited users & projects</li>
                <li>✓ PDF reports with heatmap</li>
                <li>✓ Multi-language</li>
                <li>✓ Priority support</li>
              </ul>
              <CheckoutForm onSuccess={() => { setIsPro(true); alert("PRO activated!"); }} />
            </div>
          </div>
        )}
      </div>
    </Elements>
  );
}