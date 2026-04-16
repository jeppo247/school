import type { CognitiveProcess, StimulusType } from "./knowledge-graph";

export type QuestionType =
  | "multiple_choice"
  | "multi_select"
  | "numeric_input"
  | "true_false"
  | "drag_drop"
  | "hot_text"
  | "inline_choice"
  | "gap_match"
  | "extended_text"
  | "audio_dictation";

export interface QuestionContent {
  stem: string;
  answer: string | number;
  options?: string[];
  explanation?: string;
  hint?: string;
  imageUrl?: string;
  passage?: string;
  audioUrl?: string;
}

export interface DistractorMap {
  [option: string]: string; // option label → misconception_code or "correct"
}

export interface ItemProvenance {
  origin: "internal_generated" | "human_authored" | "human_reviewed" | "imported";
  reviewStatus: "draft" | "pending_review" | "approved" | "rejected";
  reviewer?: string;
  approvedAt?: string;
}

export interface Question {
  id: string;
  templateId?: string;
  skillId: string;
  themeId?: string;
  content: QuestionContent;
  difficultyParam: number;
  questionType: QuestionType;
  naplanYearTarget?: number;
  cognitiveProcess?: CognitiveProcess;
  stimulusType?: StimulusType;
  misconceptionCode?: string;
  distractorMap?: DistractorMap;
  timeExpectedSec?: number;
  provenance?: ItemProvenance;
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
  naplanYearTarget?: number;
  cognitiveProcess?: CognitiveProcess;
  stimulusType?: StimulusType;
  isActive: boolean;
  usageCount: number;
  avgAccuracy?: number;
  createdBy: string;
}
