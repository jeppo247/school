export interface ComparisonRow {
  feature: string;
  upwise: string;
  competitor: string;
}

export interface ComparisonPage {
  slug: string;
  competitorName: string;
  competitorUrl: string;
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  summary: string;
  rows: ComparisonRow[];
  upwiseStrengths: string[];
  competitorStrengths: string[];
  verdict: string;
}

export const COMPARISONS: ComparisonPage[] = [
  {
    slug: "upwise-vs-cluey",
    competitorName: "Cluey Learning",
    competitorUrl: "https://clueylearning.com.au",
    metaTitle: "Upwise vs Cluey Learning — Which is better for Australian primary students?",
    metaDescription:
      "Compare Upwise and Cluey Learning for Australian primary school students. Pricing, approach, curriculum alignment, and what the research says about each model.",
    heroTitle: "Upwise vs Cluey Learning",
    heroSubtitle: "Two different approaches to helping Australian children learn. Here's how they compare.",
    summary:
      "Cluey Learning offers live online tutoring sessions with human tutors, while Upwise uses AI-powered mastery learning with parent guidance. Both are Australian-made and curriculum-aligned, but they serve different needs and budgets.",
    rows: [
      {
        feature: "Approach",
        upwise: "AI-powered mastery learning with adaptive practice and parent-as-guide model",
        competitor: "Live 1-on-1 online tutoring sessions with human tutors",
      },
      {
        feature: "Price",
        upwise: "From $39/month (unlimited sessions). 7-day free trial",
        competitor: "From ~$70/session. Free first session",
      },
      {
        feature: "Session format",
        upwise: "Self-paced 10-20 minute daily sessions, available anytime",
        competitor: "Scheduled 50-minute live sessions with a tutor",
      },
      {
        feature: "Curriculum alignment",
        upwise: "Aligned to Australian Curriculum (ACARA) and NAPLAN domains",
        competitor: "Aligned to Australian Curriculum with state-specific content",
      },
      {
        feature: "Subjects",
        upwise: "Maths, reading, writing, spelling, grammar (Prep-Year 7)",
        competitor: "Maths, English, chemistry, biology (Year 2-12)",
      },
      {
        feature: "Personalisation",
        upwise: "AI analyses every response in real time. 167 micro-skills with mapped prerequisites",
        competitor: "Human tutor adapts to student needs during live sessions",
      },
      {
        feature: "Parent involvement",
        upwise: "Daily briefings, real-time nudges, conversation scripts, progress dashboard",
        competitor: "Session reports and progress updates after each session",
      },
      {
        feature: "Availability",
        upwise: "24/7 — learn whenever your child is ready",
        competitor: "Scheduled sessions — requires booking in advance",
      },
      {
        feature: "Research basis",
        upwise: "Built on Bloom's mastery learning, backed by 2025 Harvard RCT and PNAS studies",
        competitor: "Based on traditional tutoring pedagogy with experienced tutors",
      },
    ],
    upwiseStrengths: [
      "Significantly more affordable ($39/mo vs ~$280/mo for weekly sessions)",
      "Available anytime — no scheduling needed",
      "AI adapts to every response in real time",
      "Parent is actively involved with daily briefings and scripts",
      "Research-backed guardrailed AI approach (PNAS 2025)",
    ],
    competitorStrengths: [
      "Live human interaction and relationship with tutor",
      "Covers senior secondary subjects (chemistry, biology)",
      "Established brand with 33,000+ students",
      "Human judgement for complex problem-solving",
      "Immediate verbal feedback and discussion",
    ],
    verdict:
      "Cluey is the stronger choice if your child needs a human tutor for senior subjects or benefits from live interaction. Upwise is the stronger choice for primary students who need daily, affordable, research-backed practice that targets specific skill gaps — especially if you want to be actively involved in guiding their learning.",
  },
  {
    slug: "upwise-vs-mathletics",
    competitorName: "Mathletics",
    competitorUrl: "https://www.mathletics.com",
    metaTitle: "Upwise vs Mathletics — Which is better for Australian primary students?",
    metaDescription:
      "Compare Upwise and Mathletics for Australian primary school maths. Pricing, learning approach, gamification vs mastery, and curriculum alignment.",
    heroTitle: "Upwise vs Mathletics",
    heroSubtitle: "Both target Australian primary students. The approaches are very different.",
    summary:
      "Mathletics is a well-established gamified maths platform used widely in Australian schools. Upwise takes a mastery-learning approach with AI personalisation and covers both maths and English. Here's how they differ.",
    rows: [
      {
        feature: "Approach",
        upwise: "AI-powered mastery learning — can't progress until concepts are genuinely understood",
        competitor: "Gamified practice with points, badges, and competitive elements",
      },
      {
        feature: "Price",
        upwise: "From $39/month (includes all subjects). 7-day free trial",
        competitor: "~$99/year for home use",
      },
      {
        feature: "Subjects",
        upwise: "Maths, reading, writing, spelling, grammar (all five NAPLAN domains)",
        competitor: "Maths only",
      },
      {
        feature: "Personalisation",
        upwise: "AI analyses every response. Targets specific micro-skill gaps. Adjusts difficulty in real time",
        competitor: "Content aligned to year level. Students choose activities within their level",
      },
      {
        feature: "Curriculum",
        upwise: "Aligned to ACARA with 167 mapped micro-skills across NAPLAN domains",
        competitor: "Aligned to Australian and international curricula",
      },
      {
        feature: "Gap detection",
        upwise: "Diagnostic assessment pinpoints exactly which prerequisite skills are missing",
        competitor: "Progress tracked by topic completion. Less granular gap identification",
      },
      {
        feature: "Parent tools",
        upwise: "Daily briefings, nudges, conversation scripts, projected NAPLAN bands",
        competitor: "Progress reports and activity summaries",
      },
      {
        feature: "Motivation model",
        upwise: "Mastery-based confidence building. Progress measured by genuine understanding",
        competitor: "Gamification — points, avatars, global competitions (Live Mathletics)",
      },
      {
        feature: "School adoption",
        upwise: "Parent-first model. School integration planned for future",
        competitor: "Widely adopted in Australian schools. Teacher dashboard included",
      },
    ],
    upwiseStrengths: [
      "Covers all five NAPLAN domains, not just maths",
      "True mastery progression — students can't skip over gaps",
      "AI personalises to micro-skill level (167 skills mapped)",
      "Parent guidance layer with daily briefings and conversation scripts",
      "Built on peer-reviewed research (Nature, PNAS, Harvard)",
    ],
    competitorStrengths: [
      "More affordable for maths-only ($99/year vs $468/year)",
      "Established in Australian schools with teacher integration",
      "Gamification keeps some children engaged longer",
      "Live Mathletics adds competitive/social element",
      "Proven track record over many years",
    ],
    verdict:
      "Mathletics is the stronger choice if your child only needs maths practice, enjoys gamified competition, and you want something their school already uses. Upwise is the stronger choice if your child has gaps across multiple subjects, you want mastery-based progression that ensures real understanding, and you want to be actively guided as a parent.",
  },
  {
    slug: "upwise-vs-ixl",
    competitorName: "IXL",
    competitorUrl: "https://au.ixl.com",
    metaTitle: "Upwise vs IXL — Which is better for Australian primary students?",
    metaDescription:
      "Compare Upwise and IXL for Australian primary school students. Pricing, approach to learning, curriculum alignment, and which is better for closing skill gaps.",
    heroTitle: "Upwise vs IXL",
    heroSubtitle: "Both platforms offer adaptive practice. The philosophy behind each is different.",
    summary:
      "IXL is a large global learning platform with extensive skill coverage. Upwise is built specifically for Australian students with a mastery-learning approach and parent guidance. Here's how they compare.",
    rows: [
      {
        feature: "Approach",
        upwise: "Mastery learning — must demonstrate proficiency before advancing. AI-guided progression",
        competitor: "Comprehensive practice — wide coverage across many skills. SmartScore tracking",
      },
      {
        feature: "Price",
        upwise: "From $39/month (all subjects, 1 child). 7-day free trial",
        competitor: "~$20/month per subject, or ~$30/month for all subjects (1 child)",
      },
      {
        feature: "Subjects",
        upwise: "Maths, reading, writing, spelling, grammar (Prep-Year 7)",
        competitor: "Maths, English, science, social studies (Prep-Year 12)",
      },
      {
        feature: "Personalisation",
        upwise: "AI detects micro-skill gaps and creates a personalised learning path with prerequisites",
        competitor: "Adaptive difficulty within each skill. Recommendations based on performance",
      },
      {
        feature: "Curriculum",
        upwise: "Built specifically for ACARA and NAPLAN. Australian English, Australian contexts",
        competitor: "Mapped to Australian Curriculum but built for global market",
      },
      {
        feature: "Gap detection",
        upwise: "Diagnostic assessment maps 167 micro-skills with prerequisite chains",
        competitor: "SmartScore per skill. Diagnostic available but less granular on prerequisites",
      },
      {
        feature: "Parent tools",
        upwise: "Daily briefings, real-time nudges, conversation scripts, teacher-shareable reports",
        competitor: "Progress reports, awards, usage statistics",
      },
      {
        feature: "Content depth",
        upwise: "Deep coverage of foundational skills across NAPLAN domains. Quality over breadth",
        competitor: "Extremely broad coverage — thousands of skills across many subjects and years",
      },
      {
        feature: "Research basis",
        upwise: "Built on Bloom's 2 Sigma, supported by 2025 Harvard and PNAS studies on AI tutoring",
        competitor: "Internal research and efficacy studies. Established practice platform",
      },
    ],
    upwiseStrengths: [
      "Purpose-built for Australian students (ACARA, NAPLAN, Australian English)",
      "Mastery progression ensures genuine understanding before advancing",
      "Parent guidance layer — daily briefings, nudges, conversation scripts",
      "Research-backed guardrailed AI (not just adaptive difficulty)",
      "Prerequisite mapping catches root-cause gaps, not just surface errors",
    ],
    competitorStrengths: [
      "More affordable per subject (~$20/mo vs $39/mo)",
      "Broader subject coverage (science, social studies, senior years)",
      "Enormous content library with thousands of skills",
      "Established globally with 18M+ users",
      "Available through Year 12",
    ],
    verdict:
      "IXL is the stronger choice if you want broad coverage across many subjects and year levels, or your child is in secondary school. Upwise is the stronger choice if you want deep mastery-based learning specifically designed for Australian primary students, with parent guidance and research-backed AI that targets root-cause skill gaps.",
  },
];

export function getComparison(slug: string): ComparisonPage | undefined {
  return COMPARISONS.find((c) => c.slug === slug);
}

export function getAllComparisonSlugs(): string[] {
  return COMPARISONS.map((c) => c.slug);
}
