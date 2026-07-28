import React from 'react';
import { Sparkles, CheckCircle, Zap, Shield, ArrowRight, FileText, Target, Users, TrendingUp, Check } from 'lucide-react';
import { UserProfile } from '../types';
import { Language, translations } from '../translations';

interface LandingPageProps {
  onStart: () => void;
  onSelectPlan: (plan: 'Découverte' | 'Pro' | 'Illimité') => void;
  user: UserProfile;
  lang?: Language;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onSelectPlan, user, lang = 'fr' }) => {
  const t = translations[lang];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-teal-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            {t.heroBadge}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            {lang === 'en' ? (
              <>Generate a tailored <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-200">Resume & Cover Letter</span> for every job offer in 2 minutes</>
            ) : (
              <>Un CV sur-mesure & adapté à chaque offre en <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-200">2 minutes chrono</span></>
            )}
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            {t.heroDesc}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-extrabold text-base hover:from-teal-400 hover:to-emerald-300 transition shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 group"
            >
              <span>{t.heroCtaStart}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </button>
            
            <a
              href="#demo"
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-sm hover:text-white hover:bg-slate-800 transition flex items-center justify-center gap-2"
            >
              <span>{lang === 'en' ? 'See Before / After Demo' : 'Voir la démo avant/après'}</span>
            </a>
          </div>

          {/* Key metrics / Social Proof */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-slate-800/80 pt-8 text-left max-w-4xl mx-auto">
            <div>
              <p className="text-2xl font-extrabold text-teal-400">+94%</p>
              <p className="text-xs text-slate-400 mt-1">{lang === 'en' ? 'ATS Filter Pass Rate' : 'Passage des filtres ATS'}</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-teal-400">2 min</p>
              <p className="text-xs text-slate-400 mt-1">{lang === 'en' ? 'Average Generation Time' : 'Temps de génération moyen'}</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-teal-400">100%</p>
              <p className="text-xs text-slate-400 mt-1">{lang === 'en' ? 'Tailored to Job Description' : 'Personnalisé selon l\'offre'}</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-teal-400">PDF & DOCX</p>
              <p className="text-xs text-slate-400 mt-1">{lang === 'en' ? 'High Quality Formats' : 'Formats haute qualité'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* DEMO AVANT / APRÈS */}
      <section id="demo" className="py-16 bg-slate-900 border-y border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {lang === 'en' ? 'Discover the Power of ATS Optimization' : 'Découvrez l\'Impact de l\'Optimisation ATS'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              {lang === 'en' ? 'Compare a generic resume ignored by ATS algorithms with a tailored resume created by CVGen.' : 'Comparez un CV générique ignoré par les algorithmes et un CV réécrit sur-mesure par CVGen.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            
            {/* BEFORE - STANDARD CV */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-rose-500/30 relative">
              <div className="absolute top-4 right-4 bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold px-3 py-1 rounded-full">
                {lang === 'en' ? 'ATS Score: 38% (Rejected)' : 'Score ATS : 38% (Rejeté)'}
              </div>
              <h3 className="text-sm font-bold text-rose-400 mb-3 flex items-center gap-2">
                ❌ {lang === 'en' ? 'Before CVGen — Generic Resume' : 'Avant CVGen — CV Générique'}
              </h3>
              <div className="bg-slate-900 p-4 rounded-xl text-xs text-slate-400 space-y-3 font-mono opacity-80">
                <p className="font-bold text-slate-200">John Doe — Web Developer</p>
                <p>{lang === 'en' ? 'Motivated developer seeking a position in a dynamic company.' : 'Développeur motivé cherchant un poste dans une entreprise dynamique.'}</p>
                <div className="border-t border-slate-800 pt-2 space-y-1">
                  <p className="text-slate-300 font-semibold">{lang === 'en' ? 'Experience:' : 'Expériences :'}</p>
                  <p>• {lang === 'en' ? 'Worked on various web projects and app management.' : 'Travail sur divers projets web et gestion d\'applications.'}</p>
                  <p>• {lang === 'en' ? 'Attended meetings and fixed bugs.' : 'Participation aux réunions et résolution de bugs.'}</p>
                </div>
                <p className="text-[11px] text-rose-400 font-sans italic pt-2">
                  {lang === 'en' ? 'Issue: Missing key keywords, no quantified impact, rejected in 3 seconds by ATS filters.' : 'Problème : Mots-clés manquants, pas de métriques de performance, rejeté en 3 secondes par les filtres ATS.'}
                </p>
              </div>
            </div>

            {/* AFTER - OPTIMIZED CV */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-teal-500/50 relative shadow-xl shadow-teal-500/10">
              <div className="absolute top-4 right-4 bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-teal-400" /> {lang === 'en' ? 'ATS Score: 94% (Shortlisted)' : 'Score ATS : 94% (Sélectionné)'}
              </div>
              <h3 className="text-sm font-bold text-teal-300 mb-3 flex items-center gap-2">
                ✅ {lang === 'en' ? 'After CVGen — Tailored & Optimized Resume' : 'Après CVGen — CV Sur-Mesure & Optimisé'}
              </h3>
              <div className="bg-slate-900 p-4 rounded-xl text-xs text-slate-200 space-y-3">
                <p className="font-bold text-white">John Doe — Senior Full Stack Developer (React & Node)</p>
                <p className="text-slate-300">
                  {lang === 'en' ? 'Full Stack Developer (5 yrs) specializing in microservices, React and Node.js.' : 'Développeur Full Stack (5 ans) spécialisé en architectures microservices, React et Node.js.'}
                </p>
                <div className="border-t border-slate-800 pt-2 space-y-1 text-slate-300">
                  <p className="text-teal-400 font-semibold">{lang === 'en' ? 'Targeted & Quantified Experience:' : 'Expériences ciblées & chiffrées :'}</p>
                  <p>• {lang === 'en' ? 'Designed B2B SaaS platform serving' : 'Conception d\'une plateforme SaaS B2B comptant'} <strong>+50,000 active users</strong> {lang === 'en' ? 'with React/TypeScript.' : 'avec React/TypeScript.'}</p>
                  <p>• {lang === 'en' ? 'Migrated to Docker microservices on Node.js, reducing response latency by' : 'Migration vers microservices Docker sous Node.js, réduisant les temps de réponse de'} <strong>40%</strong>.</p>
                </div>
                <div className="text-[11px] text-teal-300 bg-teal-950/60 p-2 rounded border border-teal-800/60 font-sans">
                  ✨ {lang === 'en' ? 'Custom cover letter & full ATS keyword report included!' : 'Lettre de motivation sur-mesure & rapport complet de mots-clés ATS inclus !'}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PRICING GRID */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white">
              {t.pricingTitle}
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              {t.pricingSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Découverte */}
            <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950 px-2.5 py-1 rounded border border-teal-800">
                  {t.planFree}
                </span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">0€</span>
                  <span className="text-xs text-slate-400">/ {lang === 'en' ? 'mo' : 'mois'}</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">{lang === 'en' ? 'Perfect to test on your first 3 job applications.' : 'Parfait pour tester l\'outil sur vos 3 premières candidatures.'}</p>

                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400 shrink-0" /> {lang === 'en' ? '3 resume generations / mo' : '3 générations de CV / mois'}</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400 shrink-0" /> {lang === 'en' ? '3 cover letters' : '3 lettres de motivation'}</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400 shrink-0" /> {lang === 'en' ? 'ATS match score calculation' : 'Calcul du score ATS'}</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400 shrink-0" /> {lang === 'en' ? 'PDF & Text export' : 'Export PDF & Text'}</li>
                </ul>
              </div>

              <button
                onClick={() => { onSelectPlan('Découverte'); onStart(); }}
                className="mt-8 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
              >
                {lang === 'en' ? 'Try for Free' : 'Essayer Gratuitement'}
              </button>
            </div>

            {/* Pro */}
            <div className="bg-slate-900 rounded-2xl p-8 border-2 border-teal-500 relative flex flex-col justify-between shadow-2xl shadow-teal-500/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-teal-500 text-slate-950 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full tracking-wider">
                {lang === 'en' ? 'Recommended' : 'Recommandé'}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                  {t.planPro}
                </span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">19€</span>
                  <span className="text-xs text-slate-400">/ {lang === 'en' ? 'mo' : 'mois'}</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">{lang === 'en' ? 'Ideal for active job seekers applying to multiple target roles.' : 'Idéal pour les chercheurs d\'emploi actifs ciblant plusieurs postes.'}</p>

                <ul className="mt-6 space-y-3 text-xs text-slate-200">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400 shrink-0" /> <strong>{lang === 'en' ? '20 resume generations' : '20 générations'}</strong> / {lang === 'en' ? 'mo' : 'mois'}</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400 shrink-0" /> {lang === 'en' ? '20 tailored cover letters' : '20 lettres de motivation sur-mesure'}</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400 shrink-0" /> {lang === 'en' ? 'Detailed ATS keyword breakdown' : 'Analyse détaillée des mots-clés ATS'}</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-400 shrink-0" /> {lang === 'en' ? '4 professional resume templates' : '4 templates professionnels de CV'}</li>
                </ul>
              </div>

              <button
                onClick={() => { onSelectPlan('Pro'); onStart(); }}
                className="mt-8 w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs transition shadow-lg shadow-teal-500/20"
              >
                {lang === 'en' ? 'Choose Pro Plan' : 'Choisir la formule Pro'}
              </button>
            </div>

            {/* Illimité */}
            <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded border border-amber-800/80">
                  {t.planUnlimited}
                </span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">39€</span>
                  <span className="text-xs text-slate-400">/ {lang === 'en' ? 'mo' : 'mois'}</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">{lang === 'en' ? 'For consultants, freelancers & intensive career changes.' : 'Pour les consultants, freelances & réorientations intensives.'}</p>

                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 shrink-0" /> <strong>{lang === 'en' ? 'Unlimited Generations' : 'Générations Illimitées'}</strong></li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 shrink-0" /> {lang === 'en' ? 'Unlimited cover letters' : 'Lettres de motivation illimitées'}</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 shrink-0" /> {lang === 'en' ? 'All templates & PDF exports' : 'Tous les templates & exports PDF'}</li>
                </ul>
              </div>

              <button
                onClick={() => { onSelectPlan('Illimité'); onStart(); }}
                className="mt-8 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
              >
                {lang === 'en' ? 'Choose Unlimited Plan' : 'Choisir l\'Illimité'}
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-slate-950 border-t border-slate-900 text-center text-xs text-slate-500">
        <p>© 2026 CVGen — {lang === 'en' ? 'Automatic ATS-optimized resume & cover letter generator. All rights reserved.' : 'Générateur automatique de CV & lettres de motivation ATS. Tous droits réservés.'}</p>
      </footer>

    </div>
  );
};
