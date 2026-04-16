export type MasteryStatus = "unknown" | "learning" | "almost" | "mastered" | "review";
export type NaplanDomain = "reading" | "writing" | "spelling" | "grammar_punctuation" | "numeracy";
export type LearningArea = "english" | "mathematics";
export type NaplanProficiency = "exceeding" | "strong" | "developing" | "needs_additional_support";

export type Strand =
  // Mathematics
  | "number_algebra"
  | "measurement_geometry"
  | "statistics_probability"
  // English
  | "literacy"
  | "language"
  | "literature";

export type DifficultyBand = "below_level" | "on_level" | "above_level";

export type CognitiveProcess =
  | "locate"
  | "infer"
  | "analyse"
  | "fluency"
  | "reasoning"
  | "problem_solving";

export type StimulusType =
  | "narrative_text"
  | "informative_text"
  | "table"
  | "chart"
  | "diagram"
  | "word_problem"
  | "prompt"
  | "audio";

export interface SkillNode {
  id: string;
  code: string;
  name: string;
  description?: string;
  yearLevel: number;
  domain: NaplanDomain;
  learningArea: LearningArea;
  strand: Strand;
  subStrand?: string;
  acaraCode?: string;
  acaraDescription?: string;
  dokLevel: number;
  difficultyBand: DifficultyBand;
  isActive: boolean;
  displayOrder: number;
}

export interface SkillPrerequisite {
  id: string;
  skillId: string;
  prerequisiteId: string;
  strength: "required" | "recommended";
}

export interface StudentSkillState {
  id: string;
  studentId: string;
  skillId: string;
  masteryProbability: number;
  totalAttempts: number;
  correctAttempts: number;
  masteryStatus: MasteryStatus;
  lastAssessed?: string;
  nextReview?: string;
  reviewIntervalDays: number;
  easeFactor: number;
  sessionsAssessed: number;
}

export interface StudentDomainState {
  id: string;
  studentId: string;
  domain: NaplanDomain;
  theta: number;
  thetaSe: number;
  projectedProficiency: NaplanProficiency;
  naplanYearTarget: number;
  updatedAt: string;
}

export interface GapMapNode extends SkillNode {
  masteryStatus: MasteryStatus;
  masteryProbability: number;
  prerequisites: string[];
  dependents: string[];
  isFrontierGap: boolean;
}
