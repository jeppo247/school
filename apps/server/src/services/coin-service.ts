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
  COINS_DIAGNOSTIC_COMPLETE,
  COINS_SKILL_MASTERY,
  COINS_GAP_CLOSURE,
  COINS_DUE_REVIEW_SUCCESS,
  COINS_SUB_STRAND_COMPLETE,
  COINS_STRAND_COMPLETE,
  COINS_YEAR_COMPLETE,
  COINS_LEVEL_UP,
  COINS_DAILY_CAP,
  INDEPENDENCE_MULTIPLIER,
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
 * Research-aligned: only mastery events earn coins. No activity, login, or streak rewards.
 */
export async function calculateSessionRewards(
  studentId: string,
  sessionId: string,
  sessionType: string,
  skillsMastered: { skillId: string; hintsUsed: number; wasGapClosure: boolean }[],
  dueReviewsSucceeded: number,
  previousLevel: number,
  newLevel: number,
): Promise<CoinReward[]> {
  const rewards: CoinReward[] = [];

  // Check daily cap
  const todayEarned = await getDailyEarnings(studentId);
  let remaining = Math.max(0, COINS_DAILY_CAP - todayEarned);

  function addReward(reward: CoinReward) {
    if (remaining <= 0) return;
    const capped = Math.min(reward.amount, remaining);
    rewards.push({ ...reward, amount: capped });
    remaining -= capped;
  }

  // Diagnostic completion (one-time mastery benchmark)
  if (sessionType === "diagnostic") {
    addReward({
      reason: "diagnostic_complete",
      amount: COINS_DIAGNOSTIC_COMPLETE,
      label: "Diagnostic complete",
      referenceId: sessionId,
    });
  }

  // Skill mastery rewards (with independence multiplier)
  for (const skill of skillsMastered) {
    const multiplier = skill.hintsUsed === 0
      ? INDEPENDENCE_MULTIPLIER.noHints
      : skill.hintsUsed === 1
        ? INDEPENDENCE_MULTIPLIER.oneHint
        : INDEPENDENCE_MULTIPLIER.twoOrMoreHints;

    if (skill.wasGapClosure) {
      addReward({
        reason: "gap_closure",
        amount: Math.ceil(COINS_GAP_CLOSURE * multiplier),
        label: "Gap closed!",
        referenceId: skill.skillId,
      });
    } else {
      addReward({
        reason: "skill_mastery",
        amount: Math.ceil(COINS_SKILL_MASTERY * multiplier),
        label: "Skill mastered",
        referenceId: skill.skillId,
      });
    }
  }

  // Due review successes (small, bounded reward for retention)
  if (dueReviewsSucceeded > 0) {
    addReward({
      reason: "due_review_success",
      amount: COINS_DUE_REVIEW_SUCCESS * dueReviewsSucceeded,
      label: `${dueReviewsSucceeded} review${dueReviewsSucceeded > 1 ? "s" : ""} passed`,
      referenceId: sessionId,
    });
  }

  // Check for sub-strand, strand, and year completion
  if (skillsMastered.length > 0) {
    const milestoneRewards = await checkMilestoneRewards(studentId);
    for (const mr of milestoneRewards) {
      addReward(mr);
    }
  }

  // Level up
  if (newLevel > previousLevel) {
    addReward({
      reason: "level_up",
      amount: COINS_LEVEL_UP * (newLevel - previousLevel),
      label: `Level ${newLevel}!`,
    });
  }

  return rewards;
}

/**
 * Gets total coins earned today (for daily cap enforcement).
 */
async function getDailyEarnings(studentId: string): Promise<number> {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [result] = await db
    .select({ total: sql<number>`COALESCE(SUM(${coinTransactions.amount}), 0)` })
    .from(coinTransactions)
    .where(
      and(
        eq(coinTransactions.studentId, studentId),
        eq(coinTransactions.type, "earn"),
        gte(coinTransactions.createdAt, todayStart),
      ),
    );

  return result?.total ?? 0;
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
