import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  real,
  date,
  timestamp,
  jsonb,
  unique,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================================
// FAMILIES & USERS
// ============================================================

export const families = pgTable("families", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkOrgId: text("clerk_org_id").unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  subscriptionTier: text("subscription_tier").default("trial").notNull(),
  subscriptionStatus: text("subscription_status").default("active").notNull(),
  trialEndsAt: timestamp("trial_ends_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const parents = pgTable("parents", {
  id: uuid("id").primaryKey().defaultRandom(),
  familyId: uuid("family_id")
    .notNull()
    .references(() => families.id, { onDelete: "cascade" }),
  clerkUserId: text("clerk_user_id").unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  notificationPrefs: jsonb("notification_prefs")
    .default({ daily_briefing: true, nudges: true, weekly_report: true })
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const students = pgTable(
  "students",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    familyId: uuid("family_id")
      .notNull()
      .references(() => families.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    yearLevel: integer("year_level").notNull(),
    dateOfBirth: date("date_of_birth"),
    avatarUrl: text("avatar_url"),
    themeId: text("theme_id").default("default").notNull(),
    interests: text("interests").array().default([]).notNull(),
    xpTotal: integer("xp_total").default(0).notNull(),
    coinBalance: integer("coin_balance").default(0).notNull(),
    currentStreak: integer("current_streak").default(0).notNull(),
    longestStreak: integer("longest_streak").default(0).notNull(),
    lastSessionDate: date("last_session_date"),
    rewardsMode: text("rewards_mode").default("full").notNull(),
    diagnosticCompleted: boolean("diagnostic_completed").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_students_family").on(table.familyId),
  ],
);

// ============================================================
// KNOWLEDGE GRAPH
// ============================================================

export const skillNodes = pgTable(
  "skill_nodes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: text("code").unique().notNull(),
    name: text("name").notNull(),
    description: text("description"),
    yearLevel: integer("year_level").notNull(),
    domain: text("domain").default("numeracy").notNull(), // reading | writing | spelling | grammar_punctuation | numeracy
    learningArea: text("learning_area").default("mathematics").notNull(), // english | mathematics
    strand: text("strand").notNull(),
    subStrand: text("sub_strand"),
    acaraCode: text("acara_code"),
    acaraDescription: text("acara_description"),
    dokLevel: integer("dok_level").default(1).notNull(),
    difficultyBand: text("difficulty_band").default("on_level").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    displayOrder: integer("display_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_skill_nodes_year").on(table.yearLevel),
    index("idx_skill_nodes_strand").on(table.strand),
    index("idx_skill_nodes_domain").on(table.domain),
  ],
);

export const skillPrerequisites = pgTable(
  "skill_prerequisites",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    skillId: uuid("skill_id")
      .notNull()
      .references(() => skillNodes.id, { onDelete: "cascade" }),
    prerequisiteId: uuid("prerequisite_id")
      .notNull()
      .references(() => skillNodes.id, { onDelete: "cascade" }),
    strength: text("strength").default("required").notNull(),
  },
  (table) => [
    unique("uq_skill_prereq").on(table.skillId, table.prerequisiteId),
    index("idx_skill_prereqs_skill").on(table.skillId),
    index("idx_skill_prereqs_prereq").on(table.prerequisiteId),
  ],
);

// ============================================================
// STUDENT KNOWLEDGE STATE
// ============================================================

export const studentSkillStates = pgTable(
  "student_skill_states",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    skillId: uuid("skill_id")
      .notNull()
      .references(() => skillNodes.id, { onDelete: "cascade" }),
    masteryProbability: real("mastery_probability").default(0.5).notNull(),
    totalAttempts: integer("total_attempts").default(0).notNull(),
    correctAttempts: integer("correct_attempts").default(0).notNull(),
    masteryStatus: text("mastery_status").default("unknown").notNull(),
    lastAssessed: timestamp("last_assessed", { withTimezone: true }),
    nextReview: timestamp("next_review", { withTimezone: true }),
    reviewIntervalDays: integer("review_interval_days").default(1).notNull(),
    easeFactor: real("ease_factor").default(2.5).notNull(),
    sessionsAssessed: integer("sessions_assessed").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    unique("uq_student_skill").on(table.studentId, table.skillId),
    index("idx_sss_student").on(table.studentId),
    index("idx_sss_mastery").on(table.studentId, table.masteryStatus),
    index("idx_sss_review").on(table.studentId, table.nextReview),
  ],
);

// ============================================================
// QUESTIONS & CONTENT
// ============================================================

export const questionTemplates = pgTable(
  "question_templates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    skillId: uuid("skill_id")
      .notNull()
      .references(() => skillNodes.id),
    templateType: text("template_type").notNull(),
    structure: jsonb("structure").notNull(),
    difficultyParam: real("difficulty_param").default(0).notNull(),
    discriminationParam: real("discrimination_param").default(1).notNull(),
    guessingParam: real("guessing_param").default(0.25).notNull(),
    dokLevel: integer("dok_level").default(1).notNull(),
    naplanYearTarget: integer("naplan_year_target"),
    cognitiveProcess: text("cognitive_process"),
    stimulusType: text("stimulus_type"),
    isActive: boolean("is_active").default(true).notNull(),
    usageCount: integer("usage_count").default(0).notNull(),
    avgAccuracy: real("avg_accuracy"),
    createdBy: text("created_by").default("system").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_templates_skill").on(table.skillId),
  ],
);

export const questions = pgTable(
  "questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    templateId: uuid("template_id").references(() => questionTemplates.id),
    skillId: uuid("skill_id")
      .notNull()
      .references(() => skillNodes.id),
    themeId: text("theme_id"),
    content: jsonb("content").notNull(),
    difficultyParam: real("difficulty_param").default(0).notNull(),
    questionType: text("question_type").notNull(),
    naplanYearTarget: integer("naplan_year_target"),
    cognitiveProcess: text("cognitive_process"),
    stimulusType: text("stimulus_type"),
    misconceptionCode: text("misconception_code"),
    distractorMap: jsonb("distractor_map"),
    timeExpectedSec: integer("time_expected_sec"),
    provenance: jsonb("provenance"),
    isValidated: boolean("is_validated").default(false).notNull(),
    validationNotes: text("validation_notes"),
    timesServed: integer("times_served").default(0).notNull(),
    timesCorrect: integer("times_correct").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_questions_skill").on(table.skillId),
    index("idx_questions_theme").on(table.themeId),
    index("idx_questions_difficulty").on(table.skillId, table.difficultyParam),
    index("idx_questions_domain").on(table.naplanYearTarget),
  ],
);

// ============================================================
// SESSIONS & RESPONSES
// ============================================================

export const learningSessions = pgTable(
  "learning_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id),
    sessionType: text("session_type").notNull(),
    status: text("status").default("in_progress").notNull(),
    phase: text("phase").default("warmup").notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    durationSeconds: integer("duration_seconds"),
    totalQuestions: integer("total_questions").default(0).notNull(),
    correctAnswers: integer("correct_answers").default(0).notNull(),
    accuracy: real("accuracy"),
    xpEarned: integer("xp_earned").default(0).notNull(),
    coinsEarned: integer("coins_earned").default(0).notNull(),
    skillsTargeted: uuid("skills_targeted").array().default([]).notNull(),
    parentInvolved: boolean("parent_involved").default(false).notNull(),
    metadata: jsonb("metadata").default({}).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_sessions_student").on(table.studentId),
    index("idx_sessions_date").on(table.studentId, table.startedAt),
  ],
);

export const questionResponses = pgTable(
  "question_responses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => learningSessions.id, { onDelete: "cascade" }),
    questionId: uuid("question_id")
      .notNull()
      .references(() => questions.id),
    skillId: uuid("skill_id")
      .notNull()
      .references(() => skillNodes.id),
    studentAnswer: jsonb("student_answer"),
    correctAnswer: jsonb("correct_answer"),
    isCorrect: boolean("is_correct").notNull(),
    timeTakenMs: integer("time_taken_ms"),
    hintUsed: boolean("hint_used").default(false).notNull(),
    difficultyAtTime: real("difficulty_at_time"),
    abilityEstimateAtTime: real("ability_estimate_at_time"),
    sequenceNumber: integer("sequence_number").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_responses_session").on(table.sessionId),
    index("idx_responses_skill").on(table.skillId),
  ],
);

// ============================================================
// PARENT GUIDE SYSTEM
// ============================================================

export const dailyBriefings = pgTable(
  "daily_briefings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id),
    parentId: uuid("parent_id")
      .notNull()
      .references(() => parents.id),
    briefingDate: date("briefing_date").notNull(),
    content: jsonb("content").notNull(),
    wasRead: boolean("was_read").default(false).notNull(),
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    unique("uq_briefing_date").on(table.studentId, table.briefingDate),
  ],
);

export const parentNudges = pgTable("parent_nudges", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id")
    .notNull()
    .references(() => students.id),
  parentId: uuid("parent_id")
    .notNull()
    .references(() => parents.id),
  sessionId: uuid("session_id").references(() => learningSessions.id),
  nudgeType: text("nudge_type").notNull(),
  content: text("content").notNull(),
  wasSent: boolean("was_sent").default(false).notNull(),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  wasRead: boolean("was_read").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const weeklyReports = pgTable(
  "weekly_reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id),
    familyId: uuid("family_id")
      .notNull()
      .references(() => families.id),
    reportWeek: date("report_week").notNull(),
    content: jsonb("content").notNull(),
    shareToken: text("share_token").unique(),
    pdfUrl: text("pdf_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    unique("uq_weekly_report").on(table.studentId, table.reportWeek),
  ],
);

// ============================================================
// NAPLAN DOMAIN STATES
// ============================================================

export const domainStates = pgTable(
  "domain_states",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    domain: text("domain").notNull(), // reading | writing | spelling | grammar_punctuation | numeracy
    theta: real("theta").default(0).notNull(),
    thetaSe: real("theta_se").default(1).notNull(),
    projectedProficiency: text("projected_proficiency").default("developing").notNull(),
    naplanYearTarget: integer("naplan_year_target").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    unique("uq_student_domain").on(table.studentId, table.domain),
    index("idx_domain_states_student").on(table.studentId),
  ],
);

// ============================================================
// MISCONCEPTION TRACKING
// ============================================================

export const misconceptionEvents = pgTable(
  "misconception_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    skillId: uuid("skill_id")
      .notNull()
      .references(() => skillNodes.id),
    misconceptionCode: text("misconception_code").notNull(),
    itemId: uuid("item_id").references(() => questions.id),
    sessionId: uuid("session_id").references(() => learningSessions.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_misconception_student").on(table.studentId),
    index("idx_misconception_skill").on(table.studentId, table.skillId),
    index("idx_misconception_code").on(table.studentId, table.misconceptionCode),
  ],
);

// ============================================================
// WRITING ASSESSMENT
// ============================================================

export const writingPrompts = pgTable("writing_prompts", {
  id: uuid("id").primaryKey().defaultRandom(),
  genre: text("genre").notNull(), // narrative | persuasive
  title: text("title").notNull(),
  promptText: text("prompt_text").notNull(),
  yearLevelMin: integer("year_level_min").notNull(),
  yearLevelMax: integer("year_level_max").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const writingScores = pgTable(
  "writing_scores",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    attemptId: uuid("attempt_id")
      .notNull()
      .references(() => questionResponses.id, { onDelete: "cascade" }),
    criterion: text("criterion").notNull(), // audience | text_structure | ideas | etc.
    score: integer("score").notNull(),
    maxScore: integer("max_score").notNull(),
    raterType: text("rater_type").notNull(), // ai | human
    raterId: text("rater_id"),
    confidence: real("confidence"),
    feedback: text("feedback"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_writing_scores_attempt").on(table.attemptId),
  ],
);

// ============================================================
// CONSENT & AUDIT
// ============================================================

export const consentRecords = pgTable(
  "consent_records",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    consentType: text("consent_type").notNull(), // data_collection | ai_processing | sharing_with_school
    grantedBy: uuid("granted_by")
      .notNull()
      .references(() => parents.id),
    grantedAt: timestamp("granted_at", { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
  },
  (table) => [
    index("idx_consent_student").on(table.studentId),
  ],
);

export const auditEvents = pgTable(
  "audit_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    actorId: text("actor_id"), // user ID or "system"
    entityType: text("entity_type").notNull(), // student | session | question | report
    entityId: text("entity_id").notNull(),
    action: text("action").notNull(), // create | read | update | delete | export
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_audit_actor").on(table.actorId),
    index("idx_audit_entity").on(table.entityType, table.entityId),
    index("idx_audit_date").on(table.createdAt),
  ],
);

// ============================================================
// THEMES
// ============================================================

export const themes = pgTable("themes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  colorPrimary: text("color_primary").notNull(),
  colorSecondary: text("color_secondary").notNull(),
  colorAccent: text("color_accent").notNull(),
  iconSet: text("icon_set"),
  soundSet: text("sound_set"),
  bgPattern: text("bg_pattern"),
  isActive: boolean("is_active").default(true).notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
});

// ============================================================
// FEEDBACK
// ============================================================

export const feedback = pgTable(
  "feedback",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    familyId: uuid("family_id")
      .notNull()
      .references(() => families.id),
    parentId: uuid("parent_id")
      .notNull()
      .references(() => parents.id),
    category: text("category").default("general").notNull(),
    subject: text("subject").notNull(),
    body: text("body").notNull(),
    status: text("status").default("open").notNull(),
    adminResponse: text("admin_response"),
    respondedAt: timestamp("responded_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_feedback_family").on(table.familyId),
    index("idx_feedback_status").on(table.status),
  ],
);

// ============================================================
// SUBSCRIPTIONS
// ============================================================

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    familyId: uuid("family_id")
      .notNull()
      .references(() => families.id),
    stripeSubscriptionId: text("stripe_subscription_id").unique(),
    tier: text("tier").default("free").notNull(),
    status: text("status").default("active").notNull(),
    currentPeriodStart: timestamp("current_period_start", { withTimezone: true }),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
    cancelAt: timestamp("cancel_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_subscriptions_family").on(table.familyId),
  ],
);

// ============================================================
// GOLD COIN SYSTEM
// ============================================================

export const coinTransactions = pgTable(
  "coin_transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    amount: integer("amount").notNull(),
    type: text("type").notNull(), // 'earn' | 'spend'
    reason: text("reason").notNull(), // CoinRewardReason
    referenceId: text("reference_id"), // session ID, skill ID, or shop item ID
    balanceAfter: integer("balance_after").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_coin_tx_student").on(table.studentId),
    index("idx_coin_tx_date").on(table.studentId, table.createdAt),
  ],
);

export const shopItems = pgTable("shop_items", {
  id: text("id").primaryKey(),
  category: text("category").notNull(), // 'theme' | 'avatar' | 'celebration' | 'sound_pack' | 'brain_break' | 'badge'
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  imageUrl: text("image_url"),
  previewData: jsonb("preview_data"),
  prerequisite: jsonb("prerequisite"), // { minStreak?, minLevel?, requiredBadge? }
  isActive: boolean("is_active").default(true).notNull(),
  isLimited: boolean("is_limited").default(false).notNull(),
  availableFrom: timestamp("available_from", { withTimezone: true }),
  availableUntil: timestamp("available_until", { withTimezone: true }),
  displayOrder: integer("display_order").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const studentPurchases = pgTable(
  "student_purchases",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    itemId: text("item_id")
      .notNull()
      .references(() => shopItems.id),
    transactionId: uuid("transaction_id")
      .references(() => coinTransactions.id),
    purchasedAt: timestamp("purchased_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    unique("uq_student_item").on(table.studentId, table.itemId),
    index("idx_purchases_student").on(table.studentId),
  ],
);

// ============================================================
// WAITLIST
// ============================================================

export const waitlist = pgTable("waitlist", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  name: text("name"),
  source: text("source"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("idx_waitlist_email").on(table.email),
]);

// ============================================================
// RELATIONS
// ============================================================

export const familiesRelations = relations(families, ({ many }) => ({
  parents: many(parents),
  students: many(students),
  subscriptions: many(subscriptions),
  feedback: many(feedback),
  weeklyReports: many(weeklyReports),
}));

export const parentsRelations = relations(parents, ({ one, many }) => ({
  family: one(families, { fields: [parents.familyId], references: [families.id] }),
  dailyBriefings: many(dailyBriefings),
  nudges: many(parentNudges),
  feedback: many(feedback),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  family: one(families, { fields: [students.familyId], references: [families.id] }),
  skillStates: many(studentSkillStates),
  sessions: many(learningSessions),
  briefings: many(dailyBriefings),
  coinTransactions: many(coinTransactions),
  purchases: many(studentPurchases),
}));

export const skillNodesRelations = relations(skillNodes, ({ many }) => ({
  prerequisites: many(skillPrerequisites, { relationName: "skill" }),
  dependents: many(skillPrerequisites, { relationName: "prerequisite" }),
  templates: many(questionTemplates),
  questions: many(questions),
  studentStates: many(studentSkillStates),
}));

export const skillPrerequisitesRelations = relations(skillPrerequisites, ({ one }) => ({
  skill: one(skillNodes, {
    fields: [skillPrerequisites.skillId],
    references: [skillNodes.id],
    relationName: "skill",
  }),
  prerequisite: one(skillNodes, {
    fields: [skillPrerequisites.prerequisiteId],
    references: [skillNodes.id],
    relationName: "prerequisite",
  }),
}));

export const studentSkillStatesRelations = relations(studentSkillStates, ({ one }) => ({
  student: one(students, { fields: [studentSkillStates.studentId], references: [students.id] }),
  skill: one(skillNodes, { fields: [studentSkillStates.skillId], references: [skillNodes.id] }),
}));

export const learningSessionsRelations = relations(learningSessions, ({ one, many }) => ({
  student: one(students, { fields: [learningSessions.studentId], references: [students.id] }),
  responses: many(questionResponses),
  nudges: many(parentNudges),
}));

export const questionResponsesRelations = relations(questionResponses, ({ one }) => ({
  session: one(learningSessions, {
    fields: [questionResponses.sessionId],
    references: [learningSessions.id],
  }),
  question: one(questions, { fields: [questionResponses.questionId], references: [questions.id] }),
  skill: one(skillNodes, { fields: [questionResponses.skillId], references: [skillNodes.id] }),
}));

export const coinTransactionsRelations = relations(coinTransactions, ({ one }) => ({
  student: one(students, { fields: [coinTransactions.studentId], references: [students.id] }),
}));

export const studentPurchasesRelations = relations(studentPurchases, ({ one }) => ({
  student: one(students, { fields: [studentPurchases.studentId], references: [students.id] }),
  item: one(shopItems, { fields: [studentPurchases.itemId], references: [shopItems.id] }),
  transaction: one(coinTransactions, { fields: [studentPurchases.transactionId], references: [coinTransactions.id] }),
}));
