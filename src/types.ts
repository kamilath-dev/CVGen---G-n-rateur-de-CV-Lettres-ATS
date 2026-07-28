export type SubscriptionFormula = 'Découverte' | 'Pro' | 'Illimité';
export type SubscriptionStatus = 'Actif' | 'À risque' | 'Annulé';

export interface UserProfile {
  id: string;
  email: string;
  formula: SubscriptionFormula;
  monthlyQuota: number;
  remainingQuota: number;
  subscriptionStatus: SubscriptionStatus;
  registrationDate: string;
  sourceCVText: string;
  sourceCVFileName?: string;
  stripeCustomerId?: string;
  isAdmin?: boolean;
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  highlights: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  year: string;
  details?: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface LanguageItem {
  name: string;
  level: string;
}

export interface TailoredCV {
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    website?: string;
    summary: string;
  };
  skillCategories: SkillCategory[];
  experiences: ExperienceItem[];
  education: EducationItem[];
  languages: LanguageItem[];
  certifications?: string[];
  interests?: string[];
}

export interface ATSAnalysis {
  matchScore: number; // 0 to 100
  keywordsFound: string[];
  keywordsMissing: string[];
  toneMatch: string;
  recommendations: string[];
  keyStrengths: string[];
}

export interface GenerationRecord {
  id: string;
  userId: string;
  date: string;
  jobTitle: string;
  companyName: string;
  jobOfferInput: string;
  personalNotes?: string;
  atsScore: number;
  atsAnalysis: ATSAnalysis;
  cvData: TailoredCV;
  coverLetter: string;
  templateId: 'sidebar-teal' | 'executive-navy' | 'minimal-modern' | 'tech-slate';
}

export interface ErrorLogRecord {
  id: string;
  date: string;
  userId: string;
  errorType: string;
  detail: string;
}

export interface AdminStats {
  totalUsers: number;
  totalGenerations: number;
  mrr: number;
  churnRate: number;
  activeSubscribers: number;
  recentLogs: ErrorLogRecord[];
}

export interface MakePromptSpec {
  id: string;
  title: string;
  purpose: string;
  systemPrompt: string;
  userPromptTemplate: string;
  outputFormat: string;
}
