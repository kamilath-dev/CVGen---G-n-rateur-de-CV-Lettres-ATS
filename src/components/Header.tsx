import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Language, translations } from '../translations';
import { Sparkles, LayoutDashboard, UserCheck, Zap, ArrowRight, Menu, X, Home, Globe, LogIn, LogOut, User } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  user: UserProfile;
  isLoggedIn: boolean;
  onOpenAuth: () => void;
  onLogout: () => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  user,
  isLoggedIn,
  onOpenAuth,
  onLogout,
  lang,
  onLanguageChange
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = translations[lang];

  const handleNavClick = (view: string) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* LOGO */}
        <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => handleNavClick('landing')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-teal-500/20">
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
              CVGen <span className="text-[10px] bg-teal-500/20 text-teal-300 font-bold px-2 py-0.5 rounded-full border border-teal-500/30">ATS AI</span>
            </span>
            <p className="text-[10px] text-slate-400 hidden sm:block">Générateur de CV & Lettres Sur-Mesure</p>
          </div>
        </div>

        {/* DESKTOP NAVIGATION LINKS */}
        <nav className="hidden lg:flex items-center gap-2 xl:gap-3 text-xs font-semibold">
          <button
            onClick={() => handleNavClick('landing')}
            className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 ${currentView === 'landing' ? 'bg-slate-800 text-teal-400 font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}`}
          >
            <Home className="w-3.5 h-3.5" />
            {t.navHome}
          </button>
          
          <button
            onClick={() => handleNavClick('generator')}
            className={`px-4 py-2 rounded-lg transition flex items-center gap-1.5 font-bold ${currentView === 'generator' ? 'bg-teal-600 text-white shadow-sm ring-2 ring-teal-500/30' : 'bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 hover:text-teal-200 border border-teal-500/30'}`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            {t.navGenerate}
          </button>

          {/* Show "Mes Générations" & "Mon CV Source" ONLY if logged in */}
          {isLoggedIn && (
            <>
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 ${currentView === 'dashboard' ? 'bg-slate-800 text-teal-400 font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-teal-400" />
                {t.navHistory}
              </button>

              <button
                onClick={() => handleNavClick('profile')}
                className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 ${currentView === 'profile' ? 'bg-slate-800 text-teal-400 font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}`}
              >
                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                {t.navSourceCV}
              </button>
            </>
          )}
        </nav>

        {/* RIGHT CONTROLS: DESKTOP LANG SELECTOR + QUOTA + ACCOUNT */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          
          {/* Language Selector Dropdown - DESKTOP ONLY (lg:) */}
          <div className="hidden lg:flex items-center bg-slate-800 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 hover:border-teal-500/50 transition">
            <Globe className="w-3.5 h-3.5 text-teal-400 mr-1.5 shrink-0" />
            <select
              value={lang}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer pr-1"
              aria-label="Sélectionner la langue / Select language"
            >
              <option value="fr" className="bg-slate-900 text-white">{t.langFr}</option>
              <option value="en" className="bg-slate-900 text-white">{t.langEn}</option>
            </select>
          </div>

          {/* Quota Counter (if logged in) */}
          {isLoggedIn && (
            <div 
              onClick={() => handleNavClick('pricing')}
              className="hidden sm:flex items-center gap-2.5 bg-slate-800/90 px-3.5 py-1.5 rounded-lg border border-slate-700/80 cursor-pointer hover:border-teal-500/50 transition text-xs"
              title="Cliquer pour voir les tarifs et formules"
            >
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-slate-400">{t.quotaLabel}</span>
                <span className="font-bold text-teal-300">
                  {user.remainingQuota} / {user.monthlyQuota} {t.quotaRemaining}
                </span>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-teal-950 text-teal-300 border border-teal-800">
                {user.formula}
              </span>
            </div>
          )}

          {/* Account / Login Button */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuth}
                className="text-xs font-semibold px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:border-teal-500 hover:text-white transition shadow-sm flex items-center gap-1.5"
                title={user.email}
              >
                <User className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden sm:inline truncate max-w-[100px]">{user.email.split('@')[0]}</span>
              </button>
              <button
                onClick={onLogout}
                className="p-2 rounded-lg bg-slate-800/80 text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                title={lang === 'en' ? 'Log out' : 'Se déconnecter'}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="text-xs font-bold px-3.5 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-500 transition shadow-sm flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Sign In' : 'Connexion'}</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* MOBILE / TABLET HAMBURGER MENU DROPDOWN */}
      {isMobileMenuOpen && (
        <nav className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-5 space-y-2.5 text-sm font-medium animate-in slide-in-from-top duration-200">
          
          {/* Mobile Navigation Links */}
          <button
            onClick={() => handleNavClick('landing')}
            className={`w-full px-4 py-2.5 rounded-lg text-left transition flex items-center gap-2.5 ${currentView === 'landing' ? 'bg-slate-800 text-teal-400 font-bold' : 'text-slate-300 hover:bg-slate-800/60'}`}
          >
            <Home className="w-4 h-4" />
            {t.navHome}
          </button>

          <button
            onClick={() => handleNavClick('generator')}
            className={`w-full px-4 py-2.5 rounded-lg text-left transition flex items-center gap-2.5 font-bold ${currentView === 'generator' ? 'bg-teal-600 text-white' : 'bg-teal-500/10 text-teal-300 border border-teal-500/30'}`}
          >
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
            {t.navGenerate}
          </button>

          {/* Show "Mes Générations" & "Mon CV Source" ONLY if logged in */}
          {isLoggedIn && (
            <>
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`w-full px-4 py-2.5 rounded-lg text-left transition flex items-center gap-2.5 ${currentView === 'dashboard' ? 'bg-slate-800 text-teal-400 font-bold' : 'text-slate-300 hover:bg-slate-800/60'}`}
              >
                <LayoutDashboard className="w-4 h-4 text-teal-400" />
                {t.navHistory}
              </button>

              <button
                onClick={() => handleNavClick('profile')}
                className={`w-full px-4 py-2.5 rounded-lg text-left transition flex items-center gap-2.5 ${currentView === 'profile' ? 'bg-slate-800 text-teal-400 font-bold' : 'text-slate-300 hover:bg-slate-800/60'}`}
              >
                <UserCheck className="w-4 h-4 text-slate-400" />
                {t.navSourceCV}
              </button>
            </>
          )}

          {/* LANGUAGE SELECTOR IN HAMBURGER MENU (TABLET & MOBILE) */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between px-2">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-teal-400" />
              {lang === 'en' ? 'Language:' : 'Langue :'}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => onLanguageChange('fr')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${lang === 'fr' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                🇫🇷 FR
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${lang === 'en' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                🇬🇧 EN
              </button>
            </div>
          </div>

          {/* Quota widget in mobile menu (if logged in) */}
          {isLoggedIn && (
            <div 
              onClick={() => handleNavClick('pricing')}
              className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs px-2 cursor-pointer"
            >
              <span className="text-slate-400">{t.quotaLabel} :</span>
              <span className="font-bold text-teal-300 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                {user.remainingQuota} / {user.monthlyQuota} ({user.formula})
              </span>
            </div>
          )}

        </nav>
      )}
    </header>
  );
};
