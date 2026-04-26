import type { FrontierGap } from "./types.js";
import type { MasteryStatus } from "@upwise/shared";

interface SkillGraphNode {
  id: string;
  code: string;
  name: string;
  yearLevel: number;
  masteryStatus: MasteryStatus;
  masteryProbability: number;
  prerequisites: string[]; // IDs of prerequisite skills
  dependents: string[]; // IDs of skills that depend on this one
}

/**
 * Detects frontier gaps in the student's knowledge graph.
 *
 * A frontier gap is a skill where:
 * 1. The student has NOT mastered it (learning, almost, or unknown)
 * 2. All prerequisites ARE mastered (or almost mastered)
 * 3. The student is ready to learn it
 *
 * Gaps are prioritised by:
 * - Downstream impact (how many skills are blocked by this gap)
 * - Year-level fit (age-near unknown skills before far-below unknown skills)
 * - Current mastery probability (lower = higher priority)
 */
export function detectFrontierGaps(
  skills: SkillGraphNode[],
  studentYearLevel: number,
): FrontierGap[] {
  const skillMap = new Map(skills.map((s) => [s.id, s]));

  // Count downstream dependents (transitive closure)
  const downstreamCounts = computeDownstreamCounts(skills);

  const frontierGaps: FrontierGap[] = [];

  for (const skill of skills) {
    // Skip already mastered or review skills
    if (skill.masteryStatus === "mastered" || skill.masteryStatus === "review") {
      continue;
    }

    // Skip skills above student's year level
    if (skill.yearLevel > studentYearLevel) {
      continue;
    }

    // Check if all prerequisites are met
    const prerequisitesMet = skill.prerequisites.every((prereqId) => {
      const prereq = skillMap.get(prereqId);
      if (!prereq) return true; // Missing prereq = assume met
      return (
        prereq.masteryStatus === "mastered" ||
        prereq.masteryStatus === "review" ||
        prereq.masteryStatus === "almost"
      );
    });

    if (!prerequisitesMet) continue;

    // Calculate priority score
    const downstreamImpact = downstreamCounts.get(skill.id) ?? 0;
    const yearLevelDistance = studentYearLevel - skill.yearLevel;
    const masteryDeficit = 1 - skill.masteryProbability;
    const ageDistancePenalty = Math.max(0, yearLevelDistance) * 2;

    const priorityScore =
      downstreamImpact * 3 +
      masteryDeficit * 1 -
      ageDistancePenalty;

    frontierGaps.push({
      skillId: skill.id,
      skillCode: skill.code,
      skillName: skill.name,
      yearLevel: skill.yearLevel,
      masteryProbability: skill.masteryProbability,
      priorityScore,
      downstreamImpact,
      yearLevelDistance,
      prerequisitesMet: true,
    });
  }

  // Sort by priority (highest first)
  return frontierGaps.sort((a, b) => b.priorityScore - a.priorityScore);
}

/**
 * Computes how many skills transitively depend on each skill.
 * Used to prioritise gaps that block the most downstream learning.
 */
function computeDownstreamCounts(
  skills: SkillGraphNode[],
): Map<string, number> {
  const counts = new Map<string, number>();

  // Build reverse adjacency list
  const dependentsMap = new Map<string, string[]>();
  for (const skill of skills) {
    if (!dependentsMap.has(skill.id)) {
      dependentsMap.set(skill.id, []);
    }
    for (const depId of skill.dependents) {
      if (!dependentsMap.has(skill.id)) {
        dependentsMap.set(skill.id, []);
      }
      dependentsMap.get(skill.id)!.push(depId);
    }
  }

  // BFS from each node to count transitive dependents
  for (const skill of skills) {
    const visited = new Set<string>();
    const queue = [...(dependentsMap.get(skill.id) ?? [])];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;
      visited.add(current);
      queue.push(...(dependentsMap.get(current) ?? []));
    }

    counts.set(skill.id, visited.size);
  }

  return counts;
}
