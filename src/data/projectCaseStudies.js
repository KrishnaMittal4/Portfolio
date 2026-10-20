// Deep-Dive Architectural Case Studies for Krishna Mittal's Flagship AI Projects

export const PROJECT_CASE_STUDIES = {
  "smart-courtroom-rag": {
    id: "smart-courtroom-rag",
    title: "AI-Powered Smart Courtroom",
    subtitle: "Legal RAG · Hybrid Retrieval · Citation Verification · Multi-Agent AI",
    badge: "FAISS + BM25 • RRF • Refusal Gate • Multi-Agent Court",
    badgeColor: "#38bdf8",
    github: "https://github.com/KrishnaMittal4/AI-POWERED-SMARTCOURTROOM",
    live: "https://ai-powered-smartcourtroom.vercel.app/",
    stats: "P@3: 0.98 vs 0.263 • Refusal Gating • Zero Ungrounded Claims",
    overview: {
      problem: "Standard LLMs frequently hallucinate legal citations, fabricate non-existent docket numbers, and misinterpret statutory precedents—posing severe professional liability in legal research where propositions must be strictly grounded.",
      solution: "An AI-assisted legal research and courtroom simulation platform for Indian judgments, designed around grounded retrieval, citation verification, legal-document intelligence, and multi-agent courtroom workflows."
    },
    architectureFlow: [
      "LEGAL JUDGMENTS",
      "PDF EXTRACTION + CLEANING",
      "CHUNKING + LEGAL METADATA",
      "HYBRID RETRIEVAL (FAISS Dense Semantic + BM25 Sparse Lexical)",
      "RRF FUSION",
      "CROSS-ENCODER RERANK",
      "RETRIEVAL GATE",
      "GROQ LLM",
      "CITATION VERIFICATION",
      "LEGAL INTELLIGENCE LAYER",
      "GROUNDED ANSWER"
    ],
    hallucinationControl: {
      stages: ["Retrieve", "Gate", "Generate", "Verify", "Display"],
      refusalLogic: "If retrieval confidence falls below calibrated similarity threshold, the system strictly refuses to generate an ungrounded answer.",
      citationCheck: "Deterministic audit cross-referencing cited case names, docket numbers, and statutory sections against actual physical corpus records.",
      passageAudit: "Verifies whether retrieved judgment passages actively substantiate each generated legal assertion."
    },
    mootCourt: {
      title: "Adversarial Multi-Agent Courtroom Simulation",
      flow: [
        { role: "Petitioner Agent", engine: "Groq LPU", desc: "Formulates statutory propositions using dual-retrieved judgment evidence" },
        { role: "Respondent Agent", engine: "Groq LPU", desc: "Submits rebuttal arguments and distinguishes opposing precedents" },
        { role: "Presiding Bench", engine: "Gemini", desc: "Synthesizes competing ratios and issues a reasoned judicial decree" }
      ]
    },
    beyondAIPipeline: [
      { name: "FastAPI", desc: "Asynchronous backend powering high-throughput API endpoints" },
      { name: "React + Vite", desc: "High-performance responsive single page application interface" },
      { name: "Streaming / SSE", desc: "Server-Sent Events streaming token generation in real time (<200ms)" },
      { name: "Authentication", desc: "Secure token-based user authentication and session management" },
      { name: "Private Workspaces", desc: "Custom document upload pipelines and isolated case research vaults" },
      { name: "API Security", desc: "CORS configuration, rate limiting, and input sanitization guards" },
      { name: "Vercel & Render", desc: "Distributed production deployment across edge and container services" }
    ],
    pipeline: [
      {
        step: "01",
        name: "Legal Judgment Extraction & Cleaning",
        tech: "PyMuPDF, pdfplumber, Image OCR",
        summary: "Ingests court PDFs and scans. Normalizes noisy OCR artifacts, strips repetitive headers/footers, and tags legal metadata (Court, Bench, Case No, Citation, Parties)."
      },
      {
        step: "02",
        name: "Chunking + Legal Metadata Binding",
        tech: "Overlapping Windows (180w/40w)",
        summary: "Splits judgments into 180-word windows with 40-word semantic overlaps. Every individual chunk has its statutory case citation and paragraph metadata prepended to preserve judicial context."
      },
      {
        step: "03",
        name: "Hybrid Retrieval: FAISS Dense + BM25 Sparse",
        tech: "all-MiniLM-L6-v2 + BM25Okapi",
        summary: "Dense FAISS embeddings capture semantic similarity when user phrasing diverges from judgment language; sparse BM25 preserves lexical precision for exact sections and case citations."
      },
      {
        step: "04",
        name: "Reciprocal Rank Fusion (RRF)",
        tech: "Reciprocal Rank Fusion (k=60)",
        summary: "Fuses ranked candidates from dense semantic and sparse lexical retrieval stages, eliminating score calibration friction between vector distances and BM25 scores."
      },
      {
        step: "05",
        name: "Cross-Encoder Re-Ranking",
        tech: "HuggingFace Cross-Encoder",
        summary: "Re-ranks top 15 fused candidates using joint cross-attention. Caps context at a maximum of 2 chunks per unique judgment to eliminate single-case dominance."
      },
      {
        step: "06",
        name: "Retrieval Confidence Gate (Refusal)",
        tech: "Calibrated Cosine Threshold",
        summary: "If top retrieval confidence falls below threshold, the system halts generation and strictly refuses to fabricate an ungrounded legal opinion."
      },
      {
        step: "07",
        name: "Groq LLM Grounded Generation",
        tech: "Groq LPU Inference (>200 tok/sec)",
        summary: "Synthesizes legal research answers with strict system constraints enforcing verbatim quotations and exact attribution to retrieved passages."
      },
      {
        step: "08",
        name: "Citation Verification & Legal Intelligence",
        tech: "Corpus Audit Engine + Moot Court",
        summary: "Deterministic post-generation audit confirming every cited case exists in corpus. Powers precedent intelligence, similar-case search, and multi-agent moot court simulation."
      }
    ],
    innovations: [
      {
        title: "Multi-Agent Moot Court Simulation",
        description: "Adversarial simulation featuring Petitioner Agent (Groq) arguing statutory propositions, Respondent Agent (Groq) countering with precedent distinctions, and Presiding Bench (Gemini) issuing a reasoned judicial decree."
      },
      {
        title: "Strict Retrieval Refusal & Citation Verification",
        description: "Refusal logic halts ungrounded generation when similarity scores fall below threshold. Generated citations are verified against indexed judgment records, flagging discrepancies."
      },
      {
        title: "Private Case Workspaces & Precedent Intelligence",
        description: "Enables legal researchers to upload private case bundles, run similar-case discovery, and isolate confidential legal inquiries inside authenticated workspaces."
      },
      {
        title: "Zero-RAM Cloud Embeddings Architecture",
        description: "Configured dual embedding runtime: local MiniLM for offline development, and cloud embeddings for memory-constrained cloud containers, eliminating heavy PyTorch server overhead."
      }
    ],
    challenges: [
      {
        challenge: "Why MiniLM over InLegalBERT? (Empirical Model Selection)",
        decision: "Selecting an embedding model based purely on its domain name sounded unreliable without empirical validation.",
        solution: "Conducted an early 8-query A/B evaluation comparing all-MiniLM-L6-v2 against InLegalBERT. MiniLM achieved a reported P@3 of 0.98 vs 0.263 for InLegalBERT on the project evaluation set, proving that generic fine-tuned sentence transformers can outperform domain-named models on dense retrieval."
      },
      {
        challenge: "Why Hybrid Retrieval (FAISS + BM25 + RRF + Cross-Encoder)?",
        decision: "Dense retrieval captures semantic intent when users describe scenarios colloquially, but legal research depends heavily on exact statutory sections (e.g. 'Section 138 NI Act') and case names that vector search can miss.",
        solution: "Parallel dense FAISS + sparse BM25 retrieval merged via Reciprocal Rank Fusion (RRF), followed by cross-encoder re-ranking of top 15 candidates. Preserves conceptual recall while guaranteeing exact legal keyword matching."
      },
      {
        challenge: "Grounding & Hallucination Control",
        decision: "Standard LLM prompt instructions ('do not make up citations') consistently fail on long-context legal queries.",
        solution: "Built a 5-stage pipeline: Retrieve → Gate → Generate → Verify → Display. If retrieval confidence is below threshold, system refuses to generate. Output citations are audited against physical corpus dockets."
      },
      {
        challenge: "Product Engineering Beyond AI Scripts",
        decision: "A real-world legal research tool requires robust software engineering, not just Jupyter notebook pipelines.",
        solution: "Engineered asynchronous FastAPI backend, React/Vite interface, Server-Sent Events (SSE) token streaming, user authentication, rate limiting, and private case workspace uploads."
      }
    ],
    limitations: "Current evaluation was conducted on a curated evaluation set of Indian judgments. Scaling to nationwide case law will require distributed vector indexing (e.g., Milvus/Qdrant) and handling noisy OCR from degraded historical gazettes.",
    metrics: [
      { label: "A/B Retrieval P@3", value: "0.98 vs 0.263", detail: "all-MiniLM-L6-v2 outperformed InLegalBERT on project evaluation benchmark" },
      { label: "Hallucination Gate", value: "Strict Refusal", detail: "Mathematical confidence gating blocking ungrounded generations" },
      { label: "Inference Latency", value: "<200ms", detail: "Powered by Groq Cloud ultra-fast LPU inference" },
      { label: "Full-Stack Deployment", value: "Vercel + Render", detail: "React SPA + FastAPI container with private case workspaces" }
    ]
  },

  "ai-interview-platform": {
    id: "ai-interview-platform",
    title: "AI Interview Evaluation & Feedback System",
    subtitle: "Adaptive Technical & Behavioral Interview Simulation with Resume-Aware Probing",
    badge: "FastAPI • PyTorch • Real-Time Streaming",
    badgeColor: "#00f5d4",
    github: "https://github.com/KrishnaMittal4/AI-INTERVIEW-EVALUATION-AND-FEEDBACK-SYSTEM-",
    live: "https://ai-interview-evaluation-and-feedbac.vercel.app/",
    stats: "Adaptive Follow-Ups • SSE Token Streaming • Multi-Rubric",
    overview: {
      problem: "Traditional mock interview tools rely on rigid question banks with generic rubrics that ignore candidate resumes and fail to probe technical depth dynamically.",
      solution: "Engineered an intelligent interview simulator that parses candidate CVs, generates role-tailored technical and system-design questions, adapts follow-up difficulty based on candidate depth, and streams instant multi-rubric evaluation with speech delivery analytics."
    },
    pipeline: [
      {
        step: "01",
        name: "Resume & Persona Parsing",
        tech: "Python, PyPDF2, Semantic NER",
        summary: "Ingests candidate resume (PDF/Text) to extract claimed technical skills, project architectures, and seniority levels for calibrated question generation."
      },
      {
        step: "02",
        name: "Resume-Aware Question Synthesis",
        tech: "LLM Prompt Pipeline, FastAPI",
        summary: "Dynamically synthesizes role-specific technical problem scenarios and system design questions targeting exact tools and methodologies claimed on the resume."
      },
      {
        step: "03",
        name: "Adaptive Follow-Up Logic",
        tech: "Dynamic Depth Evaluator",
        summary: "Analyzes initial candidate answers for technical depth, missing edge cases, or vague hand-waving. Dynamically spins up targeted follow-up questions to test limits."
      },
      {
        step: "04",
        name: "Speech Delivery Ingestion",
        tech: "Web Audio API, Speech Recognition",
        summary: "Captures candidate audio responses, computes speech cadence, pauses, filler word counts ('um', 'uh', 'like'), and transcribes speech to text in real time."
      },
      {
        step: "05",
        name: "Server-Sent Events (SSE) Streaming",
        tech: "FastAPI Async, StreamingResponse",
        summary: "Streams evaluation feedback, rubric grades, and recommended architectural alternatives token-by-token with zero waiting delay."
      },
      {
        step: "06",
        name: "Multi-Dimensional Rubric Scoring",
        tech: "Scikit-Learn, Custom Evaluator",
        summary: "Generates calibrated scores across 5 core dimensions: Technical Correctness, Architectural Depth, Communication Clarity, Edge-Case Handling, and Delivery Confidence."
      }
    ],
    innovations: [
      {
        title: "Resume-Aware Prompt Ingestion",
        description: "Instead of generic question banks, questions are synthesized on the fly matching the candidate's exact experience level, tech stack, and project claims."
      },
      {
        title: "Speaker-Adaptive Baseline Calibration",
        description: "Calibrates delivery metrics based on individual candidate speech baselines rather than penalizing non-native speakers or diverse speech cadences."
      },
      {
        title: "Real-Time Streaming Evaluation Engine",
        description: "FastAPI asynchronous streaming pipelines deliver real-time token feedback, eliminating turnaround bottlenecks of traditional batch evaluation systems."
      }
    ],
    challenges: [
      {
        challenge: "Generating Realistic Edge-Case Follow-Ups",
        decision: "Candidates often memorize high-level summaries for standard questions like 'explain CAP theorem'.",
        solution: "Engineered an adaptive follow-up generator that parses the candidate's explanation and probes trade-offs dynamically."
      },
      {
        challenge: "Zero-Latency UI Responsiveness",
        decision: "Waiting for a complete evaluation report after long answers caused UX disconnect.",
        solution: "Structured evaluation into parallel streams: immediate streaming qualitative review via SSE while numerical rubric calculations execute concurrently."
      }
    ],
    metrics: [
      { label: "Evaluation Dimensions", value: "5 Rubrics", detail: "Technical, System Design, Communication, Edge Cases, Delivery" },
      { label: "Streaming Latency", value: "<150ms", detail: "First-token response time over Server-Sent Events" },
      { label: "Question Adaptation", value: "100% Dynamic", detail: "Synthesized directly from candidate resume and response depth" },
      { label: "Frontend", value: "React + Vite", detail: "Responsive SPA deployed on Vercel" }
    ]
  },

  "ibm-fintech-analytics": {
    id: "ibm-fintech-analytics",
    title: "SentiStock AI — AI-Powered Stock Market Analytics",
    subtitle: "Financial Sentiment NLP & 18-Feature Machine Learning Market-Direction Predictor",
    badge: "FinBERT • XGBoost • FastAPI • IBM Internship",
    badgeColor: "#c084fc",
    github: "https://github.com/KrishnaMittal4",
    live: null,
    stats: "18-Feature ML Pipeline • FinBERT NLP • Explainable APIs",
    overview: {
      problem: "Traditional market indicators rely solely on historical price momentum, while raw news sentiment from general-purpose NLP models misinterprets financial dialect.",
      solution: "Engineered an AI equity analytics platform combining fine-tuned FinBERT financial sentiment embeddings with technical momentum indicators into an 18-feature machine learning ensemble (XGBoost, LightGBM, Random Forest) providing explainable market-direction analysis."
    },
    pipeline: [
      {
        step: "01",
        name: "Market & Sentiment Data Ingestion",
        tech: "Finnhub, yfinance, Financial Feeds",
        summary: "Streams OHLCV price histories for equities alongside live financial news feeds and market commentary."
      },
      {
        step: "02",
        name: "FinBERT Financial Sentiment NLP",
        tech: "Hugging Face FinBERT, PyTorch",
        summary: "Processes financial news articles and earnings transcript passages with specialized FinBERT transformer to calculate positive, neutral, and negative market sentiment polarities."
      },
      {
        step: "03",
        name: "18-Feature Engineering Pipeline",
        tech: "NumPy, Pandas, Technical Indicators",
        summary: "Calculates technical momentum signals (RSI, MACD, Bollinger Bands, Moving Averages, Volatility, VWAP) fused with time-decayed FinBERT sentiment vectors."
      },
      {
        step: "04",
        name: "Ensemble Classifier Comparison",
        tech: "XGBoost, LightGBM, Random Forest",
        summary: "Trains and cross-validates gradient-boosted decision trees to predict directional movement with feature importance ranking."
      },
      {
        step: "05",
        name: "Explainable Inference API",
        tech: "FastAPI REST Endpoints",
        summary: "Serves real-time REST inference endpoints returning calibrated trade confidence scores accompanied by contributing technical and sentiment drivers."
      }
    ],
    innovations: [
      {
        title: "Domain-Specific FinBERT Sentiment",
        description: "Standard BERT models classify terms like 'liability', 'cost cutting', or 'debt reduction' erroneously. FinBERT is trained explicitly on financial corpora for authentic financial semantics."
      },
      {
        title: "18-Feature Hybrid Alpha Pipeline",
        description: "Blends price-action momentum features with qualitative sentiment alpha vectors, preventing false breakouts during major market news cycles."
      },
      {
        title: "FastAPI Analytics Integration",
        description: "Exposes complete analytics, sentiment breakdowns, and model predictions through high-throughput RESTful endpoints."
      }
    ],
    challenges: [
      {
        challenge: "High Noise in Financial News Feeds",
        decision: "Financial media contains repetitive syndicated articles and clickbait headlines.",
        solution: "Implemented entity extraction and credibility weighting, filtering duplicates and aggregating institutional news feeds with higher priority weights."
      },
      {
        challenge: "Ensemble Comparison & Overfitting Control",
        decision: "Financial time series data is prone to lookahead bias and overfitting.",
        solution: "Enforced strict temporal cross-validation splits and compared XGBoost, LightGBM, and Random Forest models across engineered features."
      }
    ],
    metrics: [
      { label: "Engineered Features", value: "18 Features", detail: "Technical momentum, volume indicators & FinBERT sentiment" },
      { label: "Model Architecture", value: "Ensemble", detail: "XGBoost, LightGBM & Random Forest" },
      { label: "Deliverable", value: "IBM Internship", detail: "8-week enterprise deliverable completed at IBM" },
      { label: "API Framework", value: "FastAPI", detail: "High-throughput asynchronous RESTful inference pipeline" }
    ]
  }
};

