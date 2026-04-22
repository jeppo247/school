# Tutor CoPilot: A Human-AI Approach for Scaling Real-Time Expertise

## Citation
Wang, R. E., Ribeiro, A. T., Robinson, C. D., Loeb, S., & Demszky, D. (2024). Tutor CoPilot: A human-AI approach for scaling real-time expertise. *arXiv preprint arXiv:2410.03017*. https://doi.org/10.48550/arXiv.2410.03017

## Summary
This study presents the first randomised controlled trial of a human-AI tutoring system deployed in live K-12 tutoring sessions. Tutor CoPilot is an AI assistant that provides real-time pedagogical suggestions to human tutors during online tutoring sessions. Rather than replacing tutors or directly interacting with students, the system acts as a "copilot" -- suggesting high-quality teaching strategies (like guiding questions and scaffolded hints) that tutors can choose to use, edit, or ignore.

The trial was conducted over two months with 900 tutors and 1,800 students in grades 3-8 from nine schools in a southern US school district. The student population was predominantly Hispanic (80%) and economically disadvantaged (67%), with all students having scored below grade level on prior state assessments. Students whose tutors had access to CoPilot were 4 percentage points more likely to master topics (passing exit tickets), with the effect rising to 9 percentage points for students of lower-rated tutors.

The mechanism of improvement was clear: tutors with CoPilot access shifted from low-quality strategies (giving away answers) to high-quality strategies (asking guiding questions, prompting students to explain their reasoning). Analysis of over 550,000 chat messages confirmed this behavioural shift. Critically, the system achieved these results at just $20 per tutor per year -- compared to $3,300+ for traditional professional development -- making it a transformatively cost-effective intervention for educational equity.

## Key Findings
- **Overall mastery improvement:** +4 percentage points (62% to 66% exit ticket pass rate, p<0.01)
- **Lower-rated tutors' students:** +9 percentage points mastery improvement (56% to 65%)
- **Less-experienced tutors' students:** +7 percentage points improvement (61% to 68%)
- **Treatment-on-treated effect:** +14 percentage points for tutors who actually used the tool (p<0.01)
- **Cost:** $20 per tutor per year (vs. $3,300+ for traditional professional development)
- **Scale:** 900 tutors, 1,800 students, 4,136 sessions, 550,000+ messages analysed
- **Adoption:** 29% of treatment sessions used CoPilot at least once; average 10 uses per active session
- **Pedagogical shift:** Significant increase in guiding questions (~2 SD higher log-odds); significant decrease in giving away answers
- **Exit ticket predictive validity:** Each additional exit ticket passed associated with +0.06 points on end-of-year MAP test (p<0.001)
- **Student surveys:** No significant differences in student perceptions (tutors successfully integrated AI suggestions naturally)

## Methodology
- **Design:** Cluster-randomised controlled trial (RCT) with tutor-level randomisation; pre-registered on Open Science Framework (osf.io/8d6ha)
- **Sample:** 874 tutors randomised (782 post-attrition: 386 treatment, 396 control); 1,787 students in grades 3-8
- **Setting:** Nine schools in a southern US school district; online tutoring via FEV Tutor platform
- **Duration:** Two months, starting end of March 2024
- **Demographics:** 80% Hispanic students, 67% economically disadvantaged, all below grade level on prior state test
- **AI system:** Built on the "Bridge" method capturing expert decision-making through think-aloud protocols; integrated into tutoring platform with button activation
- **Guardrails:** De-identification of student/tutor names; context limited to 10 most recent messages; tutors select from 7 pedagogical strategies (guiding question, worked example, correction, similar problem, simplify, affirm, encourage); tutors can edit or regenerate suggestions
- **Primary outcome:** Exit ticket passing rate (determines curriculum progression)
- **Secondary outcomes:** Participation points, student surveys, NLP-classified tutoring quality
- **Analysis:** Intention-to-treat regression with school x grade fixed effects; covariates for gender, race/ethnicity, free/reduced lunch, special education, English proficiency, pre-study MAP scores
- **NLP pipeline:** GPT-4 first-pass labelling of 3,000 messages, manual verification, fine-tuned RoBERTa classifiers (F1: 0.65-0.90)

## Relevance to Upwise
This study provides strong evidence for several core elements of Upwise's approach:

1. **AI-guided pedagogy works.** The +4-9pp mastery improvement demonstrates that AI can meaningfully improve learning outcomes when it guides the teaching process rather than replacing it. Upwise's adaptive hint system operates on the same principle -- scaffolding the learning experience rather than providing answers.

2. **Greatest impact on those who need it most.** The finding that lower-rated tutors' students gained the most (+9pp) is a powerful equity argument. Upwise serves a similar function: providing every child access to expert-level pedagogical scaffolding regardless of their parents' ability to afford private tutoring.

3. **Cost-effectiveness is transformative.** At $20/tutor/year vs $3,300+ for traditional PD, the cost reduction is ~99%. This validates the economics of AI-powered educational tools and supports Upwise's value proposition to parents -- high-quality adaptive learning at a fraction of traditional tutoring costs.

4. **Guiding questions over answers.** The NLP analysis confirmed that the mechanism of improvement was shifting from "giving away answers" to "asking guiding questions." This directly validates Upwise's hint-based, Socratic approach to AI tutoring.

5. **Mastery-based assessment.** The study used exit tickets (independent assessments) as the primary outcome measure, and found they predicted end-of-year standardised test performance. This supports Upwise's mastery-based progression system where students must demonstrate understanding before advancing.

6. **Natural integration.** Student surveys showed no significant differences between treatment and control -- meaning the AI support was invisible to students. This supports Upwise's design philosophy of seamless, behind-the-scenes AI that enhances the learning experience without feeling artificial.

## Source
https://arxiv.org/abs/2410.03017
