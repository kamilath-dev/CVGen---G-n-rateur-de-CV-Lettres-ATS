import React, { useState, useEffect } from 'react';
import { UserProfile, GenerationRecord } from '../types';
import { LayoutDashboard, Plus, Calendar, Building, Award, Eye, Trash2, Download, ExternalLink, Zap } from 'lucide-react';

interface DashboardViewProps {
  user: UserProfile;
  onNewGeneration: () => void;
  onManageSubscription: () => void;
  onSelectRecord: (record: GenerationRecord) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  onNewGeneration,
  onManageSubscription,
  onSelectRecord
}) => {
  const [generations, setGenerations] = useState<GenerationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGenerations();
  }, [user.id]);

  const fetchGenerations = async () => {
    try {
      const res = await fetch(`/api/generations?userId=${user.id}`);
      const data = await res.json();
      setGenerations(data || []);
      setIsLoading(false);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Instant optimistic state removal
    setGenerations(prev => prev.filter(g => g.id !== id));

    try {
      await fetch(`/api/generations/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error(err);
      fetchGenerations();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner Dashboard */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-teal-400 bg-teal-950 px-2.5 py-1 rounded border border-teal-800">
            Tableau de Bord Candidat
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Vos Candidatures & Générations CV
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gérez vos documents optimisés et suivez vos performances d'adéquation ATS pour <strong>{user.email}</strong>.
          </p>
        </div>

        {/* Quota & Action Widget */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
          <div>
            <p className="text-[10px] text-slate-400 font-semibold">QUOTA CE MOIS-CI</p>
            <p className="text-lg font-bold text-teal-300">
              {user.remainingQuota} / {user.monthlyQuota} restant(s)
            </p>
            <p className="text-[10px] text-slate-500">Formule {user.formula}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNewGeneration}
              className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs rounded-lg transition shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Nouvelle Génération
            </button>

            <button
              onClick={onManageSubscription}
              className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition flex items-center gap-1"
            >
              <span>Abonnement</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* GENERATIONS HISTORY LIST */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-teal-600" />
            Historique des Générations ({generations.length})
          </h2>
          <span className="text-xs text-slate-500">Classées par date récente</span>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-xs text-slate-500">Chargement de votre historique...</div>
        ) : generations.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Historique des générations vide</p>
              <p className="text-xs text-slate-500 mt-1">Vous n'avez pas encore généré de CV adapté. Collez une offre d'emploi pour commencer !</p>
            </div>
            <button
              onClick={onNewGeneration}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg transition shadow-sm"
            >
              Générer mon premier CV
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generations.map((gen) => (
              <div
                key={gen.id}
                onClick={() => onSelectRecord(gen)}
                className="bg-slate-50/80 hover:bg-slate-50 rounded-xl p-5 border border-slate-200 hover:border-teal-500/60 transition cursor-pointer flex flex-col justify-between space-y-4 group shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {gen.date}
                    </span>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      gen.atsScore >= 80 ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      Score ATS {gen.atsScore}%
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition line-clamp-2">
                    {gen.jobTitle}
                  </h3>

                  <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5 mt-1">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {gen.companyName}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex justify-between items-center text-xs">
                  <span className="text-[10px] font-medium text-slate-500 capitalize">
                    Style : {gen.templateId || 'Sidebar Teal'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDelete(gen.id, e)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition"
                      title="Supprimer définitivement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <span className="text-teal-600 font-bold flex items-center gap-1 text-[11px]">
                      <Eye className="w-3.5 h-3.5" /> Voir
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
