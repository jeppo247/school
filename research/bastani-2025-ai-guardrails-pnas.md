# Generative AI Without Guardrails Can Harm Learning: Evidence from High School Mathematics

## Citation
Bastani, H., Bastani, O., Sungu, A., Ge, H., Kabakci, O., & Mariman, R. (2025). Generative AI without guardrails can harm learning: Evidence from high school mathematics. *Proceedings of the National Academy of Sciences*, 122(26), e2422633122. https://doi.org/10.1073/pnas.2422633122

## Summary
This large-scale field experiment examined how generative AI (GPT-4) affects student learning in high school mathematics. Approximately 1,000 students were given access to one of two AI tutoring interfaces during practice sessions: GPT Base (standard, unrestricted ChatGPT-style access) or GPT Tutor (a guardrailed version with carefully designed educational safeguards). A control group received no AI access.

The results revealed a critical paradox. While AI access dramatically improved performance during practice sessions (48% improvement with GPT Base, 127% with GPT Tutor), the picture reversed when AI access was removed for exams. Students who had used the unrestricted GPT Base actually performed 17% worse on exams compared to the control group that never had AI access. This suggests that unguarded AI acts as a "crutch" -- students outsource their thinking to the AI rather than developing genuine understanding.

However, the guardrailed GPT Tutor largely mitigated these negative effects. The key safeguard was designing the AI to provide teacher-designed hints rather than giving away answers directly, encouraging students to work through problems with guided support rather than passively receiving solutions. This finding has profound implications for how AI should be integrated into educational settings.

## Key Findings
- **Practice performance with GPT Base (unrestricted AI):** 48% improvement during AI-assisted practice sessions
- **Practice performance with GPT Tutor (guardrailed AI):** 127% improvement during AI-assisted practice sessions
- **Exam performance after AI removal (GPT Base):** 17% reduction in grades compared to no-AI control group
- **Exam performance after AI removal (GPT Tutor):** Negative effects largely mitigated by guardrails
- **Sample size:** ~1,000 high school mathematics students
- **Citation impact:** 99.95th percentile (top 0.05% of all papers); 43-62 citations within first year
- **Core mechanism:** Unrestricted AI creates dependency ("crutch effect"); students stop engaging in productive struggle

## Methodology
- **Design:** Randomised field experiment (RCT) with three conditions: GPT Base (unrestricted ChatGPT-style), GPT Tutor (guardrailed), and control (no AI)
- **Sample:** ~1,000 high school students in mathematics courses
- **Setting:** High school mathematics classrooms
- **AI system:** GPT-4 accessed through two custom interfaces
- **Guardrail design:** GPT Tutor was configured to provide teacher-designed hints instead of direct answers, promoting Socratic-style guided problem-solving
- **Measures:** Performance during AI-assisted practice sessions (with AI available) and subsequent exam performance (with AI removed)
- **Key comparison:** Within-student change from practice (AI available) to exam (AI removed)

## Relevance to Upwise
This paper provides the single strongest empirical justification for Upwise's core design philosophy. The findings directly validate several architectural decisions:

1. **Guardrailed AI is non-negotiable.** Giving students unrestricted AI access (like raw ChatGPT) actively harms learning. Upwise's hint-based, scaffolded approach aligns exactly with the GPT Tutor condition that produced 127% practice improvement without the exam penalty.

2. **Hints over answers.** The paper's key finding is that teacher-designed hints -- not direct answers -- are what make AI tutoring effective. This supports Upwise's progressive hint system and mastery-based learning design where students must demonstrate understanding before advancing.

3. **Mastery measurement must happen without AI.** The 17% exam decline occurred specifically when AI was removed. Upwise's design of measuring mastery through independent exit assessments (without AI assistance) ensures genuine skill acquisition is being tracked.

4. **The "crutch effect" is real and measurable.** This gives Upwise strong evidence for parent communication: we can explain why our AI tutor guides rather than tells, backed by a top-tier PNAS publication showing the harm of the alternative approach.

5. **Quantified marketing claim:** Guardrailed AI tutoring produces 2.6x better practice outcomes than unrestricted AI (127% vs 48%), while unrestricted AI actually makes students worse off long-term.

## Source
https://www.pnas.org/doi/10.1073/pnas.2422633122
