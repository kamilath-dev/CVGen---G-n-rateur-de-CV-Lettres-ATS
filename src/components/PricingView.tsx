import React, { useState } from 'react';
import { UserProfile, SubscriptionFormula } from '../types';
import { Check, Zap, CreditCard, ShieldCheck, ArrowRight, Sparkles, Lock } from 'lucide-react';
import { CheckoutModal } from './CheckoutModal';

interface PricingViewProps {
  user: UserProfile;
  onChangePlan: (formula: SubscriptionFormula) => Promise<void>;
}

export const PricingView: React.FC<PricingViewProps> = ({ user, onChangePlan }) => {
  const [targetFormula, setTargetFormula] = useState<SubscriptionFormula>('Pro');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePlanClick = (formula: SubscriptionFormula) => {
    if (formula === user.formula) return;
    setTargetFormula(formula);
    if (formula === 'Découverte') {
      // Free formula direct switch
      onChangePlan('Découverte');
    } else {
      // Paid formula opens payment checkout modal
      setShowCheckoutModal(true);
    }
  };

  const handlePaymentSuccess = async (formula: SubscriptionFormula) => {
    setIsUpdating(true);
    try {
      await onChangePlan(formula);
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Banner */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-[10px] uppercase font-bold tracking-widest text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          Formules & Abonnements CVGen
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-3">
          Choisissez l'offre adaptée à votre recherche
        </h1>
        <p className="text-xs text-slate-500 mt-2">
          Changez ou résiliez votre abonnement à tout moment sans aucun engagement.
        </p>
      </div>

      {/* PRICING CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        
        {/* Découverte */}
        <div className={`bg-white rounded-2xl p-8 border-2 transition flex flex-col justify-between shadow-sm ${user.formula === 'Découverte' ? 'border-teal-600 bg-teal-50/20' : 'border-slate-200 hover:border-slate-300'}`}>
          <div>
            {user.formula === 'Découverte' && (
              <span className="text-[10px] font-bold bg-teal-600 text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
                Votre formule actuelle
              </span>
            )}
            <h2 className="text-lg font-bold text-slate-900">Formule Découverte</h2>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900">0€</span>
              <span className="text-xs text-slate-500">/ mois</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Pour vos premières opportunités de candidature.</p>

            <ul className="mt-6 space-y-3 text-xs text-slate-700">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-600 shrink-0" /> 3 générations CV / mois</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-600 shrink-0" /> 3 lettres de motivation</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-600 shrink-0" /> Calcul du score ATS</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-600 shrink-0" /> Templates standard</li>
            </ul>
          </div>

          <button
            onClick={() => handlePlanClick('Découverte')}
            disabled={user.formula === 'Découverte' || isUpdating}
            className={`mt-8 w-full py-3 rounded-xl font-bold text-xs transition ${
              user.formula === 'Découverte'
                ? 'bg-slate-100 text-slate-400 cursor-default'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {user.formula === 'Découverte' ? 'Formule Active' : 'Passer à la Découverte'}
          </button>
        </div>

        {/* Pro */}
        <div className={`bg-white rounded-2xl p-8 border-2 transition flex flex-col justify-between shadow-xl relative ${user.formula === 'Pro' ? 'border-teal-600 ring-2 ring-teal-500/20' : 'border-teal-500 hover:border-teal-600'}`}>
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-teal-600 text-white font-extrabold text-[10px] uppercase px-3.5 py-1 rounded-full tracking-wider shadow-sm">
            Plus populaire
          </div>

          <div>
            {user.formula === 'Pro' && (
              <span className="text-[10px] font-bold bg-teal-600 text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
                Votre formule actuelle
              </span>
            )}
            <h2 className="text-lg font-bold text-slate-900">Formule Pro</h2>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900">19€</span>
              <span className="text-xs text-slate-500">/ mois</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Pour les recherches actives sur plusieurs offres ciblées.</p>

            <ul className="mt-6 space-y-3 text-xs text-slate-700">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-600 shrink-0" /> <strong>20 générations</strong> / mois</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-600 shrink-0" /> 20 lettres de motivation sur-mesure</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-600 shrink-0" /> Rapport complet de mots-clés ATS</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-600 shrink-0" /> Accès à tous les 4 styles de CV</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-600 shrink-0" /> Exportations PDF & DOCX illimitées</li>
            </ul>
          </div>

          <button
            onClick={() => handlePlanClick('Pro')}
            disabled={user.formula === 'Pro' || isUpdating}
            className={`mt-8 w-full py-3 rounded-xl font-extrabold text-xs transition shadow-md flex items-center justify-center gap-1.5 ${
              user.formula === 'Pro'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                : 'bg-teal-600 hover:bg-teal-700 text-white'
            }`}
          >
            {user.formula === 'Pro' ? 'Formule Active (20/mois)' : (
              <>
                <Lock className="w-3.5 h-3.5 text-teal-200" />
                <span>Payer & Activer (19€)</span>
              </>
            )}
          </button>
        </div>

        {/* Illimité */}
        <div className={`bg-white rounded-2xl p-8 border-2 transition flex flex-col justify-between shadow-sm ${user.formula === 'Illimité' ? 'border-amber-500 bg-amber-50/20' : 'border-slate-200 hover:border-slate-300'}`}>
          <div>
            {user.formula === 'Illimité' && (
              <span className="text-[10px] font-bold bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
                Votre formule actuelle
              </span>
            )}
            <h2 className="text-lg font-bold text-slate-900">Formule Illimité</h2>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900">39€</span>
              <span className="text-xs text-slate-500">/ mois</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Pour une prospection intensive sans aucune limite.</p>

            <ul className="mt-6 space-y-3 text-xs text-slate-700">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-500 shrink-0" /> <strong>Générations Illimitées</strong></li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-500 shrink-0" /> Lettres de motivation illimitées</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-500 shrink-0" /> Tous les templates de CV</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-500 shrink-0" /> Accès aux prompts Make / Claude</li>
            </ul>
          </div>

          <button
            onClick={() => handlePlanClick('Illimité')}
            disabled={user.formula === 'Illimité' || isUpdating}
            className={`mt-8 w-full py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 ${
              user.formula === 'Illimité'
                ? 'bg-slate-100 text-slate-400 cursor-default'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {user.formula === 'Illimité' ? 'Formule Active (Illimitée)' : (
              <>
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Payer & Activer (39€)</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* CHECKOUT MODAL */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        selectedFormula={targetFormula}
        user={user}
        onPaymentSuccess={handlePaymentSuccess}
      />

    </div>
  );
};
