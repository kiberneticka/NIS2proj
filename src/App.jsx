import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, collection, query, onSnapshot, setDoc } from "firebase/firestore";

// --- Importi ostalih komponenti (moraju postojati) ---
import Login from './components/Login'; // Pretpostavljena komponenta
import Dashboard from './components/Dashboard'; // Vaša Dashboard komponenta
import Header from './components/Header'; // Pretpostavljena komponenta
import Footer from './components/Footer'; // Pretpostavljena komponenta
import LandingPage from './components/LandingPage'; // Pretpostavljena komponenta
// import AppDashboard from './components/AppDashboard'; // Preimenovano u Dashboard za jednostavnost

// --- FIREBASE INICIJALIZACIJA ---
// KRITIČNO: Ključevi se dohvaćaju iz Vercel/Netlify Environment Variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY, 
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID 
};

// Inicijaliziraj Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Mock data za inicijalizaciju, ako Firebase još nije učitan
const initialData = [
  { id: '1', category: 'A1', requirement: 'Politika pristupa', owner: 'IT', priority: 'Visok', status: 'Nije započeto', notes: '' },
  { id: '2', category: 'B2', requirement: 'Plan oporavka', owner: 'Management', priority: 'Kritičan', status: 'Djelomično', notes: '' },
  { id: '3', category: 'C3', requirement: 'Edukacija zaposlenika', owner: 'HR', priority: 'Srednji', status: 'Usklađeno', notes: '' },
];


export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [data, setData] = useState([]);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Stanje za učitavanje podataka

  // --- 1. Autentifikacija ---
  useEffect(() => {
    // onAuthStateChanged se pokreće jednom pri pokretanju i pri svakoj promjeni stanja auth-a
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthReady(true); // Označi da je Auth inicijaliziran
    });

    return () => unsubscribeAuth();
  }, []);

  // --- 2. Dohvaćanje Podataka (Firestore) ---
  useEffect(() => {
    let unsubscribeSnapshot = () => {};

    if (currentUser && isAuthReady) {
      setIsLoading(true);
      const userId = currentUser.uid;
      // Putanja do privatne kolekcije unutar Canvas okvira
      const userControlsRef = collection(db, `artifacts/nis2-app/users/${userId}/controls`);
      const q = query(userControlsRef);

      // Slušanje promjena podataka u stvarnom vremenu
      unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
        try {
          const loadedData = [];
          querySnapshot.forEach((doc) => {
            loadedData.push({ id: doc.id, ...doc.data() });
          });
          
          setData(loadedData.length > 0 ? loadedData : initialData); // Koristi mock ako je prazno
          setIsLoading(false);
        } catch (error) {
          console.error("Greška pri dohvaćanju podataka iz Firestorea:", error);
          setIsLoading(false);
        }
      });
    } else if (isAuthReady && !currentUser) {
        // Ako je Auth spreman, ali nema korisnika (tj. na login/landing stranici)
        setIsLoading(false);
        setData(initialData); // Prikaz demo podataka
    }

    return () => unsubscribeSnapshot();
  }, [currentUser, isAuthReady]); // Reagira na promjenu korisnika i spremnost Autha

  // --- Metode za Auth i Podatke ---
  const handleLogin = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const handleLogout = useCallback(() => {
    signOut(auth).catch(error => console.error("Greška pri odjavi:", error));
  }, []);

  const saveData = async (newData) => {
    if (!currentUser) return;

    try {
        const batch = [];
        // Sprema podatke natrag u Firestore
        for (const item of newData) {
            const docRef = doc(db, `artifacts/nis2-app/users/${currentUser.uid}/controls`, item.id);
            // Koristimo setDoc s merge: true za stvaranje ili ažuriranje
            batch.push(setDoc(docRef, item, { merge: true }));
        }
        await Promise.all(batch);
        console.log("Podaci uspješno spremljeni.");
    } catch (error) {
        console.error("Greška pri spremanju podataka:", error);
    }
  };

  const generatePdf = () => {
    // Ovdje ide složenija logika za generiranje PDF-a
    console.log("Pokrenuto generiranje PDF izvještaja...");
    // U stvarnoj aplikaciji, ova funkcija bi pozvala logiku za PDF
  };

  const isPro = false; // Mock za Pro status

  // --- KRITIČNO: Stanje Učitavanja ---
  if (!isAuthReady || isLoading) {
    // Prikaz loading ekrana dok se ne provjeri Auth i ne dohvate podaci
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-blue-600">Učitavanje aplikacije...</div>
      </div>
    );
  }

  // --- RENDERIRANJE ---
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header currentUser={currentUser} onLogout={handleLogout} />
        
        <main className="flex-grow bg-gray-50">
          <Switch>
            <Route exact path="/" component={LandingPage} />
            
            <Route path="/login">
              <Login onLogin={handleLogin} />
            </Route>
            
            <Route path="/app">
              {/* Conditional rendering za pristup Dashboardu */}
              {currentUser ? (
                <Dashboard 
                  data={data}
                  onDataChange={saveData}
                  isPro={isPro}
                  onPdfExport={generatePdf}
                />
              ) : (
                <Redirect to="/login" />
              )}
            </Route>

            {/* Default ruta za 404 */}
            <Route>
                <div className="max-w-7xl mx-auto p-8 text-center bg-white my-8 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold text-red-600">404 - Stranica nije pronađena</h1>
                    <p className="mt-4 text-gray-600">Putanja koju ste tražili ne postoji. <a href="/" className="text-blue-600 hover:underline">Vratite se na početnu stranicu.</a></p>
                </div>
            </Route>
          </Switch>
        </main>

        <Footer />
      </div>
    </Router>
  );
}