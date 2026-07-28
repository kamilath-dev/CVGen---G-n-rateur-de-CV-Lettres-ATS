import React, { useState } from 'react';
import { UserProfile, GenerationRecord } from '../types';
import { Language, translations } from '../translations';
import { CVRenderer } from './CVRenderer';
import { CoverLetterRenderer } from './CoverLetterRenderer';
import { ATSScoreReport } from './ATSScoreReport';
import { Zap, Link as LinkIcon, FileText, Sparkles, AlertCircle, Layout, Download, Printer, ArrowLeft, RefreshCw, Layers } from 'lucide-react';

interface GeneratorViewProps {
  user: UserProfile;
  onGenerationComplete: (record: GenerationRecord) => void;
  onQuotaExceeded: () => void;
  lang?: Language;
}

export const GeneratorView: React.FC<GeneratorViewProps> = ({
  user,
  onGenerationComplete,
  onQuotaExceeded,
  lang = 'fr'
}) => {
  const t = translations[lang];
  const [jobOfferInput, setJobOfferInput] = useState('');
  const [isUrl, setIsUrl] = useState(false);
  const [personalNotes, setPersonalNotes] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<'sidebar-teal' | 'executive-navy' | 'minimal-modern' | 'tech-slate'>('sidebar-teal');
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'cv' | 'letter' | 'ats'>('cv');
  const [currentResult, setCurrentResult] = useState<GenerationRecord | null>(null);

  // Auto detect if input is URL
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setJobOfferInput(val);
    if (val.trim().startsWith('http://') || val.trim().startsWith('https://')) {
      setIsUrl(true);
    } else {
      setIsUrl(false);
    }
  };

  const handleGenerate = async () => {
    if (!jobOfferInput || jobOfferInput.trim().length < 15) {
      setErrorMsg(lang === 'en' 
        ? 'Please provide the job description text or URL link (at least 15 characters).' 
        : 'Veuillez fournir le texte ou le lien URL de l\'offre d\'emploi (au moins 15 caractères).'
      );
      return;
    }

    if (user.remainingQuota <= 0) {
      onQuotaExceeded();
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);

    try {
      let finalJobText = jobOfferInput;

      // Step 1: If URL, scrape job offer
      if (isUrl) {
        setLoadingStep(lang === 'en' ? 'Extracting text from job posting URL...' : 'Extraction du texte depuis l\'URL de l\'offre d\'emploi...');
        const scrapeRes = await fetch('/api/scrape-job', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: jobOfferInput.trim() })
        });
        const scrapeData = await scrapeRes.json();
        if (scrapeData.text) {
          finalJobText = scrapeData.text;
        }
      }

      // Step 2: AI Generation
      setLoadingStep(lang === 'en' ? 'Analyzing key skills & ATS keywords with Gemini AI...' : 'Analyse des compétences clés & mots-clés ATS par l\'IA Gemini...');
      await new Promise(r => setTimeout(r, 600));

      setLoadingStep(lang === 'en' ? 'Rewriting your resume to maximize ATS match score...' : 'Reformulation de votre CV pour maximiser le score de correspondance...');
      
      const genRes = await fetch('/api/generate-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          jobOfferText: finalJobText,
          personalNotes,
          templateId: selectedTemplate
        })
      });

      const genData = await genRes.json();

      if (!genRes.ok) {
        if (genData.error === 'Quota atteint') {
          onQuotaExceeded();
          setIsLoading(false);
          return;
        }
        throw new Error(genData.message || genData.error || (lang === 'en' ? 'Generation error.' : 'Erreur lors de la génération.'));
      }

      setLoadingStep(lang === 'en' ? 'Drafting custom cover letter & calculating ATS score...' : 'Rédaction de la lettre de motivation sur-mesure & calcul du score...');
      await new Promise(r => setTimeout(r, 400));

      const record: GenerationRecord = genData.record;
      setCurrentResult(record);
      onGenerationComplete(record);
      setIsLoading(false);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || (lang === 'en' ? 'An error occurred during generation.' : 'Une erreur est survenue lors de la génération.'));
      setIsLoading(false);
    }
  };

  const handlePrintCV = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Banner Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Zap className="w-6 h-6 text-teal-600" />
            {t.genTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t.genSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-teal-800">
            {t.quotaLabel} : <strong>{user.remainingQuota} / {user.monthlyQuota}</strong>
          </div>
        </div>
      </div>

      {/* FORM & INPUT SECTION */}
      {!currentResult && !isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Inputs */}
          <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-md space-y-6">
            
            {errorMsg && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Field 1: Job offer URL or text */}
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-teal-600" />
                  1. {t.jobOfferLabel}
                </span>
                {isUrl && (
                  <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 flex items-center gap-1">
                    <LinkIcon className="w-3 h-3" /> {lang === 'en' ? 'URL Link Detected' : 'Lien URL détecté'}
                  </span>
                )}
              </label>

              <textarea
                value={jobOfferInput}
                onChange={handleInputChange}
                rows={8}
                placeholder={t.jobOfferPlaceholder}
                className="w-full p-4 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition font-sans"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                {lang === 'en' ? 'Tip: The more detailed the posting (skills, responsibilities), the higher your ATS score.' : 'Astuce : Plus l\'annonce est détaillée (compétences, responsabilités), plus le score ATS sera élevé.'}
              </p>
            </div>

            {/* Field 2: Personal notes */}
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                2. {t.notesLabel}
              </label>
              <input
                type="text"
                value={personalNotes}
                onChange={(e) => setPersonalNotes(e.target.value)}
                placeholder={t.notesPlaceholder}
                className="w-full p-3 border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Action Submit Button */}
            <div className="pt-2">
              <button
                onClick={handleGenerate}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold text-sm transition shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5 text-amber-300" />
                <span>{t.generateBtn}</span>
              </button>
            </div>

          </div>

          {/* RIGHT: Template Selection */}
          <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-md space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
              <Layout className="w-4 h-4 text-teal-600" />
              {t.templateLabel}
            </h3>

            <div className="space-y-3">
              {/* Template 1: Sidebar Teal */}
              <div
                onClick={() => setSelectedTemplate('sidebar-teal')}
                className={`p-3.5 rounded-lg border-2 cursor-pointer transition flex items-center gap-3 ${selectedTemplate === 'sidebar-teal' ? 'border-teal-600 bg-teal-50/60' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <div className="w-8 h-10 bg-teal-900 rounded border border-teal-700 flex flex-col justify-between p-1">
                  <div className="w-2.5 h-full bg-teal-600 rounded-sm" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Sidebar Teal (Signature)</p>
                  <p className="text-[10px] text-slate-500">{lang === 'en' ? '2-column layout with dark teal sidebar, highly ATS-readable.' : 'Mise en page 2 colonnes avec barre latérale vert canard, très lisible ATS.'}</p>
                </div>
              </div>

              {/* Template 2: Executive Navy */}
              <div
                onClick={() => setSelectedTemplate('executive-navy')}
                className={`p-3.5 rounded-lg border-2 cursor-pointer transition flex items-center gap-3 ${selectedTemplate === 'executive-navy' ? 'border-teal-600 bg-teal-50/60' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <div className="w-8 h-10 bg-slate-900 rounded border border-slate-700 flex flex-col p-1">
                  <div className="w-full h-2.5 bg-amber-500 mb-1 rounded-xs" />
                  <div className="w-full h-1 bg-slate-700 rounded-xs" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Executive Navy</p>
                  <p className="text-[10px] text-slate-500">{lang === 'en' ? 'Classic corporate style with navy header and gold accents.' : 'Style classique corporate avec en-tête bleu nuit et dorures.'}</p>
                </div>
              </div>

              {/* Template 3: Minimal Modern */}
              <div
                onClick={() => setSelectedTemplate('minimal-modern')}
                className={`p-3.5 rounded-lg border-2 cursor-pointer transition flex items-center gap-3 ${selectedTemplate === 'minimal-modern' ? 'border-teal-600 bg-teal-50/60' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <div className="w-8 h-10 bg-slate-100 rounded border border-slate-300 p-1 flex flex-col gap-1">
                  <div className="w-full h-2 bg-slate-800 rounded-xs" />
                  <div className="w-full h-1 bg-slate-300" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Minimal Modern</p>
                  <p className="text-[10px] text-slate-500">{lang === 'en' ? 'Minimalist, sleek & modern. Ideal for tech and creative roles.' : 'Minimaliste, moderne et épuré. Idéal pour tous secteurs.'}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 text-[11px] text-slate-600">
              💡 {lang === 'en' ? 'Your source resume defined in "My Source Resume" will serve as the base.' : 'Votre CV source défini dans "Mon Profil" servira de base d\'informations.'}
            </div>
          </div>

        </div>
      )}

      {/* LOADING SCREEN */}
      {isLoading && (
        <div className="max-w-2xl mx-auto my-12 bg-white p-10 rounded-2xl shadow-2xl border border-slate-200 text-center space-y-6">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-teal-200 animate-ping opacity-40" />
            <div className="w-20 h-20 rounded-full border-4 border-teal-600 border-t-transparent animate-spin flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-teal-600" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {t.generatingBtn}
            </h2>
            <p className="text-xs font-semibold text-teal-700 mt-2 animate-pulse">
              {loadingStep || (lang === 'en' ? 'Processing...' : 'Traitement des données...')}
            </p>
          </div>
        </div>
      )}

      {/* RESULT VIEW */}
      {currentResult && !isLoading && (
        <div className="space-y-6">
          
          {/* Action Bar */}
          <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-wrap justify-between items-center gap-4 shadow-lg">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentResult(null)}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {lang === 'en' ? 'New Generation' : 'Nouvelle analyse'}
              </button>
              <div>
                <h3 className="text-sm font-bold text-white">
                  {currentResult.jobTitle} — <span className="text-teal-400">{currentResult.companyName}</span>
                </h3>
                <p className="text-[10px] text-slate-400">{t.atsScoreTitle} : <strong className="text-emerald-400">{currentResult.atsScore}%</strong></p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrintCV}
                className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 transition flex items-center gap-1.5 shadow-md"
              >
                <Printer className="w-4 h-4" />
                {t.downloadPdf}
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 space-x-4 bg-white px-4 pt-3 rounded-t-xl border">
            <button
              onClick={() => setActiveTab('cv')}
              className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-2 ${activeTab === 'cv' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              <FileText className="w-4 h-4" />
              {t.tabCV} ({selectedTemplate})
            </button>

            <button
              onClick={() => setActiveTab('letter')}
              className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-2 ${activeTab === 'letter' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              <Sparkles className="w-4 h-4" />
              {t.tabLetter}
            </button>

            <button
              onClick={() => setActiveTab('ats')}
              className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-2 ${activeTab === 'ats' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              <Layers className="w-4 h-4" />
              {t.tabAts} ({currentResult.atsScore}%)
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-slate-100 p-2 sm:p-6 rounded-b-xl border-x border-b border-slate-200 min-h-[600px]">
            {activeTab === 'cv' && (
              <CVRenderer cvData={currentResult.cvData} templateId={selectedTemplate} />
            )}

            {activeTab === 'letter' && (
              <CoverLetterRenderer
                coverLetterText={currentResult.coverLetter}
                jobTitle={currentResult.jobTitle}
                companyName={currentResult.companyName}
                candidateName={currentResult.cvData.personalInfo.fullName}
              />
            )}

            {activeTab === 'ats' && (
              <ATSScoreReport
                analysis={currentResult.atsAnalysis}
                jobTitle={currentResult.jobTitle}
                companyName={currentResult.companyName}
              />
            )}
          </div>

        </div>
      )}

    </div>
  );
};
