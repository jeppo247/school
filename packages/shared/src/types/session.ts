export type SessionType = "diagnostic" | "daily" | "review";
export type SessionStatus = "in_progress" | "completed" | "abandoned";
export type SessionPhase = "warmup" | "focus_1" | "brain_break" | "focus_2" | "wrapup";

export interface LearningSession {
  id: string;
  studentId: string;
  sessionType: SessionType;
  status: SessionStatus;
  phase: SessionPhase;
  startedAt: string;
  completedAt?: string;
  durationSeconds?: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracy?: number;
  xpEarned: number;
  coinsEarned: number;
  skillsTargeted: string[];
  parentInvolved: boolean;
}

export interface QuestionResponse {
  id: string;
  sessionId: string;
  questionId: string;
  skillId: string;
  studentAnswer: unknown;
  correctAnswer: unknown;
  isCorrect: boolean;
  timeTakenMs?: number;
  hintUsed: boolean;
  difficultyAtTime: number;
  abilityEstimateAtTime: number;
  sequenceNumber: number;
}

export interface SessionSummary {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  xpEarned: number;
  coinsEarned: number;
  coinRewards: import("./coins.js").CoinReward[];
  skillsWorked: string[];
  skillsMastered: string[];
  streakContinued: boolean;
  newStreak: number;
  durationMinutes: number;
}
