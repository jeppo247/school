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
        upwise: "Maths, reading, spelling & grammar (Prep-Year 7)",
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
        upwise: "Maths, reading, spelling & grammar (four NAPLAN domains)",
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
    slug: "upwise-vs-kumon",
    competitorName: "Kumon",
    competitorUrl: "https://www.kumon.com.au",
    metaTitle: "Upwise vs Kumon — Which is better for Australian primary students?",
    metaDescription:
      "Compare Upwise and Kumon for Australian primary school students. Pricing, mastery approach, daily practice models, and which builds stronger foundations.",
    heroTitle: "Upwise vs Kumon",
    heroSubtitle: "Both believe in mastery and daily practice. The methods are very different.",
    summary:
      "Kumon is a well-established centre-based tutoring franchise built on daily worksheets and self-learning. Upwise uses AI-powered adaptive mastery learning with parent guidance. Both aim to build strong foundations, but they take very different paths to get there.",
    rows: [
      {
        feature: "Approach",
        upwise: "AI-powered mastery learning that adapts in real time to your child's understanding",
        competitor: "Self-learning through daily paper worksheets with instructor support at centres",
      },
      {
        feature: "Price",
        upwise: "From $39/month (unlimited sessions, all subjects). 7-day free trial",
        competitor: "~$160/month per subject + $100 enrolment fee",
      },
      {
        feature: "Subjects",
        upwise: "Maths, reading, spelling & grammar (four NAPLAN domains)",
        competitor: "Maths and English as separate programmes (separate fees)",
      },
      {
        feature: "Daily practice",
        upwise: "10-20 minute adaptive sessions, available anytime at home",
        competitor: "Daily paper worksheets at home + weekly centre visits",
      },
      {
        feature: "Personalisation",
        upwise: "AI analyses every response. Targets specific micro-skill gaps. Adjusts difficulty in real time",
        competitor: "Instructor sets starting level. Students progress through a fixed sequence of worksheets",
      },
      {
        feature: "Curriculum alignment",
        upwise: "Built specifically for ACARA and NAPLAN domains",
        competitor: "Kumon's own curriculum. Not explicitly aligned to Australian Curriculum or NAPLAN",
      },
      {
        feature: "Parent involvement",
        upwise: "Daily briefings, real-time nudges, conversation scripts, progress dashboard",
        competitor: "Parents support daily worksheet completion. Progress discussed at centre visits",
      },
      {
        feature: "Gap detection",
        upwise: "Diagnostic maps 167 micro-skills with prerequisite chains to find root-cause gaps",
        competitor: "Instructor assessment determines starting point. Linear progression from there",
      },
      {
        feature: "Commitment",
        upwise: "Cancel anytime. No contracts, no enrolment fees",
        competitor: "Enrolment fee + ongoing monthly commitment. Centre attendance expected",
      },
    ],
    upwiseStrengths: [
      "Covers both maths and English for one price ($39/mo vs $320/mo for both at Kumon)",
      "AI adapts to every response — not a fixed sequence of worksheets",
      "No centre visits needed — learn anytime, anywhere",
      "Built specifically for Australian Curriculum and NAPLAN",
      "Parent guidance layer with daily briefings and conversation scripts",
    ],
    competitorStrengths: [
      "Decades of trust and brand recognition worldwide",
      "In-person instructor support and accountability",
      "Proven habit-formation model with daily discipline",
      "Extension pathways well beyond year level",
      "Physical centre creates routine and structure for some families",
    ],
    verdict:
      "Kumon is the stronger choice if your child thrives on physical routine, benefits from in-person accountability, or you value Kumon's long track record. Upwise is the stronger choice if you want mastery learning that adapts to your child in real time, covers both maths and English for a fraction of the cost, and gives you daily guidance as a parent — all without centre visits.",
  },
  {
    slug: "upwise-vs-kip-mcgrath",
    competitorName: "Kip McGrath",
    competitorUrl: "https://www.kipmcgrath.com.au",
    metaTitle: "Upwise vs Kip McGrath — Which is better for Australian primary students?",
    metaDescription:
      "Compare Upwise and Kip McGrath for Australian primary school students. Pricing, teaching approach, curriculum alignment, and which helps close gaps faster.",
    heroTitle: "Upwise vs Kip McGrath",
    heroSubtitle: "One uses qualified teachers. The other uses research-backed AI. Both want to close the gaps.",
    summary:
      "Kip McGrath is one of Australia's most established tutoring brands, offering teacher-led sessions in centres and online. Upwise uses AI-powered mastery learning with parent guidance. Both target primary students who need extra support, but the delivery and economics are very different.",
    rows: [
      {
        feature: "Approach",
        upwise: "AI-powered mastery learning with adaptive practice and parent-as-guide model",
        competitor: "Qualified teacher-led tutoring in 60-minute weekly sessions",
      },
      {
        feature: "Price",
        upwise: "From $39/month (unlimited daily sessions). 7-day free trial",
        competitor: "~$74 per session. Free initial assessment",
      },
      {
        feature: "Session format",
        upwise: "10-20 minute daily sessions, available anytime",
        competitor: "60-minute weekly sessions at a centre or online",
      },
      {
        feature: "Frequency",
        upwise: "Daily practice — short sessions every day build stronger retention",
        competitor: "Once per week. Homework between sessions",
      },
      {
        feature: "Subjects",
        upwise: "Maths, reading, spelling & grammar (Prep-Year 7)",
        competitor: "Maths and English (primary and secondary)",
      },
      {
        feature: "Personalisation",
        upwise: "AI analyses every response. 167 micro-skills with mapped prerequisites",
        competitor: "Teacher adapts to student needs. Free assessment determines starting point",
      },
      {
        feature: "Curriculum alignment",
        upwise: "Built specifically for ACARA and NAPLAN domains",
        competitor: "Curriculum-aligned topics with teacher-selected materials",
      },
      {
        feature: "Parent involvement",
        upwise: "Daily briefings, real-time nudges, conversation scripts, weekly reports",
        competitor: "Progress reports and parent updates from the centre",
      },
      {
        feature: "Availability",
        upwise: "24/7 — learn whenever your child is ready",
        competitor: "Set times at the centre. Some locations offer online",
      },
    ],
    upwiseStrengths: [
      "Daily practice (not weekly) builds stronger habits and faster progress",
      "Unlimited sessions for $39/month vs ~$296/month for weekly Kip sessions",
      "AI adapts to every single response in real time",
      "No travel to centres — learn from home anytime",
      "Parent is actively involved with daily briefings and guidance",
    ],
    competitorStrengths: [
      "Qualified teachers with face-to-face interaction",
      "140+ centres across Australia — strong local presence",
      "Long-established trust and brand recognition",
      "Free initial assessment to identify needs",
      "Human judgement for complex learning difficulties",
    ],
    verdict:
      "Kip McGrath is the stronger choice if your child benefits from face-to-face interaction with a qualified teacher, or has complex learning needs that require human judgement. Upwise is the stronger choice if you want daily, affordable practice that targets root-cause gaps with precision — and want to be actively guided as a parent rather than dropping your child at a centre once a week.",
  },
  {
    slug: "upwise-vs-kinetic-education",
    competitorName: "Kinetic Education",
    competitorUrl: "https://www.kineticeducation.com.au",
    metaTitle: "Upwise vs Kinetic Education — Which is better for Australian primary students?",
    metaDescription:
      "Compare Upwise and Kinetic Education for Australian primary students. Both offer online maths and English with curriculum alignment. See how they differ.",
    heroTitle: "Upwise vs Kinetic Education",
    heroSubtitle: "Both offer online maths and English for Australian families. The learning models differ.",
    summary:
      "Kinetic Education offers online tutoring with human tutor support, assessment-driven lesson plans, and weekly parent updates. Upwise uses AI-powered mastery learning with a parent guidance layer. Both cover maths and English and follow the Australian Curriculum.",
    rows: [
      {
        feature: "Approach",
        upwise: "AI-powered mastery learning — can't progress until concepts are genuinely understood",
        competitor: "Online platform with live tutor support and assessment-driven lesson plans",
      },
      {
        feature: "Price",
        upwise: "From $39/month (1 child) or $59/month (family up to 4). 7-day free trial",
        competitor: "From ~$29/week for the family",
      },
      {
        feature: "Subjects",
        upwise: "Maths, reading, spelling & grammar (four NAPLAN domains)",
        competitor: "Maths and English",
      },
      {
        feature: "Personalisation",
        upwise: "AI analyses every response. 167 micro-skills with mapped prerequisite chains",
        competitor: "Assessment-led personalised lesson plans with tutor oversight",
      },
      {
        feature: "Human support",
        upwise: "Parent-as-guide model with AI-generated briefings, nudges and conversation scripts",
        competitor: "Live tutor support included in the subscription",
      },
      {
        feature: "Curriculum",
        upwise: "Built specifically for ACARA and NAPLAN domains with 167 mapped micro-skills",
        competitor: "Follows Australian Curriculum with assessment-led plans",
      },
      {
        feature: "Parent involvement",
        upwise: "Daily briefings, real-time nudges, conversation scripts, teacher-shareable reports",
        competitor: "Weekly parent updates on progress",
      },
      {
        feature: "Motivation",
        upwise: "Mastery-based confidence building. Coins, streaks, themes. Rewards mode parent-controlled",
        competitor: "Rewards and incentives with tutor encouragement",
      },
      {
        feature: "Session format",
        upwise: "Self-paced 10-20 minute daily sessions, available anytime",
        competitor: "Structured lessons with scheduled tutor availability",
      },
    ],
    upwiseStrengths: [
      "AI adapts to every single response — not just assessment-driven plans",
      "167 micro-skills with prerequisite mapping finds root-cause gaps",
      "Daily briefings give parents specific guidance, not just progress updates",
      "Mastery gates ensure genuine understanding before progressing",
      "Research-backed approach (2025 Harvard RCT, PNAS guardrails study)",
    ],
    competitorStrengths: [
      "Live human tutor support included in subscription",
      "Lower starting price for families (~$29/week)",
      "100,000+ families helped — established track record",
      "96% parent satisfaction rating",
      "Direct human interaction for students who need it",
    ],
    verdict:
      "Kinetic Education is the stronger choice if your child benefits from live tutor interaction and you want human support built into the subscription. Upwise is the stronger choice if you want AI that adapts to every response (not just periodic assessments), mastery-based progression that prevents gaps from compounding, and a parent guidance layer that helps you support your child's learning daily.",
  },
  {
    slug: "upwise-vs-reading-eggs",
    competitorName: "Reading Eggs & Mathseeds",
    competitorUrl: "https://readingeggs.com.au",
    metaTitle: "Upwise vs Reading Eggs & Mathseeds — Which is better for Australian primary students?",
    metaDescription:
      "Compare Upwise and Reading Eggs/Mathseeds for Australian primary students. Subjects, pricing, learning approach, and which is better for closing skill gaps.",
    heroTitle: "Upwise vs Reading Eggs & Mathseeds",
    heroSubtitle: "Both help Australian children learn at home. They serve different stages and needs.",
    summary:
      "Reading Eggs and Mathseeds are popular subscription platforms focused on early literacy and numeracy through gamified activities. Upwise takes a mastery-learning approach with AI personalisation and covers all five NAPLAN domains. Here's how they compare.",
    rows: [
      {
        feature: "Approach",
        upwise: "AI-powered mastery learning — diagnoses gaps, adapts in real time, ensures understanding",
        competitor: "Gamified learning activities with structured lesson sequences",
      },
      {
        feature: "Price",
        upwise: "From $39/month (1 child) or $59/month (family). 7-day free trial",
        competitor: "~$13.99/month or $109.99/year (up to 4 children). 30-day free trial",
      },
      {
        feature: "Subjects",
        upwise: "Maths, reading, spelling & grammar (four NAPLAN domains)",
        competitor: "Reading (Reading Eggs) and early maths (Mathseeds) as separate products",
      },
      {
        feature: "Age range focus",
        upwise: "Strongest for Years 3-7 — where hidden curriculum gaps cause the most damage",
        competitor: "Strongest for early readers (ages 2-13) — particularly Foundation to Year 2",
      },
      {
        feature: "Personalisation",
        upwise: "AI analyses every response. 167 micro-skills with mapped prerequisite chains",
        competitor: "Placement quiz determines starting level. Linear lesson progression",
      },
      {
        feature: "Gap detection",
        upwise: "Diagnostic assessment maps exact micro-skill gaps and prerequisite chains",
        competitor: "Progress tracked by lesson completion. Less granular gap identification",
      },
      {
        feature: "Parent involvement",
        upwise: "Daily briefings, real-time nudges, conversation scripts, projected NAPLAN bands",
        competitor: "Progress reports and reading assessment results",
      },
      {
        feature: "Learning model",
        upwise: "Mastery-based — can't progress until concepts are genuinely understood",
        competitor: "Activity-based — children progress through lesson sequences",
      },
      {
        feature: "Multi-child",
        upwise: "Family plan: up to 4 children for $59/month",
        competitor: "Up to 4 children included in standard subscription",
      },
    ],
    upwiseStrengths: [
      "Covers all five NAPLAN domains in one subscription (not separate products)",
      "Strongest for Years 3-7 where gaps become critical",
      "AI-powered mastery progression — not just activity completion",
      "Prerequisite mapping finds root-cause gaps, not just surface errors",
      "Parent guidance layer with daily briefings, nudges and conversation scripts",
    ],
    competitorStrengths: [
      "Significantly more affordable ($13.99/mo for up to 4 children)",
      "Excellent for early readers and pre-school numeracy",
      "Engaging, gamified activities that young children enjoy",
      "Established trust — 20 million users, kidSAFE certified",
      "30-day free trial gives parents time to evaluate",
    ],
    verdict:
      "Reading Eggs and Mathseeds are the stronger choice for younger children (Foundation to Year 2) who need to build early reading and numeracy skills through engaging activities. Upwise is the stronger choice for primary students in Years 3-7 who need to close specific curriculum gaps, build genuine mastery, and prepare for NAPLAN — especially if you want daily guidance on how to support their learning as a parent.",
  },
  {
    slug: "upwise-vs-numberworks",
    competitorName: "NumberWorks'nWords",
    competitorUrl: "https://www.numberworksnwords.com",
    metaTitle: "Upwise vs NumberWorks'nWords — Which is better for Australian primary students?",
    metaDescription:
      "Compare Upwise and NumberWorks'nWords for Australian primary students. Pricing, tutoring approach, curriculum alignment, and which closes gaps faster.",
    heroTitle: "Upwise vs NumberWorks'nWords",
    heroSubtitle: "Both cover maths and English for primary students. The delivery couldn't be more different.",
    summary:
      "NumberWorks'nWords is a centre-based tutoring franchise that combines software, tutor explanation and workbooks. Upwise uses AI-powered mastery learning with parent guidance. Both cover primary maths and English, but the model and economics differ significantly.",
    rows: [
      {
        feature: "Approach",
        upwise: "AI-powered mastery learning that adapts in real time to your child's understanding",
        competitor: "Centre-based small classes with 1:1 tutor support, software and workbooks",
      },
      {
        feature: "Price",
        upwise: "From $39/month (unlimited sessions). 7-day free trial",
        competitor: "~$71 per primary lesson",
      },
      {
        feature: "Session format",
        upwise: "10-20 minute daily sessions, available anytime at home",
        competitor: "Weekly centre-based lessons with small class sizes",
      },
      {
        feature: "Subjects",
        upwise: "Maths, reading, spelling & grammar (four NAPLAN domains)",
        competitor: "Maths and English in separate lesson streams",
      },
      {
        feature: "Personalisation",
        upwise: "AI analyses every response. 167 micro-skills with mapped prerequisite chains",
        competitor: "Free assessment determines starting point. Tutor adjusts within lessons",
      },
      {
        feature: "Curriculum alignment",
        upwise: "Built specifically for ACARA and NAPLAN domains",
        competitor: "Curriculum-based content with tutor-selected materials",
      },
      {
        feature: "Parent involvement",
        upwise: "Daily briefings, real-time nudges, conversation scripts, teacher-shareable reports",
        competitor: "Progress reports from the centre",
      },
      {
        feature: "Frequency",
        upwise: "Daily practice builds stronger retention and faster progress",
        competitor: "Weekly sessions with practice between visits",
      },
      {
        feature: "Availability",
        upwise: "24/7 — learn whenever your child is ready. No travel needed",
        competitor: "Set times at the centre. Travel required",
      },
    ],
    upwiseStrengths: [
      "Daily practice for $39/month vs ~$284/month for weekly NumberWorks sessions",
      "AI adapts to every response — not just tutor observation",
      "No centre visits or travel — learn from home anytime",
      "167 micro-skill prerequisite mapping finds root-cause gaps",
      "Parent guidance layer turns you into the daily support person",
    ],
    competitorStrengths: [
      "In-person tutor support and face-to-face interaction",
      "Small class sizes with individual attention",
      "Free initial assessment to identify needs",
      "Confidence-building through in-person relationships",
      "Structured after-school routine for some families",
    ],
    verdict:
      "NumberWorks'nWords is the stronger choice if your child benefits from in-person interaction, small class structure, and the routine of attending a centre. Upwise is the stronger choice if you want daily, affordable mastery learning that precisely targets root-cause gaps — and you want to be actively involved in guiding your child's progress rather than relying on weekly centre visits.",
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
        upwise: "Maths, reading, spelling & grammar (Prep-Year 7)",
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
