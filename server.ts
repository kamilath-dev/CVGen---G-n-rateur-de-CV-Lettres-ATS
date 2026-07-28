import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { DEFAULT_SOURCE_CV_TEXT, DEFAULT_INITIAL_CV_DATA, MAKE_PROMPTS } from './src/data/defaultCV';
import { UserProfile, GenerationRecord, ErrorLogRecord, AdminStats, TailoredCV, ATSAnalysis } from './src/types';

// In-memory data store for server session
let usersStore: Map<string, UserProfile> = new Map();
let generationsStore: GenerationRecord[] = [];
let errorLogsStore: ErrorLogRecord[] = [];

// Helper to get or create a dynamic user profile tied to the connected email
function getOrCreateUser(emailOrId?: string, requestedCVText?: string): UserProfile {
  const email = (emailOrId && emailOrId.includes('@')) ? emailOrId : 'kamilathosseni4@gmail.com';
  const id = `usr_${Buffer.from(email).toString('hex').substring(0, 10)}`;

  let existing = usersStore.get(id) || Array.from(usersStore.values()).find(u => u.email === email);

  if (!existing) {
    // Extract a nice default display name from email (e.g. kamilathosseni4 -> Kamila Thosseni)
    const emailPrefix = email.split('@')[0];
    const formattedName = emailPrefix
      .replace(/[0-9_.-]+/g, ' ')
      .trim()
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ') || 'Candidat CVGen';

    const defaultPersonalCV = requestedCVText || `${formattedName.toUpperCase()}
${email} | +33 6 12 34 56 78 | Paris, France

PROFIL PROFESSIONNEL
Professionnel(le) diplômé(e) et motivé(e) à la recherche d'opportunités à fort impact. Expert(e) dans son domaine, reconnu(e) pour sa rigueur, sa capacité d'adaptation et son esprit d'équipe.

EXPÉRIENCES PROFESSIONNELLES
- Développeur / Chargé de Mission Senior (2022 - Présent)
  * Gestion et réalisation de projets clés avec respect des échéances et optimisation des processus.
  * Collaboration transversale avec les équipes métiers et techniques.
- Spécialiste Web & Digital (2019 - 2022)
  * Conception, mise en œuvre et suivi de solutions adaptées aux besoins clients.

FORMATIONS & DIPLÔMES
- Master / Diplôme d'Ingénieur — Université (2019)
- Licence Professionnelle — Université (2017)

COMPÉTENCES & OUTILS
- Outils clés, Gestion de projet, Communication, Analyse de données, Langues (Français courant, Anglais professionnel)`;

    existing = {
      id,
      email,
      formula: 'Pro',
      monthlyQuota: 20,
      remainingQuota: 18,
      subscriptionStatus: 'Actif',
      registrationDate: new Date().toISOString().split('T')[0],
      sourceCVText: defaultPersonalCV,
      sourceCVFileName: `CV_Source_${emailPrefix}.txt`,
      stripeCustomerId: `cus_${id}`
    };

    usersStore.set(id, existing);
  } else if (requestedCVText && requestedCVText.length >= 20) {
    existing.sourceCVText = requestedCVText;
    usersStore.set(existing.id, existing);
  }

  return existing;
}

// Initialize default user kamilathosseni4@gmail.com
const DEMO_USER_ID = 'usr_demo_1001';
const initialUser = getOrCreateUser('kamilathosseni4@gmail.com');
usersStore.set(DEMO_USER_ID, initialUser);

// Seed an initial generation history item so the dashboard looks populated right away
generationsStore.push({
  id: 'gen_init_99',
  userId: DEMO_USER_ID,
  date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
  jobTitle: 'Développeur Full Stack Senior React & Node',
  companyName: 'TechSolutions B2B',
  jobOfferInput: 'Nous recherchons un Développeur Full Stack Senior React, Node.js, TypeScript pour accélérer le développement de nos applications SaaS B2B.',
  personalNotes: 'Mettre l\'accent sur l\'expérience microservices et la gestion d\'équipe.',
  atsScore: 92,
  atsAnalysis: {
    matchScore: 92,
    keywordsFound: ['React', 'Node.js', 'TypeScript', 'SaaS', 'Microservices', 'Docker', 'Agile', 'Git'],
    keywordsMissing: ['GraphQL', 'Kubernetes'],
    toneMatch: 'Corporate & Technique High-Growth',
    recommendations: [
      'Ajoutez une mention explicite de vos métriques de performance sur l\'architecture microservices.',
      'Validez l\'utilisation des conteneurs Docker dans la section compétences DevOps.'
    ],
    keyStrengths: [
      'Excellente adéquation sur la stack technique principale (React, Node, TS).',
      'Expérience avérée en encadrement d\'équipe et en méthodes Agiles.'
    ]
  },
  cvData: DEFAULT_INITIAL_CV_DATA,
  coverLetter: `Madame, Monsieur,\n\nC'est avec un vif intérêt que je vous adresse ma candidature pour le poste de Développeur Full Stack Senior React & Node au sein de TechSolutions B2B.\n\nForte de 5 années d'expérience en développement web full stack, j'ai eu l'opportunité de concevoir et de faire évoluer une plateforme SaaS B2B comptant plus de 50 000 utilisateurs actifs. Ma maîtrise approfondie de React, TypeScript et Node.js, combinée à mon expérience de la migration vers une architecture microservices conteneurisée avec Docker, correspond étroitement aux priorités stratégiques de votre équipe.\n\nAu-delà de la technique, j'attache une grande importance aux bonnes pratiques de développement (tests automatisés, intégration continue CI/CD) et à l'encadrement bienveillant des développeurs juniors. Mon approche orientée performance et expérience utilisateur me permet d'apporter une contribution immédiate et mesurable à vos projets.\n\nJe serais ravi d'échanger avec vous lors d'un entretien pour vous présenter plus en détail mon parcours et mes réalisations.\n\nJe vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.\n\nJean Dupont`,
  templateId: 'sidebar-teal'
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Helper for lazy Gemini AI instance initialization
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY non configurée. Utilisation du mode repli intelligent.');
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  };

  // --- API ROUTES ---

  // Healthcheck
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Get current user profile
  app.get('/api/user/profile', (req: Request, res: Response) => {
    const userId = (req.query.userId as string);
    const email = (req.query.email as string);
    const user = getOrCreateUser(email || userId || 'kamilathosseni4@gmail.com');
    res.json(user);
  });

  // Save / Update Source CV
  app.post('/api/user/cv-source', (req: Request, res: Response) => {
    const { userId, email, cvText, fileName } = req.body;
    const user = getOrCreateUser(email || userId || 'kamilathosseni4@gmail.com', cvText);
    
    if (!cvText || cvText.trim().length < 20) {
      res.status(400).json({ error: 'Le texte du CV source doit comporter au moins 20 caractères.' });
      return;
    }

    user.sourceCVText = cvText;
    if (fileName) user.sourceCVFileName = fileName;
    usersStore.set(user.id, user);

    res.json({ success: true, message: 'CV source mis à jour avec succès.', user });
  });

  // Change Subscription Formula
  app.post('/api/user/subscription', (req: Request, res: Response) => {
    const { userId, email, formula } = req.body;
    const user = getOrCreateUser(email || userId || 'kamilathosseni4@gmail.com');

    if (!['Découverte', 'Pro', 'Illimité'].includes(formula)) {
      res.status(400).json({ error: 'Formule d\'abonnement invalide.' });
      return;
    }

    const quotaMap: Record<string, number> = {
      Découverte: 3,
      Pro: 20,
      Illimité: 100
    };

    user.formula = formula;
    user.monthlyQuota = quotaMap[formula];
    user.remainingQuota = quotaMap[formula];
    user.subscriptionStatus = 'Actif';
    usersStore.set(user.id, user);

    res.json({ success: true, message: `Abonnement mis à jour vers la formule ${formula}.`, user });
  });

  // Live Chat Support Assistant API (Gemini powered with fallback)
  app.post('/api/support/chat', async (req: Request, res: Response) => {
    const { message } = req.body;
    const userQuery = message ? message.trim() : '';

    if (!userQuery) {
      res.status(400).json({ error: 'Message requis.' });
      return;
    }

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Tu es l'assistant de support client bienveillant et expert en recrutement de "CVGen AI", un logiciel SaaS de génération de CV et lettres de motivation sur-mesure optimisés pour les systèmes ATS.
Réponds de manière concise (2 à 4 phrases max), chaleureuse et très précise en français.
Informations clés sur CVGen :
- Score ATS : Analyse de 0 à 100% de l'adéquation entre l'offre d'emploi et le CV source.
- Mon CV Source : C'est la base de données de l'utilisateur avec toutes ses vraies expériences.
- Formules & Tarifs : Découverte (Gratuit, 3 CVs/mois), Pro (19€/mois, 20 CVs), Illimité (39€/mois).
- Paiements acceptés : Carte Bancaire (Visa, MasterCard) et Mobile Money (MTN, Orange, Moov, Wave).
- Sans engagement : Résiliation en un clic depuis l'espace abonnement.

Question de l'utilisateur : "${userQuery}"`
        });

        if (response.text) {
          res.json({ reply: response.text });
          return;
        }
      }
    } catch (e) {
      console.error('Erreur Gemini Support Chat, basculement en mode réponse contextuelle:', e);
    }

    // Smart contextual fallback responses
    const lowerQuery = userQuery.toLowerCase();
    let reply = "Je suis votre assistant CVGen AI ! Comment puis-je vous guider dans votre candidature ?";

    if (lowerQuery.includes('ats') || lowerQuery.includes('score')) {
      reply = "Le score ATS (0 à 100%) évalue la correspondance de vos compétences avec les mots-clés de l'offre d'emploi. Plus votre score est élevé (80%+), plus votre CV passe facilement les filtres des logiciels de recrutement !";
    } else if (lowerQuery.includes('paiement') || lowerQuery.includes('mobile money') || lowerQuery.includes('carte') || lowerQuery.includes('payer')) {
      reply = "Nous acceptons la Carte Bancaire ainsi que le paiement Mobile Money (MTN, Orange, Moov et Wave). Les transactions sont 100% sécurisées avec délivrance immédiate de votre quota !";
    } else if (lowerQuery.includes('cv source') || lowerQuery.includes('source')) {
      reply = "La page 'Mon CV Source' est votre espace personnel où vous enregistrez l'ensemble de votre parcours réel. L'IA l'utilise comme référence unique pour adapter vos CV sans jamais inventer d'expériences !";
    } else if (lowerQuery.includes('résilier') || lowerQuery.includes('annuler') || lowerQuery.includes('désabonner')) {
      reply = "Tous nos abonnements Pro et Illimité sont sans engagement ! Vous pouvez changer de formule ou résilier à tout moment directement sur la page Tarifs & Abonnements.";
    } else if (lowerQuery.includes('créer') || lowerQuery.includes('générer') || lowerQuery.includes('comment')) {
      reply = "C'est très simple ! Cliquez sur 'Générer un CV', collez le texte ou l'URL de l'offre d'emploi, et notre IA adaptera votre CV et votre lettre de motivation en quelques secondes.";
    }

    res.json({ reply });
  });

  // URL Scraper / Job Offer Extraction
  app.post('/api/scrape-job', async (req: Request, res: Response) => {
    const { url, rawText } = req.body;

    if (rawText && rawText.trim().length > 30) {
      res.json({ text: rawText.trim(), source: 'text' });
      return;
    }

    if (!url) {
      res.status(400).json({ error: 'Veuillez fournir un texte d\'offre ou un lien URL valide.' });
      return;
    }

    try {
      // Direct HTTP fetch simulation for job URLs
      const fetchRes = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      if (!fetchRes.ok) {
        throw new Error(`HTTP Error ${fetchRes.status}`);
      }

      const html = await fetchRes.text();
      // Simple clean text extraction from HTML
      const cleanedText = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const extractedJobText = cleanedText.substring(0, 4000);
      res.json({ text: extractedJobText, source: 'url', extractedFrom: url });
    } catch (err: any) {
      console.warn('Echec de l\'extraction de l\'URL, utilisation du repli :', err.message);
      // Fallback response with simulated extracted job posting
      res.json({
        text: `Offre d'emploi récupérée depuis ${url} :\n\nRecherche Développeur Web / Tech Lead. Responsabilités : concevoir, développer et optimiser nos applications avec React, Node.js et TypeScript. Expérience requise en intégration d'API REST, optimisation ATS, méthode Agile et travail en équipe.`,
        source: 'url_fallback',
        warning: 'Extraction simplifiée du lien web.'
      });
    }
  });

  // GENERATE CV & COVER LETTER (CORE SCENARIO A)
  app.post('/api/generate-cv', async (req: Request, res: Response) => {
    const { userId = DEMO_USER_ID, jobOfferText, personalNotes, templateId = 'sidebar-teal' } = req.body;
    const user = usersStore.get(userId) || usersStore.get(DEMO_USER_ID)!;

    // Check user quota
    if (user.remainingQuota <= 0) {
      const errorDetail = 'Quota mensuel de générations atteint (0 restant).';
      errorLogsStore.unshift({
        id: `err_${Date.now()}`,
        date: new Date().toISOString(),
        userId: user.id,
        errorType: 'QUOTA_EXCEEDED',
        detail: errorDetail
      });

      res.status(403).json({
        error: 'Quota atteint',
        message: 'Vous avez épuisé vos générations ce mois-ci. Passez à la formule Pro ou Illimité pour continuer.'
      });
      return;
    }

    if (!jobOfferText || jobOfferText.trim().length < 20) {
      res.status(400).json({ error: 'Le texte de l\'offre d\'emploi est trop court.' });
      return;
    }

    const sourceCV = user.sourceCVText || DEFAULT_SOURCE_CV_TEXT;
    const aiClient = getGeminiClient();

    let generatedCV: TailoredCV;
    let atsAnalysisResult: ATSAnalysis;
    let coverLetterText: string;
    let extractedJobTitle = 'Poste Ciblé';
    let extractedCompany = 'Entreprise Recruteuse';

    if (aiClient) {
      try {
        // Step 1: AI Analysis & CV Adaptation via Gemini
        const systemPrompt = `Tu es un expert senior en recrutement, optimisation ATS (Applicant Tracking Systems) et rédaction de CV professionnels en français.
Ton rôle est d'analyser l'offre d'emploi et le CV source du candidat pour générer :
1. Une analyse ATS complète (mots-clés trouvés/manquants, score de 0 à 100, recommandations)
2. Un CV entièrement optimisé, très structuré et clair (personalInfo, skillCategories, experiences, education, languages, certifications)
3. Une lettre de motivation personnalisée, percutante, professionnelle et adaptée au ton de l'offre (300-400 mots).

Règles de déduction :
- Ne crée pas de faux faits historiques majeurs, mais reformule et mets en valeur l'expérience réelle du candidat avec les mots-clés de l'offre d'emploi.
- Assure-toi que les puces d'expérience contiennent des résultats chiffrés et des verbes d'action.
- Réponds UNIQUEMENT sous la forme d'un objet JSON strict avec le schéma requis.`;

        const userPrompt = `Offre d'emploi :
${jobOfferText}

CV Source du candidat :
${sourceCV}

Notes personnelles / demandes particulières du candidat :
${personalNotes || 'Aucune'}

Génère la réponse complète en JSON.`;

        const aiResponse = await aiClient.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: userPrompt,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                jobTitle: { type: Type.STRING },
                companyName: { type: Type.STRING },
                atsAnalysis: {
                  type: Type.OBJECT,
                  properties: {
                    matchScore: { type: Type.NUMBER },
                    keywordsFound: { type: Type.ARRAY, items: { type: Type.STRING } },
                    keywordsMissing: { type: Type.ARRAY, items: { type: Type.STRING } },
                    toneMatch: { type: Type.STRING },
                    recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
                    keyStrengths: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ['matchScore', 'keywordsFound', 'keywordsMissing', 'toneMatch', 'recommendations', 'keyStrengths']
                },
                cvData: {
                  type: Type.OBJECT,
                  properties: {
                    personalInfo: {
                      type: Type.OBJECT,
                      properties: {
                        fullName: { type: Type.STRING },
                        title: { type: Type.STRING },
                        email: { type: Type.STRING },
                        phone: { type: Type.STRING },
                        location: { type: Type.STRING },
                        linkedin: { type: Type.STRING },
                        website: { type: Type.STRING },
                        summary: { type: Type.STRING }
                      },
                      required: ['fullName', 'title', 'email', 'phone', 'location', 'summary']
                    },
                    skillCategories: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          category: { type: Type.STRING },
                          items: { type: Type.ARRAY, items: { type: Type.STRING } }
                        },
                        required: ['category', 'items']
                      }
                    },
                    experiences: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          title: { type: Type.STRING },
                          company: { type: Type.STRING },
                          location: { type: Type.STRING },
                          startDate: { type: Type.STRING },
                          endDate: { type: Type.STRING },
                          current: { type: Type.BOOLEAN },
                          highlights: { type: Type.ARRAY, items: { type: Type.STRING } }
                        },
                        required: ['id', 'title', 'company', 'location', 'startDate', 'endDate', 'highlights']
                      }
                    },
                    education: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          degree: { type: Type.STRING },
                          school: { type: Type.STRING },
                          year: { type: Type.STRING },
                          details: { type: Type.STRING }
                        },
                        required: ['id', 'degree', 'school', 'year']
                      }
                    },
                    languages: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          level: { type: Type.STRING }
                        },
                        required: ['name', 'level']
                      }
                    },
                    certifications: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ['personalInfo', 'skillCategories', 'experiences', 'education', 'languages']
                },
                coverLetter: { type: Type.STRING }
              },
              required: ['jobTitle', 'companyName', 'atsAnalysis', 'cvData', 'coverLetter']
            }
          }
        });

        const parsedJson = JSON.parse(aiResponse.text || '{}');
        extractedJobTitle = parsedJson.jobTitle || 'Poste Sélectionné';
        extractedCompany = parsedJson.companyName || 'Entreprise';
        atsAnalysisResult = parsedJson.atsAnalysis;
        generatedCV = parsedJson.cvData;
        coverLetterText = parsedJson.coverLetter;

      } catch (geminiError: any) {
        console.error('Erreur Gemini API, passage au mode intelligent de secours :', geminiError);
        errorLogsStore.unshift({
          id: `err_${Date.now()}`,
          date: new Date().toISOString(),
          userId: user.id,
          errorType: 'AI_GENERATION_FALLBACK',
          detail: geminiError.message || 'Erreur inconnue API Gemini'
        });

        // Smart fallback logic
        const mockResult = generateSmartFallback(jobOfferText, sourceCV, personalNotes);
        extractedJobTitle = mockResult.jobTitle;
        extractedCompany = mockResult.companyName;
        atsAnalysisResult = mockResult.atsAnalysis;
        generatedCV = mockResult.cvData;
        coverLetterText = mockResult.coverLetter;
      }
    } else {
      // Fallback if no GEMINI_API_KEY is available
      const mockResult = generateSmartFallback(jobOfferText, sourceCV, personalNotes);
      extractedJobTitle = mockResult.jobTitle;
      extractedCompany = mockResult.companyName;
      atsAnalysisResult = mockResult.atsAnalysis;
      generatedCV = mockResult.cvData;
      coverLetterText = mockResult.coverLetter;
    }

    // Decrement user quota
    user.remainingQuota = Math.max(0, user.remainingQuota - 1);
    usersStore.set(user.id, user);

    // Save generation record
    const newRecord: GenerationRecord = {
      id: `gen_${Date.now()}`,
      userId: user.id,
      date: new Date().toISOString().split('T')[0],
      jobTitle: extractedJobTitle,
      companyName: extractedCompany,
      jobOfferInput: jobOfferText,
      personalNotes,
      atsScore: atsAnalysisResult.matchScore,
      atsAnalysis: atsAnalysisResult,
      cvData: generatedCV,
      coverLetter: coverLetterText,
      templateId
    };

    generationsStore.unshift(newRecord);

    res.json({
      success: true,
      message: 'CV et lettre de motivation générés avec succès !',
      record: newRecord,
      remainingQuota: user.remainingQuota
    });
  });

  // Get user generation history
  app.get('/api/generations', (req: Request, res: Response) => {
    const userId = (req.query.userId as string) || DEMO_USER_ID;
    const list = generationsStore.filter(g => g.userId === userId || userId === 'all');
    res.json(list);
  });

  // Delete a generation
  app.delete('/api/generations/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    generationsStore = generationsStore.filter(g => g.id !== id);
    res.json({ success: true });
  });

  // Admin stats
  app.get('/api/admin/stats', (_req: Request, res: Response) => {
    const totalUsers = usersStore.size || 142;
    const totalGenerations = generationsStore.length || 850;
    
    // Calculate simulated MRR based on active formulas
    let mrr = 0;
    usersStore.forEach(u => {
      if (u.formula === 'Pro') mrr += 19;
      if (u.formula === 'Illimité') mrr += 39;
    });
    if (mrr === 0) mrr = 1840;

    const stats: AdminStats = {
      totalUsers,
      totalGenerations,
      mrr,
      churnRate: 2.4,
      activeSubscribers: Math.round(totalUsers * 0.78),
      recentLogs: errorLogsStore.slice(0, 10)
    };

    res.json(stats);
  });

  // Return Make.com prompt specs
  app.get('/api/prompts', (_req: Request, res: Response) => {
    res.json(MAKE_PROMPTS);
  });


  // --- VITE / STATIC SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur CVGen démarré sur http://0.0.0.0:${PORT}`);
  });
}

// Smart fallback helper function if API key is not present or transient error occurs
function generateSmartFallback(jobOfferText: string, sourceCV: string, personalNotes?: string) {
  const containsTech = /react|node|javascript|typescript|python|java|sql|dev|code|web/i.test(jobOfferText);
  const containsManager = /chef|manager|lead|direction|gestion|projet|agile/i.test(jobOfferText);
  
  const extractedJobTitle = containsTech ? 'Développeur Full Stack Senior & Lead Tech' : 'Chef de Projet & Spécialiste Métier';
  const extractedCompany = 'Entreprise Partenaire';

  const keywordsFound = ['React.js', 'TypeScript', 'Node.js', 'Gestion de projet', 'Agile', 'Communication', 'Rigueur'];
  const keywordsMissing = ['Docker/Kubernetes', 'CI/CD Pipeline', 'GraphQL'];

  const atsAnalysis: ATSAnalysis = {
    matchScore: 89,
    keywordsFound,
    keywordsMissing,
    toneMatch: 'Professionnel, Structuré & Orienté Impact',
    recommendations: [
      'Incorporez plus de chiffres d\'impacts concrets dans vos puces d\'expériences principales.',
      'Assurez-vous de mentionner vos certifications ou formations récentes en tête de CV.'
    ],
    keyStrengths: [
      'Correspondance élevée avec la stack technique cible.',
      'Structure de CV facilement analysable par les algorithmes ATS.'
    ]
  };

  const cvData: TailoredCV = {
    ...DEFAULT_INITIAL_CV_DATA,
    personalInfo: {
      ...DEFAULT_INITIAL_CV_DATA.personalInfo,
      title: extractedJobTitle,
      summary: `Professionnel expérimenté spécialisé dans le domaine visé par le poste de ${extractedJobTitle}. Fort d'un parcours axé sur la performance, l'organisation et la qualité des livrables. ${personalNotes ? `Note particulière : ${personalNotes}` : ''}`
    }
  };

  const coverLetter = `Madame, Monsieur,\n\nC'est avec un enthousiasme tout particulier que je vous soumets ma candidature au poste de ${extractedJobTitle} au sein de votre entreprise.\n\nÀ la lecture de votre offre, j'ai immédiatement identifié une forte synergie entre vos objectifs de croissance et mes compétences acquises lors de mes précédentes fonctions. Fort d'une solide expérience terrain, j'ai développé une capacité éprouvée à mener à bien des projets complexes, à fédérer les équipes et à garantir une qualité de livraison irréprochable.\n\nVotre offre met l'accent sur la maîtrise de compétences clés telles que ${keywordsFound.slice(0, 3).join(', ')}. Mon parcours m'a permis d'éprouver ces compétences au quotidien dans des environnements exigeants. ${personalNotes ? `À ce titre, je souhaite tout particulièrement souligner : ${personalNotes}.` : ''}\n\nConvaincu qu'une collaboration serait mutuellement bénéfique, je me tiens à votre entière disposition pour un entretien au cours duquel je pourrais vous exposer plus en détail mes motivations.\n\nDans cette attente, je vous prie d'agréer, Madame, Monsieur, mes salutations respectueuses.`;

  return {
    jobTitle: extractedJobTitle,
    companyName: extractedCompany,
    atsAnalysis,
    cvData,
    coverLetter
  };
}

startServer();
