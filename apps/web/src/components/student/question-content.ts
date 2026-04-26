interface QuestionContentInput {
  stem: string;
  passage?: string | null;
}

interface NormalizedQuestionContent {
  prompt: string;
  passage?: string;
}

export function normalizeQuestionContent({
  stem,
  passage,
}: QuestionContentInput): NormalizedQuestionContent {
  const explicitPassage = passage?.trim();
  const prompt = stem.trim();

  if (explicitPassage) {
    return { prompt, passage: explicitPassage };
  }

  const legacyParts = prompt
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (legacyParts.length < 2) {
    return { prompt };
  }

  return {
    passage: legacyParts.slice(0, -1).join("\n\n"),
    prompt: legacyParts[legacyParts.length - 1],
  };
}
