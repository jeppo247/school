import { db } from "../db/client.js";
import {
  students,
  coinTransactions,
  studentPurchases,
  shopItems,
  studentSkillStates,
  skillNodes,
  learningSessions,
} from "../db/schema.js";
import { eq, and, sql, gte } from "drizzle-orm";
import { logger } from "../lib/logger.js";
import {
  COINS_SESSION_COMPLETE,
  COINS_DIAGNOSTIC_COMPLETE,
  COINS_SKILL_MASTERY,
  COINS_SUB_STRAND_COMPLETE,
  COINS_STRAND_COMPLETE,
  COINS_YEAR_COMPLETE,
  COINS_PERFECT_SESSION,
  COINS_PERFECT_SESSION_MIN_QUESTIONS,
  COINS_WEEKLY_RETURN,
  COINS_LEVEL_UP,
  COINS_STREAK_BONUS,
} from "@upwise/shared";
import type { CoinReward, CoinRewardReason } from "@upwise/shared";

/**
 * Awards coins to a student atomically.
 * Inserts a transaction record and updates the student's balance in a single DB transaction.
 */
export async function awardCoins(
  studentId: string,
  amount: number,
  reason: CoinRewardReason,
  referenceId?: string,
): Promise<number> {
  const result = await db.transaction(async (tx) => {
    // Update balance atomically
    const [updated] = await tx
      .update(students)
      .set({
        coinBalance: sql`${students.coinBalance} + ${amount}`,
        updatedAt: new Date(),
      })
      .where(eq(students.id, studentId))
      .returning({ coinBalance: students.coinBalance });

    if (!updated) {
      throw new Error(`Student ${studentId} not found`);
    }

    // Record the transaction
    await tx.insert(coinTransactions).values({
      studentId,
      amount,
      type: "earn",
      reason,
      referenceId,
      balanceAfter: updated.coinBalance,
    });

    return updated.coinBalance;
  });

  logger.info("Coins awarded", { studentId, amount, reason, referenceId, newBalance: result });
  return result;
}

/**
 * Purchases a shop item for a student.
 * Validates balance, creates negative transaction, and records purchase atomically.
 */
export async function purchaseItem(
  studentId: string,
  itemId: string,
): Promise<{ success: boolean; newBalance: number; error?: string }> {
  return db.transaction(async (tx) => {
    // Get the item
    const [item] = await tx.select().from(shopItems).where(eq(shopItems.id, itemId));
    if (!item) {
      return { success: false, newBalance: 0, error: "Item not found" };
    }
    if (!item.isActive) {
      return { success: false, newBalance: 0, error: "Item is no longer available" };
    }

    // Check limited availability
    if (item.isLimited && item.availableUntil && new Date() > item.availableUntil) {
      return { success: false, newBalance: 0, error: "Item is no longer available" };
    }

    // Check if already owned
    const [existing] = await tx
      .select()
      .from(studentPurchases)
      .where(and(eq(studentPurchases.studentId, studentId), eq(studentPurchases.itemId, itemId)));

    if (existing) {
      return { success: false, newBalance: 0, error: "Item already owned" };
    }

    // Get student balance
    const [student] = await tx
      .select({ coinBalance: students.coinBalance, currentStreak: students.currentStreak })
      .from(students)
      .where(eq(students.id, studentId));

    if (!student) {
      return { success: false, newBalance: 0, error: "Student not found" };
    }

    if (student.coinBalance < item.price) {
      return { success: false, newBalance: student.coinBalance, error: "Insufficient coins" };
    }

    // Check prerequisites
    if (item.prerequisite) {
      const prereq = item.prerequisite as { minStreak?: number; minLevel?: number };
      if (prereq.minStreak && student.currentStreak < prereq.minStreak) {
        return { success: false, newBalance: student.coinBalance, error: `Requires ${prereq.minStreak}-day streak` };
      }
    }

    // Deduct balance
    const newBalance = student.coinBalance - item.price;
    await tx
      .update(students)
      .set({ coinBalance: newBalance, updatedAt: new Date() })
      .where(eq(students.id, studentId));

    // Record transaction
    const [coinTx] = await tx
      .insert(coinTransactions)
      .values({
        studentId,
        amount: -item.price,
        type: "spend",
        reason: "shop_purchase",
        referenceId: itemId,
        balanceAfter: newBalance,
      })
      .returning({ id: coinTransactions.id });

    // Record purchase
    await tx.insert(studentPurchases).values({
      studentId,
      itemId,
      transactionId: coinTx.id,
    });

    logger.info("Item purchased", { studentId, itemId, price: item.price, newBalance });
    return { success: true, newBalance };
  });
}

/**
 * Calculates all coin rewards earned at end of a session.
 */
export async function calculateSessionRewards(
  studentId: string,
  sessionId: string,
  sessionType: string,
  totalQuestions: number,
  correctAnswers: number,
  skillsMastered: string[],
  previousLevel: number,
  newLevel: number,
  previousStreak: number,
  newStreak: number,
): Promise<CoinReward[]> {
  const rewards: CoinReward[] = [];

  // Session completion
  rewards.push({
    reason: "session_complete",
    amount: COINS_SESSION_COMPLETE,
    label: "Session complete",
    referenceId: sessionId,
  });

  // Diagnostic completion
  if (sessionType === "diagnostic") {
    rewards.push({
      reason: "diagnostic_complete",
      amount: COINS_DIAGNOSTIC_COMPLETE,
      label: "Diagnostic complete",
      referenceId: sessionId,
    });
  }

  // Perfect session
  if (
    totalQuestions >= COINS_PERFECT_SESSION_MIN_QUESTIONS &&
    correctAnswers === totalQuestions
  ) {
    rewards.push({
      reason: "perfect_session",
      amount: COINS_PERFECT_SESSION,
      label: "Perfect session!",
      referenceId: sessionId,
    });
  }

  // Skill mastery rewards
  for (const skillId of skillsMastered) {
    rewards.push({
      reason: "skill_mastery",
      amount: COINS_SKILL_MASTERY,
      label: "Skill mastered",
      referenceId: skillId,
    });
  }

  // Check for sub-strand, strand, and year completion
  if (skillsMastered.length > 0) {
    const milestoneRewards = await checkMilestoneRewards(studentId);
    rewards.push(...milestoneRewards);
  }

  // Level up
  if (newLevel > previousLevel) {
    rewards.push({
      reason: "level_up",
      amount: COINS_LEVEL_UP * (newLevel - previousLevel),
      label: `Level ${newLevel}!`,
    });
  }

  // Streak milestones
  for (const [milestone, coins] of Object.entries(COINS_STREAK_BONUS)) {
    const m = Number(milestone);
    if (newStreak >= m && previousStreak < m) {
      rewards.push({
        reason: "streak_milestone",
        amount: coins,
        label: `${m}-day streak!`,
      });
    }
  }

  // Weekly return (first session of the week)
  const isFirstThisWeek = await checkFirstSessionOfWeek(studentId, sessionId);
  if (isFirstThisWeek) {
    rewards.push({
      reason: "weekly_return",
      amount: COINS_WEEKLY_RETURN,
      label: "Welcome back this week!",
    });
  }

  return rewards;
}

/**
 * Checks if a student has completed all skills in a sub-strand, strand, or year level.
 * Returns coin rewards for any newly completed milestones.
 */
async function checkMilestoneRewards(studentId: string): Promise<CoinReward[]> {
  const rewards: CoinReward[] = [];

  // Get all skill states for this student joined with skill info
  const states = await db
    .select({
      skillId: studentSkillStates.skillId,
      masteryStatus: studentSkillStates.masteryStatus,
      yearLevel: skillNodes.yearLevel,
      strand: skillNodes.strand,
      subStrand: skillNodes.subStrand,
    })
    .from(studentSkillStates)
    .innerJoin(skillNodes, eq(studentSkillStates.skillId, skillNodes.id))
    .where(eq(studentSkillStates.studentId, studentId));

  // Group by sub-strand
  const subStrandGroups = new Map<string, { total: number; mastered: number }>();
  const strandGroups = new Map<string, { total: number; mastered: number }>();
  const yearGroups = new Map<number, { total: number; mastered: number }>();

  for (const state of states) {
    const isMastered = state.masteryStatus === "mastered" || state.masteryStatus === "review";
    const subKey = `${state.yearLevel}-${state.strand}-${state.subStrand}`;
    const strandKey = `${state.yearLevel}-${state.strand}`;

    // Sub-strand
    if (!subStrandGroups.has(subKey)) subStrandGroups.set(subKey, { total: 0, mastered: 0 });
    const sub = subStrandGroups.get(subKey)!;
    sub.total++;
    if (isMastered) sub.mastered++;

    // Strand
    if (!strandGroups.has(strandKey)) strandGroups.set(strandKey, { total: 0, mastered: 0 });
    const strand = strandGroups.get(strandKey)!;
    strand.total++;
    if (isMastered) strand.mastered++;

    // Year level
    if (!yearGroups.has(state.yearLevel)) yearGroups.set(state.yearLevel, { total: 0, mastered: 0 });
    const year = yearGroups.get(state.yearLevel)!;
    year.total++;
    if (isMastered) year.mastered++;
  }

  // Check sub-strand completion
  for (const [key, group] of subStrandGroups) {
    if (group.total > 0 && group.mastered === group.total) {
      // Check if we already awarded this milestone
      const alreadyAwarded = await hasBeenAwarded(studentId, "sub_strand_complete", key);
      if (!alreadyAwarded) {
        rewards.push({
          reason: "sub_strand_complete",
          amount: COINS_SUB_STRAND_COMPLETE,
          label: "Sub-strand complete!",
          referenceId: key,
        });
      }
    }
  }

  // Check strand completion
  for (const [key, group] of strandGroups) {
    if (group.total > 0 && group.mastered === group.total) {
      const alreadyAwarded = await hasBeenAwarded(studentId, "strand_complete", key);
      if (!alreadyAwarded) {
        rewards.push({
          reason: "strand_complete",
          amount: COINS_STRAND_COMPLETE,
          label: "Strand complete!",
          referenceId: key,
        });
      }
    }
  }

  // Check year level completion
  for (const [yearLevel, group] of yearGroups) {
    if (group.total > 0 && group.mastered === group.total) {
      const alreadyAwarded = await hasBeenAwarded(studentId, "year_complete", String(yearLevel));
      if (!alreadyAwarded) {
        rewards.push({
          reason: "year_complete",
          amount: COINS_YEAR_COMPLETE,
          label: `Year ${yearLevel} complete!`,
          referenceId: String(yearLevel),
        });
      }
    }
  }

  return rewards;
}

/**
 * Checks if a specific milestone reward has already been awarded.
 */
async function hasBeenAwarded(
  studentId: string,
  reason: CoinRewardReason,
  referenceId: string,
): Promise<boolean> {
  const [existing] = await db
    .select({ id: coinTransactions.id })
    .from(coinTransactions)
    .where(
      and(
        eq(coinTransactions.studentId, studentId),
        eq(coinTransactions.reason, reason),
        eq(coinTransactions.referenceId, referenceId),
      ),
    )
    .limit(1);

  return !!existing;
}

/**
 * Checks if this is the student's first session of the current week (Mon-Sun).
 */
async function checkFirstSessionOfWeek(
  studentId: string,
  currentSessionId: string,
): Promise<boolean> {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - mondayOffset);
  monday.setHours(0, 0, 0, 0);

  const [earlier] = await db
    .select({ id: learningSessions.id })
    .from(learningSessions)
    .where(
      and(
        eq(learningSessions.studentId, studentId),
        eq(learningSessions.status, "completed"),
        gte(learningSessions.completedAt, monday),
      ),
    )
    .limit(1);

  // If the only completed session this week is the current one, it's the first
  return !earlier || earlier.id === currentSessionId;
}

/**
 * Gets the coin balance for a student.
 */
export async function getBalance(studentId: string): Promise<number> {
  const [student] = await db
    .select({ coinBalance: students.coinBalance })
    .from(students)
    .where(eq(students.id, studentId));

  return student?.coinBalance ?? 0;
}

/**
 * Gets all item IDs owned by a student.
 */
export async function getOwnedItems(studentId: string): Promise<string[]> {
  const purchases = await db
    .select({ itemId: studentPurchases.itemId })
    .from(studentPurchases)
    .where(eq(studentPurchases.studentId, studentId));

  return purchases.map((p) => p.itemId);
}

/**
 * Gets transaction history for a student (paginated).
 */
export async function getTransactionHistory(
  studentId: string,
  limit = 20,
  offset = 0,
) {
  return db
    .select()
    .from(coinTransactions)
    .where(eq(coinTransactions.studentId, studentId))
    .orderBy(sql`${coinTransactions.createdAt} DESC`)
    .limit(limit)
    .offset(offset);
}
