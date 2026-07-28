import { TailoredCV } from '../types';

export const DEFAULT_SOURCE_CV_TEXT = `
JEAN DUPONT
Développeur Full Stack & Chef de Projet Digital
Paris, France | jean.dupont@email.com | +33 6 12 34 56 78 | linkedin.com/in/jeandupont

PROFIL
Développeur Full Stack passionné avec 5 ans d'expérience dans la conception et le déploiement d'applications web réactives et évolutives. Spécialisé en React, Node.js, TypeScript et architectures cloud. Habitué au travail en méthode Agile/Scrum et orienté performance et expérience utilisateur.

EXPÉRIENCE PROFESSIONNELLE

Développeur Full Stack Senior — TechSolutions (Paris)
Janvier 2022 – Présent
- Conception et développement d'une plateforme SaaS B2B utilisée par plus de 50 000 utilisateurs actifs.
- Migration de l'architecture monolithique vers une architecture microservices (Node.js/Express, Docker).
- Optimisation des performances front-end React/TypeScript, réduisant le temps de chargement des pages de 40%.
- Encadrement d'une équipe de 4 développeurs juniors et animation des cérémonies Scrum.

Développeur Web Full Stack — WebAgency Studio (Lyon)
Septembre 2019 – Décembre 2021
- Développement de plus de 15 sites web et applications sur mesure en React, Vue.js et Node.js.
- Intégration d'API REST et GraphQL sécurisées avec authentification JWT et Stripe pour les paiements.
- Réduction du taux d'erreurs de production de 30% grâce à la mise en place de tests unitaires et E2E (Jest, Cypress).

COMPÉTENCES TECHNIQUES
- Langages : TypeScript, JavaScript, HTML5, CSS3, SQL, Python
- Front-end : React, Redux, Next.js, Tailwind CSS
- Back-end : Node.js, Express, REST API, GraphQL, PostgreSQL, MongoDB
- DevOps & Tools : Git, Docker, CI/CD (GitHub Actions), AWS (S3, EC2), Jest

ÉDUCATION
- Master en Informatique & Génie Logiciel — Université Paris-Saclay (2019)
- Licence en Informatique — Université Claude Bernard Lyon 1 (2017)

LANGUES
- Français : Langue maternelle
- Anglais : Courant (TOEIC 910/990)
`;

export const DEFAULT_INITIAL_CV_DATA: TailoredCV = {
  personalInfo: {
    fullName: "Jean Dupont",
    title: "Développeur Full Stack & Chef de Projet Digital",
    email: "jean.dupont@email.com",
    phone: "+33 6 12 34 56 78",
    location: "Paris, France",
    linkedin: "linkedin.com/in/jeandupont",
    summary: "Développeur Full Stack expérimenté (5 ans) spécialisé dans la création d'applications web hautement performantes avec React, Node.js et TypeScript. Expert en optimisation ATS et architecture Cloud."
  },
  skillCategories: [
    {
      category: "Développement Front-End",
      items: ["React.js", "TypeScript", "Tailwind CSS", "Next.js", "HTML5/CSS3"]
    },
    {
      category: "Développement Back-End & Base de données",
      items: ["Node.js", "Express", "PostgreSQL", "MongoDB", "REST & GraphQL APIs"]
    },
    {
      category: "DevOps & Méthodologies",
      items: ["Git / GitHub Actions", "Docker", "Agile / Scrum", "AWS", "Tests Jest & Cypress"]
    }
  ],
  experiences: [
    {
      id: "exp-1",
      title: "Développeur Full Stack Senior",
      company: "TechSolutions",
      location: "Paris, France",
      startDate: "Jan 2022",
      endDate: "Présent",
      current: true,
      highlights: [
        "Conception et développement d'une plateforme SaaS B2B comptant +50 000 utilisateurs actifs mensuels.",
        "Migration d'une architecture monolithique vers des microservices sous Node.js et Docker.",
        "Optimisation des performances front-end React/TypeScript, améliorant le temps de chargement de 40%.",
        "Encadrement technique de 4 développeurs juniors et animation des sprints Agile/Scrum."
      ]
    },
    {
      id: "exp-2",
      title: "Développeur Web Full Stack",
      company: "WebAgency Studio",
      location: "Lyon, France",
      startDate: "Sept 2019",
      endDate: "Déc 2021",
      current: false,
      highlights: [
        "Développement et livraison de 15+ applications web sur mesure en React et Node.js.",
        "Intégration d'API REST et de passerelles de paiement Stripe avec authentification sécurisée.",
        "Mise en place d'intégration continue CI/CD et tests automatisés réduisant les bugs de 30%."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "Master en Informatique & Génie Logiciel",
      school: "Université Paris-Saclay",
      year: "2019",
      details: "Mention Très Bien — Spécialisation architectures distribuées"
    },
    {
      id: "edu-2",
      degree: "Licence en Informatique",
      school: "Université Claude Bernard Lyon 1",
      year: "2017"
    }
  ],
  languages: [
    { name: "Français", level: "Langue maternelle" },
    { name: "Anglais", level: "Courant (C1 - TOEIC 910)" }
  ],
  certifications: [
    "AWS Certified Developer – Associate (2023)",
    "Scrum Master Certification (PSM I)"
  ]
};

export const MAKE_PROMPTS = [
  {
    id: "prompt-1",
    title: "Prompt 1 — Analyse d'offre d'emploi (ATS)",
    purpose: "Extraire les mots-clés ATS essentiels, compétences requises et le ton attendu par le recruteur.",
    systemPrompt: `Tu es un expert mondial en recrutement technique, systèmes ATS (Applicant Tracking Systems) et optimisation de candidatures.
Ton objectif est d'analyser minutieusement l'offre d'emploi fournie et d'en extraire les informations clés au format JSON.`,
    userPromptTemplate: `Analyse l'offre d'emploi suivante et extrait au format JSON exact :
1. "jobTitle" : Le titre du poste exact
2. "companyName" : Nom de l'entreprise (ou "Non spécifié")
3. "keySkills" : Liste des 8 à 12 compétences techniques et humaines clés
4. "atsKeywords" : Les 10 mots-clés exacts impératifs pour passer les filtres ATS
5. "tone" : Le ton de l'offre (ex: Formel, Dynamique startup, Corporate, Créatif)
6. "summary" : Synthèse de ce que recherche l'employeur en 2 phrases

Offre d'emploi :
{{OFFRE_TEXTE}}`,
    outputFormat: "JSON strict avec les clés : jobTitle, companyName, keySkills, atsKeywords, tone, summary."
  },
  {
    id: "prompt-2",
    title: "Prompt 2 — Reformulation du CV source",
    purpose: "Réécrire le CV source pour maximiser la présence des mots-clés ATS tout en restant 100% véridique.",
    systemPrompt: `Tu es un rédacteur professionnel de CV haute performance. Ton rôle est de réorganiser et reformuler le CV source du candidat pour qu'il réponde exactement aux exigences de l'offre d'emploi analysée, sans jamais inventer de fausses compétences ou de fausses expériences.`,
    userPromptTemplate: `En utilisant l'analyse d'offre ci-dessous et le CV source du candidat, génère un CV révisé optimisé ATS.
Incorpore naturellement les mots-clés ATS dans le profil, les puces d'expériences (orientées résultats avec chiffres) et la section compétences.

Analyse de l'offre :
{{OFFRE_ANALYSE_JSON}}

CV Source :
{{CV_SOURCE_TEXTE}}

Instructions spécifiques du candidat :
{{NOTES_PERSONNELLES}}

Renvoie le résultat sous forme d'objet JSON structuré (personalInfo, skillCategories, experiences, education, languages, certifications).`,
    outputFormat: "JSON structuré contenant l'ensemble du CV optimisé."
  },
  {
    id: "prompt-3",
    title: "Prompt 3 — Génération de lettre de motivation",
    purpose: "Rédiger une lettre de motivation personnalisée, percutante et professionnelle adaptée au ton de l'entreprise.",
    systemPrompt: `Tu es un coach en recrutement et expert en rédaction persuasive de lettres de motivation. Tu rédiges des lettres percutantes, personnalisées, évitant la langue de bois et les formules génériques.`,
    userPromptTemplate: `Rédige une lettre de motivation sur-mesure (300-400 mots) pour le poste de {{JOB_TITLE}} chez {{COMPANY_NAME}}.

Contextes :
- CV optimisé du candidat : {{CV_GENERE_SUMMARY}}
- Mots-clés de l'offre : {{ATS_KEYWORDS}}
- Ton attendu : {{TONE}}
- Notes spécifiques du candidat : {{NOTES_PERSONNELLES}}

Structure attendue :
1. Accroche directe faisant le lien entre les besoins de l'entreprise et la valeur ajoutée du candidat.
2. Corps de la lettre : 2 paragraphes détaillant des réalisations concrètes pertinentes pour ce poste.
3. Appel à l'action confiant pour planifier un entretien + formule de politesse soignée.`,
    outputFormat: "Texte propre et prêt à l'envoi."
  },
  {
    id: "prompt-4",
    title: "Prompt 4 — Score de correspondance ATS & Rapport",
    purpose: "Calculer un score de correspondance % exact et fournir une checklist des mots-clés trouvés/manquants.",
    systemPrompt: `Tu es un algorithme de scoring ATS (Applicant Tracking System). Tu évalues objectivement le niveau de correspondance entre un CV finalisé et une offre d'emploi.`,
    userPromptTemplate: `Calcule le score de correspondance (%) entre le CV généré et l'offre d'emploi.

Mots-clés cibles ATS :
{{ATS_KEYWORDS}}

CV Généré :
{{CV_FINAL_TEXTE}}

Retourne un JSON avec :
1. "matchScore" : Nombre de 0 à 100
2. "keywordsFound" : Tableau des mots-clés présents dans le CV
3. "keywordsMissing" : Tableau des mots-clés recommandés mais absents
4. "recommendations" : 3 conseils pragmatiques pour améliorer la candidature`,
    outputFormat: "JSON strict avec matchScore, keywordsFound, keywordsMissing, recommendations."
  }
];
