export type QuestionType = "multiple_choice" | "numeric_input" | "true_false" | "drag_drop";

export interface QuestionContent {
  stem: string;
  answer: string | number;
  options?: string[];
  explanation?: string;
  hint?: string;
  imageUrl?: string;
}

export interface Question {
  id: string;
  templateId?: string;
  skillId: string;
  themeId?: string;
  content: QuestionContent;
  difficultyParam: number;
  questionType: QuestionType;
  isValidated: boolean;
  timesServed: number;
  timesCorrect: number;
  createdAt: string;
}

export interface QuestionTemplate {
  id: string;
  skillId: string;
  templateType: QuestionType;
  structure: Record<string, unknown>;
  difficultyParam: number;
  discriminationParam: number;
  guessingParam: number;
  dokLevel: number;
  isActive: boolean;
  usageCount: number;
  avgAccuracy?: number;
  createdBy: string;
}
