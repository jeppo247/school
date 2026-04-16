export type MasteryStatus = "unknown" | "learning" | "almost" | "mastered" | "review";
export type Strand = "number_algebra" | "measurement_geometry" | "statistics_probability";
export type DifficultyBand = "below_level" | "on_level" | "above_level";

export interface SkillNode {
  id: string;
  code: string;
  name: string;
  description?: string;
  yearLevel: number;
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

export interface GapMapNode extends SkillNode {
  masteryStatus: MasteryStatus;
  masteryProbability: number;
  prerequisites: string[];
  dependents: string[];
  isFrontierGap: boolean;
}
