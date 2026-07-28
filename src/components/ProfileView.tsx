import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { UserCheck, FileText, Upload, Save, CheckCircle, Lightbulb, User, Mail, Calendar, ShieldCheck } from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile;
  onUpdateCVSource: (cvText: string, fileName?: string) => Promise<void>;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdateCVSource }) => {
  const [cvText, setCvText] = useState(user.sourceCVText || '');
  const [fileName, setFileName] = useState(user.sourceCVFileName || '');
  const [isSaving, setIsSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  // Sync state when user prop changes
  useEffect(() => {
    setCvText(user.sourceCVText || '');
    setFileName(user.sourceCVFileName || '');
  }, [user]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setCvText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleSave = async () => {
    if (!cvText || cvText.trim().length < 20) {
      alert('Le texte de votre CV source doit contenir au moins 20 caractères.');
      return;
    }

    setIsSaving(true);
    try {
      await onUpdateCVSource(cvText, fileName);
      setIsSaving(false);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3500);
    } catch (e) {
      console.error(e);
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* EXPLANATORY BANNER ABOUT CV SOURCE */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-teal-700/50 shadow-xl space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0 border border-teal-500/30">
            <Lightbulb className="w-5 h-5 text-amber-300" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-teal-300 bg-teal-950 px-2.5 py-0.5 rounded border border-teal-800">
              Comprendre votre CV Source
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              À quoi sert la page "Mon CV Source" ?
            </h1>
          </div>
        </div>

        <div className="bg-slate-950/70 p-4 rounded-xl border border-teal-500/20 text-xs text-slate-300 leading-relaxed space-y-2">
          <p>
            <strong>Mon CV Source</strong> est votre <strong className="text-teal-300">base de données personnelle de référence</strong>. Il rassemble l'ensemble de vos vérités professionnelles : toutes vos expériences passées, vos diplômes réels, vos compétences techniques, vos langues et vos coordonnées.
          </p>
          <p>
            🤖 <strong>Comment l'IA l'utilise :</strong> Lorsque vous collez une offre d'emploi dans le générateur, l'IA Gemini piochera uniquement dans ce CV Source pour sélectionner, réorganiser et formuler sur-mesure le CV parfait optimisé ATS, sans jamais inventer de fausses expériences.
          </p>
        </div>
      </div>

      {/* USER PROFILE INFO BAR */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold border border-slate-300">
            <User className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <p className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              {user.email} <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </p>
            <p className="text-slate-500 text-[11px] flex items-center gap-2 mt-0.5">
              <span>Abonnement : <strong className="text-teal-700">{user.formula}</strong> ({user.subscriptionStatus})</span>
              <span>•</span>
              <span>Quota : <strong>{user.remainingQuota} / {user.monthlyQuota}</strong></span>
            </p>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          Inscrit le : <strong>{user.registrationDate}</strong>
        </div>
      </div>

      {/* EDIT CV SOURCE EDITOR */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-600" />
              CV Source de : <span className="text-teal-700 underline">{user.email}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Modifiez ou collez ici la version la plus complète de votre parcours professionnel.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const namePrefix = user.email.split('@')[0].replace(/[0-9_.-]+/g, ' ').toUpperCase();
                const template = `${namePrefix}\n${user.email} | +33 6 12 34 56 78 | Paris, France\n\nPROFIL PROFESSIONNEL\nProfessionnel(le) diplômé(e) et expérimenté(e) spécialisé(e) dans mon domaine d'activité. Orienté(e) résultats et travail d'équipe.\n\nEXPÉRIENCES PROFESSIONNELLES\n- Intitulé du Poste (2022 - Présent)\n  * Réalisation de projets majeurs et gestion des opérations.\n- Postes Précédents (2019 - 2022)\n  * Développement d'activités et optimisation des résultats.\n\nFORMATIONS & DIPLÔMES\n- Diplôme Principal (2019)\n\nCOMPÉTENCES & LANGUES\n- Outils, Langues (Français, Anglais)`;
                setCvText(template);
              }}
              className="px-3 py-2 bg-teal-50 text-teal-700 hover:bg-teal-100 text-xs font-bold rounded-lg transition border border-teal-200"
            >
              Réinitialiser avec mon email ({user.email.split('@')[0]})
            </button>

            <label className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg cursor-pointer transition flex items-center gap-2 border border-slate-300">
              <Upload className="w-4 h-4 text-slate-600" />
              <span>Charger fichier (.txt)</span>
              <input type="file" accept=".txt,.doc,.docx" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {fileName && (
          <div className="text-xs text-slate-600 bg-teal-50/60 p-2.5 rounded-lg border border-teal-200 flex items-center justify-between">
            <span>Fichier source connecté : <strong>{fileName}</strong></span>
          </div>
        )}

        <textarea
          value={cvText}
          onChange={(e) => setCvText(e.target.value)}
          rows={18}
          placeholder="Copiez-collez ici l'intégralité de votre CV de référence (Vos nom, prénom, contact, liste détaillée de toutes vos expériences passées avec dates, entreprises et missions, formations, diplômes, langues, outils maîtrisés...)"
          className="w-full p-4 border border-slate-300 rounded-xl text-xs text-slate-800 font-mono leading-relaxed focus:ring-2 focus:ring-teal-500 focus:outline-none bg-slate-50/50"
        />

        <div className="flex justify-between items-center pt-2">
          {savedMsg ? (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 animate-bounce">
              <CheckCircle className="w-4 h-4" /> CV source mis à jour et sauvegardé !
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">Ce CV sera automatiquement utilisé pour toutes vos futures générations.</span>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl transition shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Enregistrement en cours...' : 'Enregistrer mon CV Source'}</span>
          </button>
        </div>

      </div>

    </div>
  );
};
