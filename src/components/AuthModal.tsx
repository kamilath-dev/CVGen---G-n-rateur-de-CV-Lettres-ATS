import React, { useState } from 'react';
import { UserProfile, SubscriptionFormula } from '../types';
import { Sparkles, X, Mail, Lock, Upload, CheckCircle, ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string, formula: SubscriptionFormula, initialCV?: string) => void;
  user: UserProfile;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess, user }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState(user.email || '');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedFormula, setSelectedFormula] = useState<SubscriptionFormula>('Pro');
  const [cvSourceInput, setCvSourceInput] = useState(user.sourceCVText || '');
  const [fileName, setFileName] = useState(user.sourceCVFileName || '');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) setCvSourceInput(evt.target.result as string);
    };
    reader.readAsText(file);
  };

  const handleFinishOnboarding = () => {
    onLoginSuccess(email || 'utilisateur@cvgen.com', selectedFormula, cvSourceInput);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-150">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Progress Indicators */}
        <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${step >= 1 ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-400'}`}>1</div>
            <span className="text-xs font-semibold text-slate-700">Compte</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-200" />
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${step >= 2 ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-400'}`}>2</div>
            <span className="text-xs font-semibold text-slate-700">CV Source</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-200" />
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${step >= 3 ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-400'}`}>3</div>
            <span className="text-xs font-semibold text-slate-700">Formule</span>
          </div>
        </div>

        {/* STEP 1: AUTH FORM */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-extrabold text-slate-900">Bienvenue sur CVGen</h3>
              <p className="text-xs text-slate-500 mt-1">Connectez-vous ou créez votre compte candidat</p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email professionnel</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nom@exemple.com"
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mot de passe</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-2 mt-4"
            >
              <span>Continuer vers l'étape 2 (CV Source)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: SOURCE CV UPLOAD */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-extrabold text-slate-900">Étape 2 : Votre CV Source</h3>
              <p className="text-xs text-slate-500 mt-1">Chargez votre CV actuel pour servir de profil de base</p>
            </div>

            <div className="border-2 border-dashed border-teal-300 bg-teal-50/50 rounded-xl p-6 text-center space-y-2">
              <Upload className="w-8 h-8 text-teal-600 mx-auto" />
              <p className="text-xs font-bold text-slate-800">Glissez-déposez ou cliquez pour charger votre CV</p>
              <p className="text-[11px] text-slate-500">Formats acceptés : PDF, DOCX, TXT</p>
              
              <label className="inline-block mt-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg cursor-pointer transition">
                <span>Parcourir les fichiers</span>
                <input type="file" accept=".txt,.doc,.docx,.pdf" onChange={handleFileUpload} className="hidden" />
              </label>

              {fileName && <p className="text-xs text-teal-700 font-bold mt-2">✓ Fichier : {fileName}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ou collez directement le texte ici :</label>
              <textarea
                value={cvSourceInput}
                onChange={(e) => setCvSourceInput(e.target.value)}
                rows={5}
                placeholder="Ex : Jean Dupont, Développeur Full Stack avec 5 ans d'expérience..."
                className="w-full p-3 border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-3 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50"
              >
                Retour
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1"
              >
                <span>Continuer (Choix Formule)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: FORMULA & PAYMENT */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-extrabold text-slate-900">Étape 3 : Choisissez votre Formule</h3>
              <p className="text-xs text-slate-500 mt-1">Inclus : Générations IA + Modèles PDF ATS</p>
            </div>

            <div className="space-y-2">
              {(['Découverte', 'Pro', 'Illimité'] as SubscriptionFormula[]).map((f) => (
                <div
                  key={f}
                  onClick={() => setSelectedFormula(f)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition flex justify-between items-center ${selectedFormula === f ? 'border-teal-600 bg-teal-50/60' : 'border-slate-200'}`}
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900">{f}</p>
                    <p className="text-[10px] text-slate-500">
                      {f === 'Découverte' ? '3 CVs/mois gratuit' : f === 'Pro' ? '20 CVs/mois à 19€' : 'Générations illimitées à 39€'}
                    </p>
                  </div>
                  {selectedFormula === f && <CheckCircle className="w-5 h-5 text-teal-600" />}
                </div>
              ))}
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Paiement sécurisé par Stripe & CinetPay. Résiliation en 1 clic.</span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 py-3 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50"
              >
                Retour
              </button>
              <button
                onClick={handleFinishOnboarding}
                className="w-2/3 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold text-xs rounded-xl transition shadow-lg shadow-teal-600/20"
              >
                Valider & Démarrer
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
