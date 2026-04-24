export interface FAQItem {
  question: string;
  answer: string;
  source?: { label: string; url: string };
}

export interface FAQSection {
  title: string;
  icon: string;
  items: FAQItem[];
}

export const PARENT_SECTIONS: FAQSection[] = [
  {
    title: "The research behind mastery learning",
    icon: "📚",
    items: [
      {
        question: "What is mastery learning and why does it matter?",
        answer: `Mastery learning means your child fully understands a concept before moving on — no gaps, no guessing, no falling behind.\n\nIn a classroom, teachers need to keep everyone moving at the same pace. That often means some students progress before they're ready, and small gaps quietly compound into big ones.\n\nUpwise ensures your child learns each concept properly, fills gaps immediately, and builds genuine confidence.`,
      },
      {
        question: "Is there actual evidence this works?",
        answer: `Yes — from foundational research through to the latest studies.\n\nThe concept starts with Bloom's landmark 1984 finding: students receiving one-to-one tutoring with mastery learning performed two standard deviations above classroom peers — outperforming roughly 98% of students.\n\nBut the evidence has only grown stronger since:\n\n• A 2025 Harvard randomised controlled trial found that AI tutoring produced over double the learning gains of active classroom learning, with an effect size of 0.63 to 1.3 standard deviations (Kestin et al., published in Nature Scientific Reports).\n\n• A 2025 systematic review of 28 studies in Nature's NPJ Science of Learning found that 87.5% of studies showed intelligent tutoring systems outperformed traditional teaching, with medium-to-large effect sizes.\n\n• A meta-analysis of 107 effect sizes found that intelligent tutoring systems essentially match the effectiveness of one-on-one human tutoring (Ma et al., Journal of Educational Psychology).\n\nThe science is clear: personalised mastery learning works. AI makes it scalable for the first time.`,
        source: { label: "Kestin et al. (2025) — Nature Scientific Reports", url: "https://www.nature.com/articles/s41598-025-97652-6" },
      },
      {
        question: "How efficient is AI-supported learning compared to classroom instruction?",
        answer: `Significantly more efficient — and the data is compelling.\n\n• A 2024 study across 40+ university courses found students using AI tutoring reduced study time by approximately 27% while maintaining or improving outcomes (Moller et al., arXiv).\n\n• Khan Academy's 2024 efficacy study of 350,000 students found that just 30 minutes per week of adaptive practice produced 20% greater-than-expected learning gains.\n\n• Alpha School reports students completing core academics in roughly 2–3 hours per day while achieving approximately 2.3 times the annual academic growth of peers.\n\nThe difference isn't more hours — it's better use of time. Your child skips what they already know, spends more time on what they need, and gets instant feedback on every answer.`,
        source: { label: "Khan Academy Efficacy Study (2024)", url: "https://blog.khanacademy.org/khan-academy-efficacy-results-november-2024/" },
      },
      {
        question: "How do you know the AI is actually teaching well, not just giving answers?",
        answer: `This is a critical question — and there's direct research on it.\n\nA 2025 study published in PNAS (one of the world's most prestigious journals) tested what happens when students use AI with and without guardrails. Students with unguarded access to GPT-4 improved 48% during practice but scored 17% worse on exams — the AI was doing the thinking for them.\n\nStudents using a guardrailed AI tutor (designed to hint and guide rather than give answers) improved 127% during practice with no negative exam effect.\n\nUpwise is built on this principle. The system provides layered hints, targeted feedback, and guided practice — never just the answer. Design matters as much as the technology.`,
        source: { label: "Bastani et al. (2025) — PNAS", url: "https://www.pnas.org/doi/10.1073/pnas.2422633122" },
      },
      {
        question: "Why do gaps get bigger over time in traditional learning?",
        answer: `In a traditional classroom, if your child doesn't fully understand a concept, the class moves on anyway. That gap becomes the foundation for the next topic.\n\nEach new lesson builds on something they didn't master, and the deficit compounds. By the end of the year, what started as a small misunderstanding can become a major barrier.\n\nMastery learning works differently. Your child doesn't move on until they've genuinely understood the current concept. Once those foundations are solid, everything built on top is stronger. Gaps are closed at the source — so learning accelerates instead of slowing down.`,
      },
    ],
  },
  {
    title: "How Upwise works",
    icon: "💡",
    items: [
      {
        question: "What is Upwise?",
        answer: `A personalised learning system that helps your child build genuine mastery in literacy and numeracy.\n\nIt identifies exactly where your child's gaps are, guides them through personalised learning at their own pace, and gives you clear visibility into their progress.\n\nAligned to the Australian Curriculum (ACARA) and designed to build the foundational skills assessed by NAPLAN.`,
      },
      {
        question: "How does the AI personalise my child's learning?",
        answer: `As your child works, the system analyses every response — not just whether it's right or wrong, but how quickly they answered, what type of mistakes they made, and which concepts they're confident with.\n\nIt then adjusts difficulty in real time, targets specific weaknesses, and revisits concepts using spaced repetition to lock them into long-term memory.\n\nNo two children follow the same path. The difficulty stays in the optimal zone — challenging enough to learn, easy enough to stay confident.`,
      },
      {
        question: "What subjects and year levels does it cover?",
        answer: `Prep to Year 7, covering four NAPLAN domains:\n\n• Numeracy\n• Reading\n• Spelling\n• Grammar and Punctuation\n\nWriting is not included as it requires human marking of extended responses. The skill graph contains 167 micro-skills with mapped prerequisites, so we can pinpoint exactly where a gap begins and work forward from there.`,
      },
      {
        question: "How much time should my child spend on it?",
        answer: `10–20 minutes per day is ideal.\n\nConsistency beats long sessions. The system is designed for short, focused practice that compounds over time.\n\nSessions include built-in brain breaks to maintain focus, and we cap continuous learning at 20 minutes before encouraging a rest.`,
      },
      {
        question: "How does it help with NAPLAN?",
        answer: `NAPLAN tests core skills in reading, spelling, grammar, and numeracy (plus writing, which requires human marking).\n\nUpwise builds those skills from the ground up, aligned to the Australian Curriculum frameworks that NAPLAN assesses. Your child develops genuine competence — not just familiarity with test formats.\n\nThe parent dashboard shows projected proficiency bands based on your child's demonstrated mastery, so you can see where they're tracking before test day.`,
      },
    ],
  },
  {
    title: "Progress, safety and privacy",
    icon: "🔒",
    items: [
      {
        question: "How can I track my child's progress?",
        answer: `Through the parent dashboard, you'll see:\n\n• Domain-by-domain proficiency across four NAPLAN domains\n• Specific strengths and gaps\n• Improvement trends over time\n• Projected NAPLAN proficiency bands\n• Clear next steps for each domain\n\nAll analytics are parent-only — your child sees encouragement and progress, never scores or comparisons.`,
      },
      {
        question: "Does this replace tutoring?",
        answer: `For many families, yes.\n\nUpwise delivers personalised instruction, instant feedback, and targeted learning — without the cost ($60–$100+ per hour) or scheduling hassle of a private tutor.\n\nIt's available whenever your child is ready to learn, adjusts to their exact level, and never has an off day.`,
      },
      {
        question: "Is this just more screen time?",
        answer: `No — it's high-quality, focused learning time.\n\nStudents in AI-led mastery models often complete core academics in as little as 2 focused hours per day. Short, focused sessions of 10–20 minutes outperform long, unfocused ones.\n\nEvery second your child spends on Upwise is actively building a skill — not watching videos, scrolling, or waiting for the class to catch up.`,
      },
      {
        question: "Is my child's data safe?",
        answer: `Yes. We follow the Australian Privacy Principles under the Privacy Act 1988.\n\nYour child's information is only used to improve their learning experience. We never sell data to third parties. Data is encrypted at rest and in transit. You can request deletion at any time.\n\nThe system is designed with data minimisation — we collect only what's needed for learning, nothing more.`,
      },
      {
        question: "Does the AI talk to my child like a person?",
        answer: `No — and deliberately so.\n\nResearch on children and AI shows it's important to be transparent. Upwise clearly identifies itself as an AI learning tool, uses literal and task-focused language, and never pretends to have feelings or be a friend.\n\nEvery learning screen includes an "Ask an adult" button so your child can pause and get help from you at any time.`,
      },
      {
        question: "What if my child is already doing well?",
        answer: `They'll be challenged appropriately.\n\nThe system extends stronger students by introducing more advanced concepts and keeps them engaged at their level — not held back by the class average.\n\nMastery learning isn't just for struggling students. It's about ensuring every child reaches their potential.`,
      },
    ],
  },
];

export const TEACHER_SECTIONS: FAQSection[] = [
  {
    title: "What Upwise is (and isn't)",
    icon: "🤝",
    items: [
      {
        question: "Is Upwise trying to replace teachers?",
        answer: `Absolutely not.\n\nUpwise handles the part of teaching that's hardest to do at scale: identifying each student's specific gaps and providing targeted, one-to-one practice with immediate feedback.\n\nIt can't do what you do — build relationships, motivate, coach critical thinking, facilitate group discussion, manage a classroom, or understand a child's emotional state.\n\nA 2024 Stanford RCT of 1,800 students found that AI-assisted tutoring improved mastery by 4–9 percentage points — but critically, the AI worked alongside human tutors, not instead of them. The strongest gains were for students of less experienced tutors, suggesting AI raises the floor rather than replacing expertise.\n\nUpwise is designed to be the practice layer that makes your instruction land better — not a substitute for it.`,
        source: { label: "Wang et al. (2024) — Stanford Tutor CoPilot RCT", url: "https://arxiv.org/abs/2410.03017" },
      },
      {
        question: "How is this different from other edtech that overpromised?",
        answer: `We understand the skepticism. A lot of edtech has promised transformation and delivered distraction.\n\nUpwise is different in a few specific ways:\n\n• It's built on mastery learning — a pedagogy with decades of evidence, not a Silicon Valley trend\n• It's aligned to ACARA, not a generic American curriculum\n• It targets specific micro-skills with mapped prerequisites, not broad topic areas\n• It gives parents (and potentially teachers) diagnostic-quality data, not just completion metrics\n• It's designed for 10–20 minute sessions as homework support, not to take over your classroom`,
      },
      {
        question: "What does the research actually say about AI tutoring?",
        answer: `The evidence base has grown rapidly in the last two years:\n\n• A 2025 systematic review of 28 studies (published in Nature's NPJ Science of Learning) found 87.5% of intelligent tutoring system studies showed they outperformed traditional teaching, with medium-to-large effect sizes.\n\n• A 2025 Harvard RCT found AI tutoring produced over double the learning gains of active classroom instruction (effect size 0.63–1.3 SD), published in Nature Scientific Reports.\n\n• A meta-analysis of 107 effect sizes (Ma et al., Journal of Educational Psychology) found that intelligent tutoring systems essentially match one-on-one human tutoring in effectiveness.\n\n• A 48-study literature review confirmed AI tutors are most effective when complementing — not replacing — human instruction.\n\nWe're careful not to overclaim. But the direction of the evidence is clear and consistent: well-designed AI tutoring works, especially alongside quality teaching.`,
        source: { label: "Letourneau et al. (2025) — NPJ Science of Learning", url: "https://www.nature.com/articles/s41539-025-00320-7" },
      },
    ],
  },
  {
    title: "How it supports your teaching",
    icon: "📊",
    items: [
      {
        question: "How does Upwise actually help me as a teacher?",
        answer: `Upwise gives you something that's almost impossible to get in a classroom of 25+ students: a precise, per-student map of exactly which micro-skills each child has mastered and which they haven't.\n\nInstead of guessing who understood last week's lesson on fractions, you can see that Student A is solid on equivalent fractions but struggling with unlike denominators, while Student B has the opposite pattern.\n\nThat lets you group more effectively, differentiate with confidence, and spend your teaching time on high-value instruction rather than re-diagnosing.`,
      },
      {
        question: "Does it align with what I'm already teaching?",
        answer: `Yes. Upwise is aligned to the Australian Curriculum (ACARA) and maps 167 micro-skills across the five NAPLAN domains.\n\nIt's not a parallel curriculum — it practices and reinforces the same skills you're teaching, with the same language and progression your students are used to.\n\nIt uses Australian English, Australian contexts, and year-level-appropriate content that matches the curriculum expectations for each year group.`,
      },
      {
        question: "Will my students come to class confused by different methods?",
        answer: `No. Upwise focuses on building fluency with foundational skills — it doesn't teach alternative algorithms or methods that would conflict with your instruction.\n\nFor example, in numeracy it practises place value understanding, operation fluency, and problem-solving — the building blocks that make your lessons more effective, not a competing approach.`,
      },
      {
        question: "Can I see what my students are working on?",
        answer: `Currently, Upwise is a parent-facing tool — parents use it at home and see progress through the parent dashboard.\n\nParents can share reports with you to give you additional insight into where each child is at.\n\nWe're exploring direct teacher dashboard access as a future feature, which would let you see skill-level data for your class without any extra work on your part.`,
      },
      {
        question: "Does it handle different ability levels in my class?",
        answer: `That's exactly what it's designed for.\n\nEvery child follows their own learning path based on their demonstrated mastery. A Year 5 student who hasn't mastered Year 3 place value will work on that foundation first, while a student who's ahead will be extended with more challenging content.\n\nThis means the range of ability in your classroom narrows over time, not widens — making whole-class instruction more effective.`,
      },
    ],
  },
  {
    title: "Common concerns",
    icon: "💬",
    items: [
      {
        question: "Will parents start thinking they don't need school?",
        answer: `School provides far more than content delivery — socialisation, structured learning habits, collaborative skills, physical activity, creative expression, and adult mentorship.\n\nUpwise handles one narrow (but important) slice: targeted practice of foundational literacy and numeracy skills. It makes school time more productive by ensuring students arrive with fewer gaps and stronger foundations.\n\nWe're explicit with parents that Upwise supports school — it doesn't replace it.`,
      },
      {
        question: "What if a parent blames me when their child's gaps show up?",
        answer: `Gaps are normal. Every child has them, and they're a natural part of learning — not a reflection of teaching quality.\n\nUpwise frames gaps as opportunities, not failures. The parent dashboard shows "here's what to work on next," not "here's what the school got wrong."\n\nIn fact, the data often highlights how much progress a child has made — which reflects well on your teaching.`,
      },
      {
        question: "Is this going to create more work for me?",
        answer: `No. Upwise is entirely parent-managed at home.\n\nYou don't need to set it up, assign work, mark anything, or monitor progress (unless you want to). It's designed to run alongside your teaching without adding to your workload.\n\nIf a parent shares a report with you, it's additional diagnostic information that may save you time — not a task to complete.`,
      },
      {
        question: "What about students who don't have access at home?",
        answer: `Upwise works on any device with a browser — phones, tablets, laptops. It doesn't require any special hardware or software.\n\nWe're aware that equitable access is important. The free tier includes a full diagnostic and limited practice sessions, so no child is locked out entirely.\n\nWe're also exploring school-based licensing that would allow classroom use for students who need it.`,
      },
      {
        question: "How do I know the AI is teaching correctly?",
        answer: `Upwise doesn't teach new concepts — that's your job. It provides structured practice, immediate feedback, and spaced repetition on skills your students are already learning.\n\nAll content is aligned to ACARA, reviewed for age-appropriateness, and uses Australian English. The AI generates practice questions within strict curriculum and safety constraints, and every question goes through automated quality gates before reaching a student.\n\nImportantly, a 2025 PNAS study showed that AI design matters enormously. Students with unguarded AI access scored 17% worse on exams despite improving during practice — the AI was doing the thinking for them. Guardrailed AI tutoring (hints and guidance, never just the answer) improved practice scores by 127% with no negative exam effect. Upwise is built on this guardrailed principle.`,
        source: { label: "Bastani et al. (2025) — PNAS", url: "https://www.pnas.org/doi/10.1073/pnas.2422633122" },
      },
      {
        question: "What does the AI do that I can't?",
        answer: `Two things that are structurally impossible in a classroom:\n\n1. True one-to-one pacing — every child works at exactly their level, every session, with instant feedback on every response\n\n2. Continuous diagnostic precision — the system analyses every answer across hundreds of micro-skills, detects patterns (like consistent errors with borrowing in subtraction), and adjusts automatically\n\nYou can do these things for one student at a time. You can't do them for 25 simultaneously. That's not a criticism — it's physics.\n\nUpwise handles the repetitive practice and diagnosis so you can focus on the parts of teaching that require a human.`,
      },
    ],
  },
  {
    title: "The bigger picture",
    icon: "🌏",
    items: [
      {
        question: "Is AI in education going to change my role?",
        answer: `Yes — but probably for the better.\n\nThe research consistently shows that AI tutoring is most effective when combined with human teaching. The likely shift is that teachers spend less time on content delivery and repetitive practice, and more time on the things that matter most: critical thinking, creativity, collaboration, mentorship, and emotional support.\n\nTeachers aren't becoming less important. The role is becoming more human, not less.`,
      },
      {
        question: "Should I be recommending this to parents?",
        answer: `That's entirely your call. But here's what parents often struggle with:\n\n• They want to help with homework but aren't sure of the current methods\n• They can sense their child has gaps but can't pinpoint where\n• Private tutoring is expensive ($60–$100+/hour) and logistically difficult\n• They don't know if their child is on track for NAPLAN\n\nUpwise addresses all four of those problems. If a parent asks you for a homework support recommendation, it's a credible option backed by research — not a gimmick.`,
      },
      {
        question: "Who built this?",
        answer: `Upwise is built by Techne AI, an Australian company based in Adelaide.\n\nIt's designed specifically for Australian students, aligned to the Australian Curriculum, and built with Australian Privacy Principles compliance from the ground up.\n\nWe're not a US product adapted for the local market. This is built here, for here.`,
      },
    ],
  },
];

/** Flatten all sections into a flat list of {question, answer} for schema generation */
export function getAllFAQItems(): { question: string; answer: string }[] {
  const all = [...PARENT_SECTIONS, ...TEACHER_SECTIONS];
  return all.flatMap((section) =>
    section.items.map((item) => ({
      question: item.question,
      answer: item.answer.replace(/\\n/g, " ").replace(/\n/g, " "),
    }))
  );
}
