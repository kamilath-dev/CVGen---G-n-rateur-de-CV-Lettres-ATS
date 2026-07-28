import React from 'react';
import { TailoredCV } from '../types';
import { Mail, Phone, MapPin, Linkedin, Globe, Award, BookOpen, Briefcase, Wrench, Languages } from 'lucide-react';

interface CVRendererProps {
  cvData: TailoredCV;
  templateId: 'sidebar-teal' | 'executive-navy' | 'minimal-modern' | 'tech-slate';
  isPrintMode?: boolean;
}

export const CVRenderer: React.FC<CVRendererProps> = ({ cvData, templateId, isPrintMode = false }) => {
  const { personalInfo, skillCategories, experiences, education, languages, certifications } = cvData;

  // TEMPLATE 1: SIDEBAR TEAL (THE SIGNATURE 2-COLUMN DESIGN FROM SPEC)
  if (templateId === 'sidebar-teal') {
    return (
      <div id="cv-print-area" className={`w-full bg-white shadow-xl text-slate-800 rounded-lg overflow-hidden border border-slate-200 transition-all ${isPrintMode ? 'shadow-none border-none max-w-none rounded-none' : 'max-w-4xl mx-auto my-4'}`}>
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[1050px]">
          
          {/* LEFT SIDEBAR (TEAL / CYAN THEME) */}
          <div className="md:col-span-4 bg-teal-900 text-teal-50 p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Profile Header */}
              <div className="mb-8 border-b border-teal-700/60 pb-6">
                <div className="w-20 h-20 bg-teal-700 text-teal-100 rounded-full flex items-center justify-center font-bold text-2xl border-2 border-teal-400 mb-4 shadow-inner">
                  {personalInfo.fullName.split(' ').map(n => n[0]).join('')}
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white">{personalInfo.fullName}</h1>
                <p className="text-teal-300 font-medium text-sm mt-1 leading-snug">{personalInfo.title}</p>
              </div>

              {/* Contact Info */}
              <div className="mb-8 space-y-3 text-xs text-teal-100">
                <h3 className="text-xs uppercase tracking-widest font-bold text-teal-300 mb-3 border-b border-teal-800 pb-1">
                  Contact
                </h3>
                {personalInfo.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span className="truncate">{personalInfo.email}</span>
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>{personalInfo.phone}</span>
                  </div>
                )}
                {personalInfo.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>{personalInfo.location}</span>
                  </div>
                )}
                {personalInfo.linkedin && (
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span className="truncate">{personalInfo.linkedin}</span>
                  </div>
                )}
                {personalInfo.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span className="truncate">{personalInfo.website}</span>
                  </div>
                )}
              </div>

              {/* Skills Section */}
              <div className="mb-8">
                <h3 className="text-xs uppercase tracking-widest font-bold text-teal-300 mb-3 border-b border-teal-800 pb-1 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-teal-400" />
                  Compétences
                </h3>
                <div className="space-y-4">
                  {skillCategories?.map((cat, idx) => (
                    <div key={idx}>
                      <p className="text-[11px] font-semibold text-teal-200 mb-1.5">{cat.category}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.items?.map((item, i) => (
                          <span key={i} className="text-[10px] bg-teal-800/80 text-teal-100 px-2 py-0.5 rounded border border-teal-700/50">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages */}
              {languages && languages.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-teal-300 mb-3 border-b border-teal-800 pb-1 flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5 text-teal-400" />
                    Langues
                  </h3>
                  <div className="space-y-2 text-xs">
                    {languages.map((lang, idx) => (
                      <div key={idx} className="flex justify-between items-center text-teal-100">
                        <span className="font-medium">{lang.name}</span>
                        <span className="text-[10px] text-teal-300 bg-teal-950/60 px-1.5 py-0.5 rounded">{lang.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {certifications && certifications.length > 0 && (
                <div>
                  <h3 className="text-xs uppercase tracking-widest font-bold text-teal-300 mb-3 border-b border-teal-800 pb-1 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-teal-400" />
                    Certifications
                  </h3>
                  <ul className="space-y-1.5 text-xs text-teal-100 list-disc list-inside">
                    {certifications.map((cert, idx) => (
                      <li key={idx} className="text-[11px] leading-snug">{cert}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-teal-800/60 text-[10px] text-teal-400/80 text-center">
              CV optimisé ATS — CVGen
            </div>
          </div>

          {/* RIGHT MAIN CONTENT */}
          <div className="md:col-span-8 p-6 md:p-8 bg-white flex flex-col justify-between">
            <div>
              {/* Summary Profile */}
              {personalInfo.summary && (
                <div className="mb-8 bg-teal-50/50 border-l-4 border-teal-600 p-4 rounded-r-md">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-teal-900 mb-1">
                    Profil Professionnel
                  </h2>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {personalInfo.summary}
                  </p>
                </div>
              )}

              {/* Professional Experience */}
              <div className="mb-8">
                <div className="flex items-center gap-2 border-b-2 border-teal-600 pb-2 mb-4">
                  <Briefcase className="w-4 h-4 text-teal-700" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Expériences Professionnelles
                  </h2>
                </div>

                <div className="space-y-6">
                  {experiences?.map((exp) => (
                    <div key={exp.id || exp.title} className="relative pl-4 border-l border-slate-200">
                      <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-teal-600" />
                      <div className="flex flex-wrap justify-between items-baseline mb-1">
                        <h3 className="text-sm font-bold text-slate-900">{exp.title}</h3>
                        <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                          {exp.startDate} – {exp.endDate}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-600 mb-2">
                        {exp.company} {exp.location ? `• ${exp.location}` : ''}
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 leading-normal">
                        {exp.highlights?.map((hl, hIdx) => (
                          <li key={hIdx} className="text-slate-700 font-normal">
                            <span className="text-slate-800">{hl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="mb-6">
                <div className="flex items-center gap-2 border-b-2 border-teal-600 pb-2 mb-4">
                  <BookOpen className="w-4 h-4 text-teal-700" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Formation & Diplômes
                  </h2>
                </div>

                <div className="space-y-3">
                  {education?.map((edu) => (
                    <div key={edu.id || edu.degree} className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xs font-bold text-slate-900">{edu.degree}</h3>
                        <p className="text-[11px] text-slate-600">{edu.school} {edu.details ? `— ${edu.details}` : ''}</p>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">{edu.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // TEMPLATE 2: EXECUTIVE NAVY (Classic Top Header Navy Theme)
  if (templateId === 'executive-navy') {
    return (
      <div id="cv-print-area" className={`w-full bg-white shadow-xl text-slate-800 rounded-lg overflow-hidden border border-slate-200 ${isPrintMode ? 'shadow-none border-none' : 'max-w-4xl mx-auto my-4'}`}>
        {/* Navy Banner */}
        <div className="bg-slate-900 text-white p-8 border-b-4 border-amber-500">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">{personalInfo.fullName}</h1>
              <p className="text-amber-400 font-semibold text-base mt-1">{personalInfo.title}</p>
            </div>
            <div className="text-xs text-slate-300 space-y-1 text-right">
              <p>{personalInfo.email} • {personalInfo.phone}</p>
              <p>{personalInfo.location} {personalInfo.linkedin ? `• ${personalInfo.linkedin}` : ''}</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Summary */}
          {personalInfo.summary && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                Résumé Professionnel
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed">{personalInfo.summary}</p>
            </div>
          )}

          {/* Experiences */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-4">
              Expériences Clés
            </h2>
            <div className="space-y-4">
              {experiences?.map(exp => (
                <div key={exp.id || exp.title}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-xs font-bold text-slate-900">{exp.title} — <span className="text-slate-600 font-normal">{exp.company}</span></h3>
                    <span className="text-[11px] text-slate-500">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <ul className="list-disc list-inside mt-1 space-y-1 text-xs text-slate-700">
                    {exp.highlights?.map((h, i) => <li key={i}>{h}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Skills & Education Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-200">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                Compétences
              </h2>
              <div className="space-y-2 text-xs">
                {skillCategories?.map((sc, i) => (
                  <div key={i}>
                    <strong className="text-slate-800">{sc.category}:</strong>
                    <span className="text-slate-600 ml-1">{sc.items?.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                Formation
              </h2>
              <div className="space-y-2 text-xs">
                {education?.map(edu => (
                  <div key={edu.id || edu.degree}>
                    <p className="font-bold text-slate-800">{edu.degree}</p>
                    <p className="text-slate-600">{edu.school} ({edu.year})</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // TEMPLATE 3 & 4 DEFAULT MINIMAL / TECH
  return (
    <div id="cv-print-area" className={`w-full bg-white shadow-xl text-slate-800 p-8 rounded-lg border border-slate-200 ${isPrintMode ? 'shadow-none border-none' : 'max-w-4xl mx-auto my-4'}`}>
      <div className="border-b-2 border-slate-800 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-slate-900">{personalInfo.fullName}</h1>
        <p className="text-slate-600 text-sm font-semibold">{personalInfo.title}</p>
        <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-2">
          <span>{personalInfo.email}</span>
          <span>{personalInfo.phone}</span>
          <span>{personalInfo.location}</span>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xs font-bold uppercase text-slate-900 tracking-wider mb-2">Profil</h2>
          <p className="text-xs text-slate-700 leading-relaxed">{personalInfo.summary}</p>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase text-slate-900 tracking-wider mb-3">Expériences</h2>
          <div className="space-y-4">
            {experiences?.map(exp => (
              <div key={exp.id || exp.title}>
                <div className="flex justify-between text-xs">
                  <span className="font-bold">{exp.title} | {exp.company}</span>
                  <span className="text-slate-500">{exp.startDate} - {exp.endDate}</span>
                </div>
                <ul className="list-disc list-inside text-xs text-slate-700 mt-1 space-y-1">
                  {exp.highlights?.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-xs font-bold uppercase text-slate-900 tracking-wider mb-2">Compétences</h2>
            <div className="text-xs text-slate-700 space-y-1">
              {skillCategories?.map((sc, i) => (
                <p key={i}><strong>{sc.category}:</strong> {sc.items?.join(', ')}</p>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase text-slate-900 tracking-wider mb-2">Formation</h2>
            <div className="text-xs text-slate-700 space-y-2">
              {education?.map(edu => (
                <p key={edu.id || edu.degree}><strong>{edu.degree}</strong> ({edu.year}) - {edu.school}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
