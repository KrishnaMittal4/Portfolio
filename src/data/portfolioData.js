// Portfolio Data customized for Krishna Mittal
// B.Tech CSE (AI & ML) - UPES Dehradun | Software & AI/ML Engineer

export const DEFAULT_PORTFOLIO_DATA = {
  profile: {
    name: "Krishna Mittal",
    handle: "krishna-mittal",
    title: "Software & AI/ML Engineer",
    roles: [
      "Software & AI/ML Engineer",
      "AI/ML & Full-Stack Developer",
      "RAG & LLM Systems Engineer",
      "Backend & Intelligent Systems Developer"
    ],
    tagline: "Architecting intelligent RAG pipelines, LLM systems, and high-performance full-stack AI applications.",
    bio: "B.Tech Computer Science & Engineering student specializing in Artificial Intelligence & Machine Learning at UPES, Dehradun. Building end-to-end AI and full-stack systems with a focus on RAG, LLM applications, NLP, and backend engineering.",
    location: "Dehradun, Uttarakhand, India",
    status: "Available for Software Engineering & AI/ML Roles • 2026/2027",
    professionalFocus: "Software Engineering • AI/ML & RAG Systems • Full-Stack Development",
    phone: "+91 9528452674"
  },
  
  about: {
    heading: "Software & AI/ML Engineer",
    summary: "I'm Krishna Mittal, a B.Tech Computer Science & Engineering student specializing in Artificial Intelligence & Machine Learning at UPES, Dehradun.\n\nI build end-to-end AI and full-stack systems, with a focus on Retrieval-Augmented Generation (RAG), LLM applications, NLP, machine learning, and backend engineering. My work ranges from hybrid legal-retrieval systems and multi-agent AI workflows to financial sentiment analysis and intelligent interview-evaluation platforms.\n\nI enjoy working beyond model integration—designing retrieval pipelines, APIs, evaluation systems, verification layers, and user-facing applications that turn AI concepts into practical products.\n\nI'm currently exploring Software Engineering and AI/ML opportunities where I can work on real-world intelligent systems.",
    currently: {
      building: "AI-Powered Smart Courtroom",
      buildingDesc: "Grounded legal RAG for Indian judgments with hybrid FAISS+BM25 retrieval, RRF fusion, cross-encoder reranking, and multi-agent moot court simulation.",
      buildingLink: "https://github.com/KrishnaMittal4/AI-POWERED-SMARTCOURTROOM",
      exploring: ["RAG", "Agentic AI", "LLM Evaluation", "AI Backend Systems"],
      interestedIn: ["Software Engineering", "AI/ML Engineering", "GenAI Engineering"],
      graduating: "May 2027"
    },
    corePillars: [
      {
        title: "Retrieval-Augmented Generation (RAG)",
        description: "Designing grounded retrieval pipelines with FAISS dense vector search, BM25 lexical retrieval, RRF fusion, cross-encoder reranking, and deterministic citation verification.",
        icon: "Cpu"
      },
      {
        title: "Multi-Agent Workflows & NLP",
        description: "Developing autonomous agent simulations (adversarial courtroom debate), domain-specific NLP (FinBERT sentiment), and evaluation systems with quantitative metrics.",
        icon: "Zap"
      },
      {
        title: "Production Backend & Full-Stack Systems",
        description: "Building production-grade web platforms and real-time streaming APIs using FastAPI, React, Server-Sent Events, authentication, and SQL/NoSQL storage.",
        icon: "Layers"
      }
    ]
  },

  projects: [
    {
      id: "smart-courtroom-rag",
      title: "AI-Powered Smart Courtroom",
      subtitle: "Legal RAG · Hybrid Retrieval · Citation Verification · Multi-Agent AI",
      category: "Legal RAG & Multi-Agent AI",
      description: "An AI-assisted legal research and courtroom simulation platform for Indian judgments, designed around grounded retrieval, citation verification, legal-document intelligence, and multi-agent courtroom workflows.",
      tech: ["Python", "FastAPI", "FAISS", "BM25", "Cross-Encoder", "Groq LLM", "React"],
      featured: true,
      stats: "P@3: 0.98 vs 0.263 • Refusal Gate",
      github: "https://github.com/KrishnaMittal4/AI-POWERED-SMARTCOURTROOM",
      live: "https://ai-powered-smartcourtroom.vercel.app/",
      badgeColor: "#38bdf8"
    },
    {
      id: "ai-interview-platform",
      title: "AI Interview Evaluation & Feedback System",
      subtitle: "Adaptive Technical & Behavioral Interview Simulation with Resume-Aware Probing",
      category: "GenAI & Full Stack",
      description: "A full-stack AI interview simulator (FastAPI + React) generating dynamic, resume-aware interview questions with adaptive follow-ups, real-time evaluation streaming, and speech cadence delivery analytics.",
      tech: ["Python", "FastAPI", "React", "PyTorch", "Scikit-Learn", "LLMs"],
      featured: true,
      stats: "Real-Time Streaming • Adaptive Probing",
      github: "https://github.com/KrishnaMittal4/AI-INTERVIEW-EVALUATION-AND-FEEDBACK-SYSTEM-",
      live: "https://ai-interview-evaluation-and-feedbac.vercel.app/",
      badgeColor: "#00f5d4"
    },
    {
      id: "ibm-fintech-analytics",
      title: "SentiStock AI — Stock Market Analytics",
      subtitle: "AI-Powered Financial Sentiment & 18-Feature Directional Prediction",
      category: "Fintech & Machine Learning",
      description: "Developed during IBM internship: An AI-powered financial analytics platform combining FinBERT domain-specific sentiment, technical indicators (TA-Lib), and an 18-feature machine learning ensemble with FastAPI REST backend and PostgreSQL caching.",
      tech: ["FastAPI", "Python", "FinBERT", "PyTorch", "TA-Lib", "XGBoost", "PostgreSQL", "yfinance"],
      featured: true,
      stats: "18-Feature ML • FinBERT NLP • Explainable APIs",
      github: "https://github.com/KrishnaMittal4/SentiStock-Sentiment-Analysis",
      live: "https://sentistock-sentiment-analysis-front.vercel.app/",
      badgeColor: "#c084fc"
    }
  ],

  skills: [
    {
      category: "AI / GenAI",
      items: ["Python", "PyTorch", "TensorFlow", "Scikit-learn", "NLP", "RAG", "LLMs", "Sentence Transformers", "FAISS", "BM25"]
    },
    {
      category: "Backend",
      items: ["FastAPI", "REST APIs", "SQL", "MongoDB"]
    },
    {
      category: "Frontend",
      items: ["React", "JavaScript", "HTML", "CSS"]
    },
    {
      category: "Core CS",
      items: ["DSA", "OOP", "DBMS", "OS", "Computer Networks"]
    },
    {
      category: "Tools / Deployment",
      items: ["Git", "GitHub", "Postman", "Vercel", "Render"]
    }
  ],

  experience: [
    {
      role: "AI & Machine Learning Intern",
      company: "IBM",
      period: "June 2026 – July 2026",
      projectTitle: "SentiStock AI — AI-Powered Stock Market Analytics",
      technologies: ["Python", "FinBERT", "XGBoost", "LightGBM", "Random Forest", "FastAPI", "yfinance", "Finnhub"],
      highlights: [
        "Developed a financial analytics system combining financial-news sentiment, technical indicators, and machine-learning models for market-direction analysis.",
        "Applied FinBERT for domain-specific financial sentiment analysis and integrated multiple market/news data sources.",
        "Built and compared ensemble ML approaches including XGBoost, LightGBM, and Random Forest using engineered market features.",
        "Developed backend functionality with FastAPI to expose analytics and model outputs through APIs."
      ]
    },
    {
      role: "Software Development Intern — Geomagnetism Division",
      company: "Survey of India",
      period: "July 2025 · 4 weeks",
      projectTitle: "Geomagnetic Report Generation System",
      technologies: ["Python", "GUI Development", "Data Processing", "Automation"],
      highlights: [
        "Developed Python-based tools to automate geomagnetic data-processing and analysis workflows.",
        "Built a GUI-driven workflow to reduce repetitive manual steps involved in preparing geomagnetic reports.",
        "Worked with real scientific datasets and translated domain-specific processing requirements into software functionality."
      ]
    }
  ],

  socials: {
    github: "https://github.com/KrishnaMittal4",
    linkedin: "https://www.linkedin.com/in/krishna-mittal-/",
    email: "mittalkrishna177@gmail.com",
    phone: "+91 9528452674",
    location: "Dehradun, India",
    resume: "/KrishnaMittal_Resume.pdf"
  },

  education: {
    university: "UPES, Dehradun",
    degree: "B.Tech in Computer Science & Engineering",
    specialization: "Artificial Intelligence & Machine Learning",
    period: "Aug 2023 – May 2027",
    location: "Dehradun, Uttarakhand, India"
  }
};

const STORAGE_KEY = "studio_portfolio_config_krishna_v16";

export function loadPortfolioData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      parsed.socials = { ...DEFAULT_PORTFOLIO_DATA.socials, ...(parsed.socials || {}) };
      parsed.education = DEFAULT_PORTFOLIO_DATA.education;
      parsed.skills = DEFAULT_PORTFOLIO_DATA.skills;
      parsed.experience = DEFAULT_PORTFOLIO_DATA.experience;
      parsed.projects = DEFAULT_PORTFOLIO_DATA.projects;
      return { ...DEFAULT_PORTFOLIO_DATA, ...parsed };
    }
  } catch (e) {
    console.warn("Could not load from localStorage:", e);
  }
  return DEFAULT_PORTFOLIO_DATA;
}

export function savePortfolioData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Could not save to localStorage:", e);
  }
}

export function resetPortfolioData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Could not reset localStorage:", e);
  }
  return DEFAULT_PORTFOLIO_DATA;
}
