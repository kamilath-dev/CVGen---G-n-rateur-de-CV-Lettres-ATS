import React, { useState, useEffect } from 'react';
import { UserProfile, GenerationRecord, SubscriptionFormula } from './types';
import { Language } from './translations';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { GeneratorView } from './components/GeneratorView';
import { DashboardView } from './components/DashboardView';
import { ProfileView } from './components/ProfileView';
import { PricingView } from './components/PricingView';
import { AdminView } from './components/AdminView';
import { AuthModal } from './components/AuthModal';
import { LiveChatWidget } from './components/LiveChatWidget';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [lang, setLang] = useState<Language>('fr');
  
  // Login state - stored in localStorage for persistence
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('cvgen_logged_in');
    return saved !== null ? saved === 'true' : true;
  });

  const savedEmail = localStorage.getItem('cvgen_user_email') || 'kamilathosseni4@gmail.com';

  const [user, setUser] = useState<UserProfile>({
    id: `usr_${btoa(savedEmail).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10)}`,
    email: savedEmail,
    formula: 'Pro',
    monthlyQuota: 20,
    remainingQuota: 18,
    subscriptionStatus: 'Actif',
    registrationDate: new Date().toISOString().split('T')[0],
    sourceCVText: `${savedEmail.split('@')[0].toUpperCase().replace(/[0-9_.-]+/g, ' ')}\n${savedEmail} | +33 6 12 34 56 78 | Paris, France\n\nPROFIL PROFESSIONNEL\nProfessionnel(le) diplômé(e) et motivé(e) à la recherche d'opportunités à fort impact.\n\nEXPÉRIENCES PROFESSIONNELLES\n- Spécialiste & Chargé de Projets Senior (2022 - Présent)\n  * Direction et exécution de projets stratégiques avec respect des objectifs et des délais.\n- Consultant Web & Digital (2019 - 2022)\n  * Conception, développement et accompagnement de clients.\n\nFORMATIONS & DIPLÔMES\n- Master / Diplôme Supérieur — Université (2019)\n\nCOMPÉTENCES\n- Gestion de projet, Outils Web/Digital, Rigueur, Agilité, Français, Anglais`,
    sourceCVFileName: `CV_Source_${savedEmail.split('@')[0]}.txt`,
    stripeCustomerId: `cus_${savedEmail.split('@')[0]}`
  });

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedRecordForView, setSelectedRecordForView] = useState<GenerationRecord | null>(null);
  const [selectedPricingPlan, setSelectedPricingPlan] = useState<SubscriptionFormula | null>('Pro');

  // Fetch initial profile from backend based on email
  useEffect(() => {
    fetchUserProfile(user.email);
  }, []);

  const fetchUserProfile = async (emailToFetch: string) => {
    try {
      const res = await fetch(`/api/user/profile?email=${encodeURIComponent(emailToFetch)}`);
      const data = await res.json();
      if (data && data.email) {
        setUser(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateCVSource = async (cvText: string, fileName?: string) => {
    try {
      const res = await fetch('/api/user/cv-source', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, email: user.email, cvText, fileName })
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangePlan = async (formula: SubscriptionFormula) => {
    try {
      const res = await fetch('/api/user/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, email: user.email, formula })
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerationComplete = (record: GenerationRecord) => {
    setUser(prev => ({
      ...prev,
      remainingQuota: Math.max(0, prev.remainingQuota - 1)
    }));
  };

  const handleSelectRecordFromDashboard = (record: GenerationRecord) => {
    setSelectedRecordForView(record);
    setCurrentView('generator');
  };

  const handleLoginSuccess = async (email: string, formula: SubscriptionFormula, initialCV?: string) => {
    setIsLoggedIn(true);
    localStorage.setItem('cvgen_logged_in', 'true');
    localStorage.setItem('cvgen_user_email', email);

    // Fetch or create profile on backend for this specific email
    await fetchUserProfile(email);

    if (initialCV) {
      await handleUpdateCVSource(initialCV);
    }
    
    if (selectedPricingPlan && (selectedPricingPlan === 'Pro' || selectedPricingPlan === 'Illimité')) {
      setCurrentView('pricing');
    } else {
      await handleChangePlan(formula);
      setCurrentView('generator');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('cvgen_logged_in', 'false');
    setCurrentView('landing');
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col justify-between">
      <div className="flex-1 flex flex-col">
        {/* Main Header */}
        <Header
          currentView={currentView}
          setCurrentView={setCurrentView}
          user={user}
          isLoggedIn={isLoggedIn}
          onOpenAuth={() => setIsAuthOpen(true)}
          onLogout={handleLogout}
          lang={lang}
          onLanguageChange={setLang}
        />

        {/* Views Routing */}
        <main className="flex-1">
          {currentView === 'landing' && (
            <LandingPage
              onStart={() => {
                if (!isLoggedIn) {
                  setIsAuthOpen(true);
                } else {
                  setCurrentView('generator');
                }
              }}
              onSelectPlan={(plan) => {
                setSelectedPricingPlan(plan);
                if (plan === 'Pro' || plan === 'Illimité') {
                  if (!isLoggedIn) {
                    setIsAuthOpen(true);
                  } else {
                    setCurrentView('pricing');
                  }
                } else {
                  handleChangePlan('Découverte');
                  if (!isLoggedIn) {
                    setIsAuthOpen(true);
                  } else {
                    setCurrentView('pricing');
                  }
                }
              }}
              user={user}
              lang={lang}
            />
          )}

          {currentView === 'generator' && (
            <GeneratorView
              user={user}
              onGenerationComplete={handleGenerationComplete}
              onQuotaExceeded={() => setCurrentView('pricing')}
              lang={lang}
            />
          )}

          {currentView === 'dashboard' && isLoggedIn && (
            <DashboardView
              user={user}
              onNewGeneration={() => setCurrentView('generator')}
              onManageSubscription={() => setCurrentView('pricing')}
              onSelectRecord={handleSelectRecordFromDashboard}
            />
          )}

          {currentView === 'profile' && isLoggedIn && (
            <ProfileView
              user={user}
              onUpdateCVSource={handleUpdateCVSource}
            />
          )}

          {currentView === 'pricing' && (
            <PricingView
              user={user}
              onChangePlan={handleChangePlan}
              initialFormula={selectedPricingPlan}
            />
          )}

          {currentView === 'admin' && (
            <AdminView />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 py-6 text-center text-xs border-t border-slate-900 mt-auto">
        <p>CVGen — {lang === 'en' ? 'Automatic ATS-optimized Resume & Cover Letter Generator (2026)' : 'Générateur automatique de CV & Lettres de motivation optimisés ATS (2026)'}</p>
      </footer>

      {/* Onboarding & Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        user={user}
      />

      {/* Floating Live Chat Support Widget */}
      <LiveChatWidget />
    </div>
  );
}
