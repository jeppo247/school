// Adaptive engine tuning constants

/** Target accuracy rate for optimal learning engagement (80-82%) */
export const TARGET_ACCURACY = 0.81;

/** Accuracy band: below this, decrease difficulty */
export const ACCURACY_FLOOR = 0.75;

/** Accuracy band: above this, increase difficulty */
export const ACCURACY_CEILING = 0.87;

/** Difficulty step size when adjusting */
export const DIFFICULTY_STEP = 0.3;

/** Minimum questions for mastery consideration */
export const MASTERY_MIN_ATTEMPTS = 8;

/** Minimum distinct sessions for mastery */
export const MASTERY_MIN_SESSIONS = 2;

/** Mastery probability threshold */
export const MASTERY_THRESHOLD = 0.85;

/** Mastery accuracy threshold */
export const MASTERY_ACCURACY = 0.85;

/** Sliding window size for rolling accuracy */
export const ROLLING_WINDOW_SIZE = 10;

/** Diagnostic: min questions before termination */
export const DIAGNOSTIC_MIN_QUESTIONS = 20;

/** Diagnostic: max questions */
export const DIAGNOSTIC_MAX_QUESTIONS = 30;

/** Diagnostic: standard error threshold for early termination */
export const DIAGNOSTIC_SE_THRESHOLD = 0.3;

// BKT parameters
/** Probability of correct answer when skill is mastered */
export const BKT_P_CORRECT_GIVEN_MASTERED = 0.95;

/** Probability of correct answer when skill is NOT mastered (guess rate) */
export const BKT_P_CORRECT_GIVEN_UNMASTERED = 0.25;

// Spaced repetition (SM-2)
/** Initial review interval in days */
export const SR_INITIAL_INTERVAL = 1;

/** Default ease factor */
export const SR_DEFAULT_EASE = 2.5;

/** Minimum ease factor */
export const SR_MIN_EASE = 1.3;

/** Maximum ease factor */
export const SR_MAX_EASE = 3.0;

/** Ease adjustment on successful review */
export const SR_EASE_BONUS = 0.1;

/** Ease penalty on failed review */
export const SR_EASE_PENALTY = 0.3;

// XP system
/** XP per correct answer (base) */
export const XP_PER_CORRECT = 10;

/** XP multiplier per difficulty level */
export const XP_DIFFICULTY_MULTIPLIER = 5;

/** Bonus XP for streak milestones */
export const XP_STREAK_BONUS: Record<number, number> = {
  5: 25,
  10: 50,
  20: 100,
  50: 250,
};

/** XP required per level (level * this value) */
export const XP_PER_LEVEL = 200;

// IRT grid
/** Minimum theta value */
export const IRT_THETA_MIN = -3;

/** Maximum theta value */
export const IRT_THETA_MAX = 3;

/** Theta grid step size */
export const IRT_THETA_STEP = 0.1;

// Session structure
/** Maximum focus block duration in minutes before a mandatory break */
export const MAX_BLOCK_DURATION_MINUTES = 20;

/** Brain break duration in minutes */
export const BRAIN_BREAK_DURATION_MINUTES = 3;
