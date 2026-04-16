import { claude } from "../lib/claude.js";
import { logger } from "../lib/logger.js";

interface GenerateQuestionParams {
  skillName: string;
  skillDescription: string;
  yearLevel: number;
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
 * Generates a question using Claude API with template-based constraints.
 * Questions are wrapped in thematic contexts based on the child's theme.
 */
export async function generateQuestion(
  params: GenerateQuestionParams,
): Promise<GeneratedQuestion> {
  const themeContext = getThemeContext(params.themeId, params.interests);

  const response = await claude.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Generate a ${params.difficulty} ${params.questionType} maths question for an Australian Year ${params.yearLevel} student.

Skill: ${params.skillName}
Description: ${params.skillDescription}
${themeContext}

Requirements:
- Use Australian English (colour, favourite, maths, etc.)
- Use Australian contexts (AUD currency, km for distance, Australian cities/animals/sports)
- Age-appropriate language for Year ${params.yearLevel} (ages ${params.yearLevel + 5}-${params.yearLevel + 6})
- ${params.questionType === "multiple_choice" ? "Provide exactly 4 options with one correct answer. Make distractors plausible (common misconceptions)." : ""}
- Include a clear, encouraging explanation of the correct answer
- Include a gentle hint that guides without giving away the answer

Respond in valid JSON format:
{
  "stem": "the question text",
  "answer": "the correct answer",
  ${params.questionType === "multiple_choice" ? '"options": ["option1", "option2", "option3", "option4"],' : ""}
  "explanation": "why this is the correct answer, explained simply",
  "hint": "a helpful hint"
}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  try {
    const parsed = JSON.parse(text) as GeneratedQuestion;
    return parsed;
  } catch {
    logger.error("Failed to parse Claude response as JSON", { text });
    throw new Error("Failed to generate valid question content");
  }
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

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  return JSON.parse(text);
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
