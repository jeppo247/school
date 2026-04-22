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

/** XP required per level (level * this value) */
export const XP_PER_LEVEL = 200;

// IRT grid
/** Minimum theta value */
export const IRT_THETA_MIN = -3;

/** Maximum theta value */
export const IRT_THETA_MAX = 3;

/** Theta grid step size */
export const IRT_THETA_STEP = 0.1;

// Gold coin rewards — mastery-linked only (research: child-incentives.md)
// Coins are ONLY awarded for verified mastery events, never for activity/login/streaks.

/** Coins for completing the diagnostic assessment */
export const COINS_DIAGNOSTIC_COMPLETE = 15;

/** Coins for first mastery of a skill (core earn event) */
export const COINS_SKILL_MASTERY = 10;

/** Coins for closing a previously-failed skill gap (highest-value learning event) */
export const COINS_GAP_CLOSURE = 15;

/** Coins for successful spaced review within the due window */
export const COINS_DUE_REVIEW_SUCCESS = 3;

/** Coins for completing all skills in a sub-strand */
export const COINS_SUB_STRAND_COMPLETE = 25;

/** Coins for completing all skills in a strand */
export const COINS_STRAND_COMPLETE = 50;

/** Coins for completing all skills in a year level */
export const COINS_YEAR_COMPLETE = 100;

/** Coins for leveling up (XP level) */
export const COINS_LEVEL_UP = 5;

/** Maximum coins earnable in a single day (anti-gaming) */
export const COINS_DAILY_CAP = 80;

/** Independence multiplier: reduces award when hints are used */
export const INDEPENDENCE_MULTIPLIER = {
  noHints: 1.0,
  oneHint: 0.75,
  twoOrMoreHints: 0.5,
};

/** Days of inactivity before streak resets (grace period) */
export const STREAK_GRACE_DAYS = 3;

// Session structure
/** Maximum focus block duration in minutes before a mandatory break */
export const MAX_BLOCK_DURATION_MINUTES = 20;

/** Brain break duration in minutes */
export const BRAIN_BREAK_DURATION_MINUTES = 3;
