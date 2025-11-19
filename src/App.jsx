import React, { useState, useEffect, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,               // <-- zamjena za <Redirect>
  useNavigate              // <-- ako bude potrebno u budućnosti
} from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  collection, 
  query, 
  onSnapshot, 
  setDoc 
} from "firebase/firestore";

// --- Komponente ---
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';

// --- Firebase konfiguracija ---
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Mock podaci
const initialData = [
  { id: '1', category: 'A1', requirement: 'Politika pristupa', owner: 'IT', priority: 'Visok', status: 'Nije započeto', notes: '' },
  { id: '2', category: 'B2', requirement: 'Plan oporavka', owner: 'Management', priority: 'Kritičan', status: 'Djelomično', notes: '' },
  { id: '3', category: 'C3', requirement: 'Edukacija zaposlenika', owner: 'HR', priority: 'Srednji', status: 'Usklađeno', notes: '' },
];

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [data, setData] = useState([]);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthReady(true);
    });
    return unsubscribe;
  }, []);

  // 2. Dohvaćanje podataka iz Firestore-a
  useEffect(() => {
    if (!isAuthReady) return;

    let unsubscribeSnapshot = () => {};

    if (currentUser) {
      setIsLoading(true);
      const userId = currentUser.uid;
      const userControlsRef = collection(db, `artifacts/nis2-app/users/${userId}/controls`);
      const q = query(userControlsRef);

      unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
        const loadedData = [];
        snapshot.forEach((doc) => {
          loadedData.push({ id: doc.id, ...doc.data() });
        });

        setData(loadedData.length > 0 ? loadedData : initialData);
        setIsLoading(false);
      }, (error) => {
        console.error("Greška pri dohvaćanju podataka:", error);
        setData(initialData);
        setIsLoading(false);
      });
    } else {
      // Nema prijavljenog korisnika → demo podaci
      setData(initialData);
      setIsLoading(false);
    }

    return () => unsubscribeSnapshot();
  }, [currentUser, isAuthReady]);

  // Auth metode
  const handleLogin = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const handleLogout = useCallback(() => {
    signOut(auth).catch(err => console.error("Greška pri odjavi:", err));
  }, []);

  const saveData = async (newData) => {
    if (!currentUser) return;

    try {
      const promises = newData.map(item => {
        const docRef = doc(db, `artifacts/nis2-app/users/${currentUser.uid}/controls`, item.id);
        return setDoc(docRef, item, { merge: true });
      });
      await Promise.all(promises);
      console.log("Podaci uspješno spremljeni.");
    } catch (error) {
      console.error("Greška pri spremanju:", error);
    }
  };

  const generatePdf = () => {
    console.log("Generiranje PDF-a...");
    // Logika za PDF
  };

  const isPro = false; // mock

  // Loading stanje
  if (!isAuthReady || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-blue-600">Učitavanje aplikacije...</div>
      </div>
    );
  }

  // Glavni render – React Router v6
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header currentUser={currentUser} onLogout={handleLogout} />

        <main className="flex-grow bg-gray-50">
          <Routes>
            {/* Početna stranica */}
            <Route path="/" element={<LandingPage />} />

            {/* Login stranica */}
            <Route path="/login" element={<Login onLogin={handleLogin} />} />

            {/* Zaštićena ruta /app */}
            <Route
              path="/app"
              element={
                currentUser ? (
                  <Dashboard
                    data={data}
                    onDataChange={saveData}
                    isPro={isPro}
                    onPdfExport={generatePdf}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Sve ostale rute → 404 */}
            <Route
              path="*"
              element={
                <div className="max-w-7xl mx-auto p-8 text-center bg-white my-8 rounded-lg shadow-lg">
                  <h1 className="text-3xl font-bold text-red-600">404 - Stranica nije pronađena</h1>
                  <p className="mt-4 text-gray-600">
                    Putanja koju ste tražili ne postoji.{' '}
                    <a href="/" className="text-blue-600 hover:underline">
                      Vratite se na početnu stranicu.
                    </a>
                  </p>
                </div>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}