import React, { useState, useEffect } from 'react';
import { AdminStats, MakePromptSpec } from '../types';
import { Shield, Users, DollarSign, Layers, AlertOctagon, Copy, Check, Terminal, RefreshCw } from 'lucide-react';

export const AdminView: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [prompts, setPrompts] = useState<MakePromptSpec[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'metrics' | 'prompts' | 'logs'>('metrics');

  useEffect(() => {
    fetchStats();
    fetchPrompts();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPrompts = async () => {
    try {
      const res = await fetch('/api/prompts');
      const data = await res.json();
      setPrompts(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyPrompt = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Admin Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 bg-amber-950 px-2.5 py-1 rounded border border-amber-800">
            Console Administrateur CVGen
          </span>
          <h1 className="text-2xl font-extrabold text-white mt-2 flex items-center gap-2">
            <Shield className="w-6 h-6 text-amber-400" />
            Panneau d'Administration & Workflows Make.com
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Suivi des métriques clés, rapports d'erreurs et spécifications des prompts API Claude/Gemini.
          </p>
        </div>

        <button
          onClick={fetchStats}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Actualiser
        </button>
      </div>

      {/* ADMIN METRICS SUMMARY (SECTION 1.5) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Inscrits Total</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{stats?.totalUsers || 142}</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">+12% cette semaine</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Générations</span>
            <Layers className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{stats?.totalGenerations || 850}</p>
          <p className="text-[11px] text-teal-600 font-semibold mt-1">Générations enregistrées</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">MRR Estimé</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-600">{stats?.mrr || 1840} €</p>
          <p className="text-[11px] text-slate-500 mt-1">Revenu Mensuel Récurrent</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Taux de Churn</span>
            <AlertOctagon className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{stats?.churnRate || 2.4}%</p>
          <p className="text-[11px] text-slate-500 mt-1">Résililations mensuelles</p>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex border-b border-slate-200 space-x-4 bg-white px-4 pt-3 rounded-t-xl border">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-2 ${activeTab === 'metrics' ? 'border-amber-500 text-amber-800' : 'border-transparent text-slate-500'}`}
        >
          <Users className="w-4 h-4" />
          Abonnés & Quotas
        </button>

        <button
          onClick={() => setActiveTab('prompts')}
          className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-2 ${activeTab === 'prompts' ? 'border-amber-500 text-amber-800' : 'border-transparent text-slate-500'}`}
        >
          <Terminal className="w-4 h-4" />
          Prompts Exacts Make.com / Claude (4 Modules)
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-2 ${activeTab === 'logs' ? 'border-amber-500 text-amber-800' : 'border-transparent text-slate-500'}`}
        >
          <AlertOctagon className="w-4 h-4" />
          Logs d'Erreurs API ({stats?.recentLogs?.length || 0})
        </button>
      </div>

      {/* TAB 1: USERS LIST */}
      {activeTab === 'metrics' && (
        <div className="bg-white rounded-b-xl border-x border-b border-slate-200 p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Aperçu Récapitulatif Hebdomadaire</h3>
          <p className="text-xs text-slate-500">
            Ce rapport synthétique correspond au scénario D (Reporting automatique tous les lundis à 8h).
          </p>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-900 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3">Utilisateur</th>
                  <th className="p-3">Formule</th>
                  <th className="p-3">Statut Abonnement</th>
                  <th className="p-3">Quota</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-3 font-medium">kamilathosseni4@gmail.com</td>
                  <td className="p-3"><span className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-bold">Pro</span></td>
                  <td className="p-3"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Actif</span></td>
                  <td className="p-3 font-semibold">18 / 20 restant(s)</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">jean.dupont@test.fr</td>
                  <td className="p-3"><span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">Illimité</span></td>
                  <td className="p-3"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Actif</span></td>
                  <td className="p-3 font-semibold">94 / 100 restant(s)</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">candidate.beta@gmail.com</td>
                  <td className="p-3"><span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold">Découverte</span></td>
                  <td className="p-3"><span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">À risque</span></td>
                  <td className="p-3 font-semibold">0 / 3 restant(s)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PROMPTS EXACTS CLAUDE / MAKE.COM (REQUESTED IN SPEC) */}
      {activeTab === 'prompts' && (
        <div className="bg-white rounded-b-xl border-x border-b border-slate-200 p-6 space-y-6">
          <div className="bg-teal-50 border border-teal-200 p-4 rounded-xl text-xs text-teal-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-teal-700" />
              Prompts Prêts à l'Emploi pour les Scénarios Make.com & API Claude / Gemini
            </p>
            <p>
              Copiez-collez ces 4 prompts structurés dans vos modules API Anthropic / Claude au sein de Make.com.
            </p>
          </div>

          <div className="space-y-6">
            {prompts.map((p) => (
              <div key={p.id} className="bg-slate-900 text-slate-100 rounded-xl p-5 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <h4 className="text-sm font-bold text-amber-400">{p.title}</h4>
                  <button
                    onClick={() => handleCopyPrompt(`${p.systemPrompt}\n\n${p.userPromptTemplate}`, p.id)}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-teal-300 px-3 py-1 rounded font-semibold transition flex items-center gap-1"
                  >
                    {copiedId === p.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === p.id ? 'Copié !' : 'Copier le Prompt'}
                  </button>
                </div>

                <p className="text-xs text-slate-300 font-medium">{p.purpose}</p>

                <div className="space-y-2 text-xs font-mono bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                  <p className="text-slate-500 font-sans font-bold uppercase text-[10px]">System Prompt :</p>
                  <p className="text-slate-300 whitespace-pre-wrap">{p.systemPrompt}</p>

                  <p className="text-slate-500 font-sans font-bold uppercase text-[10px] pt-2">User Prompt Template :</p>
                  <p className="text-teal-300 whitespace-pre-wrap">{p.userPromptTemplate}</p>
                </div>

                <p className="text-[11px] text-slate-400"><strong>Format attendu :</strong> {p.outputFormat}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ERROR LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-b-xl border-x border-b border-slate-200 p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Journal des Logs d'Erreurs</h3>
          <p className="text-xs text-slate-500">Table Logs_erreurs de votre schéma Airtable.</p>

          <div className="space-y-2">
            {stats?.recentLogs && stats.recentLogs.length > 0 ? (
              stats.recentLogs.map((log) => (
                <div key={log.id} className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs flex justify-between items-center text-rose-900">
                  <div>
                    <span className="font-bold">{log.errorType}</span> — {log.detail}
                  </div>
                  <span className="text-[10px] text-rose-600">{log.date}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-4 italic">Aucune erreur récente enregistrée dans le système.</p>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
