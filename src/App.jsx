import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'; 
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  ShieldCheck, Lock, Mail, LogOut, Globe, CreditCard, Download,
  ChevronDown, ChevronUp, CheckCircle, ShieldAlert, Activity, Menu, X
} from 'lucide-react';

// === Uvoz Dashboard komponente (PRETPOSTAVLJA DA POSTOJI) ===
import Dashboard from './components/Dashboard'; 

// ==================== STRIPE ====================
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_xxx');

// ==================== FIREBASE ====================
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ==================== PODACI (18 kontrola) ====================
const INITIAL_DATA = [
  { id: 1, category: "Upravljanje", requirement: "Odobrenje politika od strane uprave", status: "Nije započeto", priority: "Visok", notes: "", owner: "Uprava", subtasks: [{ id: "1a", text: "Potpisana Politika IS", done: false }] },
  { id: 2, category: "Analiza rizika", requirement: "Politike analize rizika", status: "Nije započeto", priority: "Visok", notes: "", owner: "Ivan Cindrić", subtasks: [{ id: "2a", text: "Registri imovine", done: false }] },
  { id: 3, category: "Upravljanje incidentima", requirement: "Detekcija i prevencija incidenata", status: "Nije započeto", priority: "Visok", notes: "", owner: "SOC", subtasks: [{ id: "3a", text: "SIEM implementiran", done: false }] },
  { id: 4, category: "Upravljanje incidentima", requirement: "Postupanje i izvještavanje", status: "Nije započeto", priority: "Visok", notes: "", owner: "SOC", subtasks: [{ id: "4a", text: "IRP definiran", done: false }] },
  { id: 5, category: "Kontinuitet poslovanja", requirement: "Upravljanje sigurnosnim kopijama", status: "Nije započeto", priority: "Srednji", notes: "", owner: "IT Ops", subtasks: [{ id: "5a", text: "Immutable backup", done: false }] },
  { id: 6, category: "Kontinuitet poslovanja", requirement: "Oporavak od katastrofe", status: "Nije započeto", priority: "Srednji", notes: "", owner: "IT Ops", subtasks: [{ id: "6a", text: "DRP testiran", done: false }] },
  { id: 7, category: "Lanac opskrbe", requirement: "Sigurnost dobavljača", status: "Nije započeto", priority: "Visok", notes: "", owner: "Nabava", subtasks: [] },
  { id: 8, category: "Lanac opskrbe", requirement: "Sigurnosne klauzule", status: "Nije započeto", priority: "Visok", notes: "", owner: "Pravna", subtasks: [] },
  { id: 9, category: "Razvoj", requirement: "Security by Design", status: "Nije započeto", priority: "Srednji", notes: "", owner: "Dev", subtasks: [] },
  { id: 10, category: "Ranjivosti", requirement: "Patch management", status: "Nije započeto", priority: "Visok", notes: "", owner: "Security", subtasks: [] },
  { id: 11, category: "Mjerenje", requirement: "Auditi i pen-testovi", status: "Nije započeto", priority: "Srednji", notes: "", owner: "Revizija", subtasks: [] },
  { id: 12, category: "Cyber higijena", requirement: "Hardening", status: "Nije započeto", priority: "Nizak", notes: "", owner: "IT Support", subtasks: [] },
  { id: 13, category: "Edukacija", requirement: "Awareness trening", status: "Nije započeto", priority: "Nizak", notes: "", owner: "HR", subtasks: [] },
  { id: 14, category: "Kriptografija", requirement: "Enkripcija", status: "Nije započeto", priority: "Srednji", notes: "", owner: "Security", subtasks: [] },
  { id: 15, category: "Ljudski resursi", requirement: "On/offboarding", status: "Nije započeto", priority: "Nizak", notes: "", owner: "HR", subtasks: [] },
  { id: 16, category: "Pristup", requirement: "Need-to-know", status: "Nije započeto", priority: "Visok", notes: "", owner: "Identity", subtasks: [] },
  { id: 17, category: "Autentifikacija", requirement: "MFA", status: "Nije započeto", priority: "Visok", notes: "", owner: "Identity", subtasks: [] },
  { id: 18, category: "Komunikacija", requirement: "Sigurni kanali", status: "Nije započeto", priority: "Srednji", notes: "", owner: "IT Ops", subtasks: [] }
];

const STATUS_COLORS = { "Nije započeto": "#9CA3AF", "Neusklađeno": "#EF4444", "Djelomično": "#F59E0B", "Usklađeno": "#10B981" };

// ==================== KOMPONENTE ====================
const Login = ({ onSuccess }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) await createUserWithEmailAndPassword(auth, email, pass);
      else await signInWithEmailAndPassword(auth, email, pass);
      onSuccess();
      navigate('/app');
    } catch (err) {
      setError("Neispravni podaci ili greška");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full">
        <div className="text-center mb-8">
          <ShieldCheck className="w-16 h-16 text-blue-600 mx-auto" />
          <h2 className="text-3xl font-bold mt-4">NIS2 Alat</h2>
        </div>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        <form onSubmit={handle} className="space-y-6">
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 border rounded-lg" required />
          <input type="password" placeholder="Lozinka" value={pass} onChange={e => setPass(e.target.value)} className="w-full px-4 py-3 border rounded-lg" required />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white py-3 rounded-lg font-bold">{isRegister ? "Registriraj se" : "Prijavi se"}</button>
        </form>
        <p className="text-center mt-6">
          <button onClick={() => setIsRegister(!isRegister)} className="text-blue-600 hover:text-blue-800 underline">
            {isRegister ? "Već imaš račun? Prijavi se" : "Nemaš račun? Registriraj se"}
          </button>
        </p>
      </div>
    </div>
  );
};

const CheckoutForm = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
        setLoading(false);
        return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
    
    if (error) {
        setError(error.message);
    } else {
      console.log('PaymentMethod:', paymentMethod);
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handle} className="space-y-6">
        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
      <CardElement className="p-4 border rounded-lg" />
      <button type="submit" disabled={!stripe || loading} className="w-full bg-green-600 hover:bg-green-700 transition-colors text-white py-4 rounded-lg font-bold text-xl disabled:opacity-50">
        {loading ? 'Obrada...' : 'Aktiviraj PRO – €19/mj'}
      </button>
    </form>
  );
};

const UpgradePage = ({ setIsProStatus }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleSuccess = async () => {
        const user = auth.currentUser;
        if (user) {
             // Ažuriranje statusa u Firestoreu
            await setDoc(doc(db, 'users', user.uid, 'subscription', 'status'), { active: true, startDate: new Date().toISOString() });
        }

        setIsProStatus(true);
        alert("Plaćanje uspješno! Vaš PRO račun je aktiviran.");
        navigate('/app');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-lg w-full">
                <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">Nadogradnja na PRO 🚀</h2>
                <p className="text-center text-gray-600 mb-6 text-lg">Pristupi svim **18 kontrolama**, neograničenom izvještavanju i timskoj suradnji za samo **€19 mjesečno**.</p>
                <Elements stripe={stripePromise}>
                    <CheckoutForm onSuccess={handleSuccess} />
                </Elements>
                <button onClick={() => navigate('/app')} className="mt-4 w-full text-gray-500 underline text-sm">Natrag na nadzornu ploču</button>
            </div>
        </div>
    );
};


// ==================== GLAVNA APP ====================
export default function App() {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);
  const pdfRef = useRef();
  const navigate = useNavigate(); 

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const proRef = doc(db, 'users', u.uid, 'subscription', 'status');
        const proSnap = await getDoc(proRef);
        const pro = proSnap.exists() && proSnap.data().active;
        setIsPro(pro);

        const ref = doc(db, 'users', u.uid, 'assessment', 'latest');
        const snap = await getDoc(ref);
        const loaded = snap.exists() ? snap.data().items : INITIAL_DATA;
        setData(pro ? loaded : loaded.slice(0, 6));
      } else {
        setData(INITIAL_DATA.slice(0, 6));
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const saveData = async (newData) => {
    if (!user) {
        setData(newData);
        return;
    }
    await setDoc(doc(db, 'users', user.uid, 'assessment', 'latest'), { items: newData });
    setData(isPro ? newData : newData.slice(0, 6));
  };

  // Funkcija za generiranje PDF-a
  const generatePdf = async () => {
    if (!isPro) {
        alert("Nadogradite na PRO za izvoz PDF izvještaja!");
        return;
    }
    const input = pdfRef.current;
    if (!input) return;

    // Privremeno sakrijte gumb za preuzimanje unutar Dashboarda da se ne pojavi na PDF-u
    const downloadButton = input.querySelector('button.bg-green-600');
    if (downloadButton) downloadButton.style.display = 'none';

    try {
        const canvas = await html2canvas(input, {
          scale: 2,
          useCORS: true,
          logging: false 
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('NIS2_GAP_Izvjestaj.pdf');
    } catch (error) {
        console.error("Greška pri generiranju PDF-a:", error);
    } finally {
        // Vratite gumb nakon generiranja PDF-a
        if (downloadButton) downloadButton.style.display = 'flex';
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-3xl font-semibold text-blue-600">Učitavanje...</div>;

  // Glavna ruta /app koja sadrži Dashboard omotač
  const AppDashboard = () => {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-gradient-to-r from-blue-700 to-purple-800 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <ShieldCheck size={32} />
            <h1 className="text-2xl font-bold">NIS2 GAP Analiza</h1>
            {!isPro && <span className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-semibold">DEMO ({data.length}/18)</span>}
          </div>
          <div className="flex items-center gap-4">
            <select onChange={e => i18n.changeLanguage(e.target.value)} defaultValue={i18n.language} className="bg-white/20 text-white px-3 py-2 rounded">
              <option value="hr">HR</option>
              <option value="en">EN</option>
              <option value="de">DE</option>
              <option value="it">IT</option>
              <option value="sl">SL</option>
              <option value="es">ES</option>
            </select>
            <button onClick={() => signOut(auth)} className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded flex items-center gap-2">
              <LogOut size={20} /> Odjava
            </button>
          </div>
        </div>

        {!isPro && (
          <div className="bg-orange-500 text-white p-4 text-center font-bold">
            Demo verzija – otključaj svih 18 kontrola i PDF izvještaj!
            <Link to="/app/upgrade" className="ml-4 bg-white text-orange-600 px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors">Nadogradi</Link>
          </div>
        )}

        {/* PROMJENA: Ovdje se koristi uvezeni Dashboard s rekvizitima unutar ref elementa */}
        <div ref={pdfRef}>
          <Dashboard 
            data={data} 
            onDataChange={saveData} 
            isPro={isPro} 
            onPdfExport={generatePdf}
          />
        </div>
        
      </div>
    );
  };


  // Ako korisnik nije prijavljen, prikazuje se Landing Page s gumbom za Login
  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-center py-20">
              <h1 className="text-6xl font-bold mb-8 text-gray-800">NIS2 Alat 2025/2026</h1>
              <p className="text-3xl mb-10 text-gray-600">Jedini hrvatski SaaS za NIS2 usklađenost</p>
              <button 
                onClick={() => navigate('/login')} 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-8 rounded-full text-2xl font-bold shadow-xl hover:shadow-2xl transition-shadow duration-300">
                Pokreni BESPLATNI demo →
              </button>
            </div>
          } />
          <Route path="/login" element={<Login onSuccess={() => {}} />} />
          <Route path="*" element={<Login onSuccess={() => {}} />} />
        </Routes>
      </BrowserRouter>
    );
  }


  // Ako je korisnik prijavljen, prikazuje se AppDashboard ili UpgradePage
  return (
    <Elements stripe={stripePromise}>
      <BrowserRouter>
        <Routes>
          <Route path="/app" element={<AppDashboard />} />
          <Route path="/app/upgrade" element={<UpgradePage setIsProStatus={setIsPro} />} />
          {/* Preusmjeravanje na dashboard ako je korisnik prijavljen, ali je na landing stranici */}
          <Route path="*" element={<AppDashboard />} /> 
        </Routes>
      </BrowserRouter>
    </Elements>
  );
}