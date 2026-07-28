import React, { useState } from 'react';
import { Copy, Check, Download, FileText } from 'lucide-react';

interface CoverLetterRendererProps {
  coverLetterText: string;
  jobTitle: string;
  companyName: string;
  candidateName: string;
  onTextChange?: (newText: string) => void;
}

export const CoverLetterRenderer: React.FC<CoverLetterRendererProps> = ({
  coverLetterText,
  jobTitle,
  companyName,
  candidateName,
  onTextChange
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableText, setEditableText] = useState(coverLetterText);

  const handleCopy = () => {
    navigator.clipboard.writeText(editableText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTextUpdate = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setEditableText(text);
    if (onTextChange) onTextChange(text);
  };

  const handleDownloadDocx = () => {
    const element = document.createElement("a");
    const file = new Blob([editableText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Lettre_Motivation_${companyName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-4xl mx-auto my-4 bg-white rounded-xl shadow-lg border border-slate-200 p-6 md:p-8">
      {/* Top Header Bar */}
      <div className="flex flex-wrap justify-between items-center pb-4 mb-6 border-b border-slate-200 gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            Lettre de Motivation Personnalisée
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Poste : <strong className="text-slate-800">{jobTitle}</strong> chez <strong className="text-slate-800">{companyName}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
          >
            {isEditing ? 'Mode Aperçu' : 'Éditer le texte'}
          </button>
          <button
            onClick={handleCopy}
            className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition flex items-center gap-1.5 shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copié !' : 'Copier le texte'}
          </button>
          <button
            onClick={handleDownloadDocx}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-900 text-slate-100 hover:bg-slate-800 transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Télécharger (.txt/.doc)
          </button>
        </div>
      </div>

      {/* Editable Text Area vs Styled Preview */}
      {isEditing ? (
        <textarea
          value={editableText}
          onChange={handleTextUpdate}
          rows={16}
          className="w-full p-4 border border-teal-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none font-sans leading-relaxed"
        />
      ) : (
        <div className="bg-slate-50/70 p-6 md:p-8 rounded-lg border border-slate-200/80 font-sans text-sm text-slate-800 whitespace-pre-wrap leading-relaxed shadow-inner">
          <div className="text-right text-xs text-slate-500 mb-6 font-medium">
            {candidateName}<br />
            {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>

          <div className="space-y-4">
            {editableText.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-slate-700">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
