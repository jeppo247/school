import { claude } from "../lib/claude.js";
import { logger } from "../lib/logger.js";

type NaplanDomain = "numeracy" | "reading" | "spelling" | "grammar_punctuation" | "writing";

interface GenerateQuestionParams {
  skillName: string;
  skillDescription: string;
  yearLevel: number;
  domain: NaplanDomain;
  difficulty: "easy" | "medium" | "hard";
  questionType: "multiple_choice" | "numeric_input" | "true_false";
  themeId?: string;
  interests?: string[];
}

interface GeneratedQuestion {
  stem: string;
  answer: string | number;
  options?: string[];
  explanation: string;
  hint: string;
}

/**
 * Generates a question using Claude API.
 * Detects the NAPLAN domain and uses a tailored prompt for each.
 */
export async function generateQuestion(
  params: GenerateQuestionParams,
): Promise<GeneratedQuestion> {
  if (!claude) {
    throw new Error("Claude API client not configured — set ANTHROPIC_API_KEY");
  }

  const prompt = buildPrompt(params);

  const response = await claude.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  // Extract JSON from response (handle markdown code blocks)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    logger.error("No JSON found in Claude response", { text });
    throw new Error("Failed to generate valid question content");
  }

  try {
    return JSON.parse(jsonMatch[0]) as GeneratedQuestion;
  } catch {
    logger.error("Failed to parse Claude response as JSON", { text });
    throw new Error("Failed to generate valid question content");
  }
}

/**
 * Diverse Australian names to rotate through in questions.
 * Includes Aboriginal, Anglo, Asian-Australian, and multicultural names
 * reflecting the diversity of Australian classrooms.
 */
const DIVERSE_NAMES = [
  "Ava", "Liam", "Aroha", "Kai", "Zara", "Noah", "Indigo", "Mateo",
  "Lily", "Oliver", "Maya", "Jack", "Priya", "Tom", "Aisha", "Finn",
  "Ruby", "Leo", "Jade", "Sam", "Amara", "Max", "Sienna", "Ravi",
  "Grace", "Hugo", "Willow", "Ari", "Chloe", "Taj", "Sophie", "Ethan",
  "Mia", "Darcy", "Nina", "Riley", "Isla", "Kobi", "Ella", "Yusuf",
];

function getRandomName(): string {
  return DIVERSE_NAMES[Math.floor(Math.random() * DIVERSE_NAMES.length)];
}

const DIVERSITY_INSTRUCTIONS = `
CRITICAL RULES FOR UNIQUENESS:
- Use the character name "${getRandomName()}" in this question (vary names across questions)
- Create a UNIQUE scenario — do NOT reuse common scenarios like Taronga Zoo, Great Barrier Reef, or Bondi Beach
- Vary the question format and structure — avoid starting every question the same way
- Never use words like: kill, death, die, blood, weapon, gun, murder, violence, drug, scary, frightening, destroy, war
- Use only Australian English: colour (not color), favourite (not favorite), maths (not math), realise (not realize), organise (not organize)
`;

function buildPrompt(params: GenerateQuestionParams): string {
  const { domain } = params;

  switch (domain) {
    case "numeracy":
      return buildNumeracyPrompt(params);
    case "reading":
      return buildReadingPrompt(params);
    case "spelling":
      return buildSpellingPrompt(params);
    case "grammar_punctuation":
      return buildGrammarPrompt(params);
    case "writing":
      // Writing uses rubric scoring, not MCQ generation
      throw new Error("Writing domain uses rubric scoring, not question generation");
    default:
      return buildNumeracyPrompt(params);
  }
}

function buildNumeracyPrompt(params: GenerateQuestionParams): string {
  const themeContext = getThemeContext(params.themeId, params.interests);
  return `Generate a ${params.difficulty} ${params.questionType} maths question for an Australian Year ${params.yearLevel} student.

Skill: ${params.skillName}
Description: ${params.skillDescription}
${themeContext}

Requirements:
- Use Australian English (colour, favourite, maths, etc.)
- Use Australian contexts (AUD currency, km for distance, Australian cities/animals/sports)
- Age-appropriate language for Year ${params.yearLevel} (ages ${params.yearLevel + 5}-${params.yearLevel + 6})
- ${params.questionType === "multiple_choice" ? "Provide exactly 4 options with one correct answer. Make distractors based on common misconceptions." : ""}
- Include a clear, encouraging explanation of the correct answer
- Include a gentle hint that guides without giving away the answer
${DIVERSITY_INSTRUCTIONS}

Respond in valid JSON only (no markdown):
{
  "stem": "the question text",
  "answer": "the correct answer",
  ${params.questionType === "multiple_choice" ? '"options": ["option1", "option2", "option3", "option4"],' : ""}
  "explanation": "why this is the correct answer, explained simply",
  "hint": "a helpful hint"
}`;
}

function buildReadingPrompt(params: GenerateQuestionParams): string {
  return `Generate a ${params.difficulty} reading comprehension question for an Australian Year ${params.yearLevel} student.

Skill being assessed: ${params.skillName}
Description: ${params.skillDescription}

Requirements:
- Write a short passage (3-5 sentences for Year 1-3, 5-8 sentences for Year 4-7)
- The passage should be age-appropriate, interesting, and use Australian English
- Use Australian contexts (Australian animals, places, culture, sport)
- Then ask ONE comprehension question about the passage
- Provide exactly 4 multiple-choice options with one correct answer
- Distractors should be plausible but clearly wrong when the passage is read carefully
- Include an explanation that references the specific part of the passage
- Include a hint that guides the student to look at the right part of the passage
${DIVERSITY_INSTRUCTIONS}

Respond in valid JSON only (no markdown):
{
  "stem": "[THE PASSAGE]\\n\\n[THE QUESTION]",
  "answer": "the correct answer",
  "options": ["option1", "option2", "option3", "option4"],
  "explanation": "The answer is found in the passage where it says...",
  "hint": "Look at the second sentence for a clue"
}`;
}

function buildSpellingPrompt(params: GenerateQuestionParams): string {
  return `Generate a ${params.difficulty} spelling question for an Australian Year ${params.yearLevel} student.

Skill being assessed: ${params.skillName}
Description: ${params.skillDescription}

Requirements:
- Use Australian English spelling (colour, favourite, catalogue, etc.)
- Age-appropriate words for Year ${params.yearLevel}
- Choose ONE of these question formats (pick the best fit for the skill):
  a) "Which spelling is correct?" — show 4 options, one correct
  b) "Which word is spelled incorrectly?" — show a sentence with one misspelled word
  c) "Add the correct suffix/prefix to this word" — 4 options
  d) "What is the plural/past tense of [word]?" — 4 options
- Provide exactly 4 options with one correct answer
- Make wrong options reflect common spelling mistakes children actually make
- Include an explanation that teaches the spelling rule
- Include a hint
${DIVERSITY_INSTRUCTIONS}

Respond in valid JSON only (no markdown):
{
  "stem": "the question text",
  "answer": "the correct answer",
  "options": ["option1", "option2", "option3", "option4"],
  "explanation": "the spelling rule explained simply",
  "hint": "a helpful hint"
}`;
}

function buildGrammarPrompt(params: GenerateQuestionParams): string {
  return `Generate a ${params.difficulty} grammar and punctuation question for an Australian Year ${params.yearLevel} student.

Skill being assessed: ${params.skillName}
Description: ${params.skillDescription}

Requirements:
- Use Australian English
- Age-appropriate sentences for Year ${params.yearLevel}
- Choose ONE of these question formats (pick the best fit for the skill):
  a) "Which sentence is correct?" — show 4 versions of a sentence, one grammatically correct
  b) "Choose the correct word to complete the sentence" — fill in the blank
  c) "Where should the [comma/apostrophe/full stop] go?" — 4 placement options
  d) "Which sentence uses the correct tense?" — 4 options
- Provide exactly 4 options with one correct answer
- Make wrong options reflect common grammar mistakes children make
- Include an explanation that teaches the grammar rule clearly
- Include a hint
${DIVERSITY_INSTRUCTIONS}

Respond in valid JSON only (no markdown):
{
  "stem": "the question text",
  "answer": "the correct answer",
  "options": ["option1", "option2", "option3", "option4"],
  "explanation": "the grammar rule explained simply",
  "hint": "a helpful hint"
}`;
}

/**
 * Generates a daily briefing for a parent using Claude.
 */
export async function generateDailyBriefing(params: {
  childName: string;
  focusSkills: { name: string; masteryProbability: number }[];
  recentAccuracy: number;
  streak: number;
}): Promise<{
  summary: string;
  tips: string[];
  conversationScript: string;
}> {
  if (!claude) {
    throw new Error("Claude API client not configured — set ANTHROPIC_API_KEY");
  }

  const response = await claude.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Generate a daily learning briefing for a parent. Keep it warm, encouraging, and actionable.

Child's name: ${params.childName}
Today's focus skills: ${params.focusSkills.map((s) => `${s.name} (${Math.round(s.masteryProbability * 100)}% mastered)`).join(", ")}
Recent accuracy: ${Math.round(params.recentAccuracy * 100)}%
Current streak: ${params.streak} days

Respond in JSON:
{
  "summary": "A 2-3 sentence summary of today's session focus",
  "tips": ["tip 1", "tip 2"],
  "conversationScript": "A specific script the parent can use if their child gets stuck, using the child's name"
}`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return JSON.parse(jsonMatch?.[0] ?? text);
}

function getThemeContext(themeId?: string, interests?: string[]): string {
  if (!themeId || themeId === "default") return "";

  const themes: Record<string, string> = {
    afl: "Wrap the question in an AFL football context (goals, quarters, teams, stadiums).",
    bluey: "Wrap the question in a Bluey cartoon context (Bluey, Bingo, Bandit, Chilli, games they play).",
    superheroes: "Wrap the question in a superhero adventure context (saving the city, using powers, hero missions).",
    space: "Wrap the question in a space exploration context (planets, rockets, astronauts, stars).",
    animals: "Wrap the question in an Australian animals context (kangaroos, koalas, wombats, platypus).",
    golf: "Wrap the question in a golf context (holes, strokes, courses, tournaments).",
  };

  let context = themes[themeId] ?? "";

  if (interests && interests.length > 0) {
    context += ` The child is interested in: ${interests.join(", ")}.`;
  }

  return context ? `\nTheme: ${context}` : "";
}
