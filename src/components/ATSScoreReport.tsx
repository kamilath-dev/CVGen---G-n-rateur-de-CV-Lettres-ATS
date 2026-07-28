import React from 'react';
import { ATSAnalysis } from '../types';
import { CheckCircle2, AlertTriangle, Sparkles, Target, Zap } from 'lucide-react';

interface ATSScoreReportProps {
  analysis: ATSAnalysis;
  jobTitle: string;
  companyName: string;
}

export const ATSScoreReport: React.FC<ATSScoreReportProps> = ({ analysis, jobTitle, companyName }) => {
  const score = analysis.matchScore || 85;

  let scoreColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
  let badgeColor = 'bg-emerald-500';
  let scoreLabel = 'Excellente correspondance ATS';

  if (score < 70) {
    scoreColor = 'text-amber-600 bg-amber-50 border-amber-200';
    badgeColor = 'bg-amber-500';
    scoreLabel = 'Correspondance ATS Moyenne';
  } else if (score < 50) {
    scoreColor = 'text-rose-600 bg-rose-50 border-rose-200';
    badgeColor = 'bg-rose-500';
    scoreLabel = 'Faible correspondance ATS';
  }

  return (
    <div className="max-w-4xl mx-auto my-4 space-y-6">
      {/* Top Banner Score Gauge */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="relative flex items-center justify-center">
            <div className={`w-28 h-28 rounded-full border-8 border-slate-100 flex flex-col items-center justify-center shadow-inner ${scoreColor}`}>
              <span className="text-3xl font-extrabold tracking-tight">{score}%</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Score ATS</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2.5 h-2.5 rounded-full ${badgeColor}`} />
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{scoreLabel}</span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Analyse de Correspondance : {jobTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Évaluation basée sur les algorithmes de filtrage automatisé de {companyName || 'l\'employeur'}.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs text-slate-700 min-w-[220px]">
          <p className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" /> Ton attendu
          </p>
          <p className="text-slate-600 font-medium">{analysis.toneMatch || 'Professionnel et structuré'}</p>
        </div>
      </div>

      {/* Keywords Found vs Missing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matched Keywords */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Mots-clés ATS validés ({analysis.keywordsFound?.length || 0})
          </h4>
          <p className="text-xs text-slate-500 mb-3">
            Ces termes clés de l'offre sont bien présents dans votre CV généré :
          </p>
          <div className="flex flex-wrap gap-2">
            {analysis.keywordsFound?.map((kw, i) => (
              <span key={i} className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Missing / Recommended Keywords */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Mots-clés à accentuer ({analysis.keywordsMissing?.length || 0})
          </h4>
          <p className="text-xs text-slate-500 mb-3">
            Ajoutez ces mots-clés dans vos expériences si vous possédez la compétence :
          </p>
          <div className="flex flex-wrap gap-2">
            {analysis.keywordsMissing?.map((kw, i) => (
              <span key={i} className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-md font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations & Strengths */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 space-y-4">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-600" />
          Recommandations d'optimisation
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-teal-50/50 p-4 rounded-lg border border-teal-100">
            <p className="font-bold text-teal-900 mb-2 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-teal-700" />
              Points forts identifiés
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-teal-950">
              {analysis.keyStrengths?.map((str, i) => (
                <li key={i}>{str}</li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <p className="font-bold text-slate-900 mb-2">Conseils d'amélioration</p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-700">
              {analysis.recommendations?.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
