import { Router } from "express";
import { db } from "../db/client.js";
import { skillNodes, skillPrerequisites, studentSkillStates } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const knowledgeGraphRoutes = Router();

// GET /knowledge-graph — Full graph (all nodes + edges)
knowledgeGraphRoutes.get("/", async (_req, res, next) => {
  try {
    const nodes = await db
      .select()
      .from(skillNodes)
      .where(eq(skillNodes.isActive, true))
      .orderBy(skillNodes.yearLevel, skillNodes.displayOrder);

    const edges = await db.select().from(skillPrerequisites);

    res.json({ nodes, edges });
  } catch (err) {
    next(err);
  }
});

// GET /knowledge-graph/year/:year — Nodes for a year level
knowledgeGraphRoutes.get("/year/:year", async (req, res, next) => {
  try {
    const year = Number(req.params.year);

    const nodes = await db
      .select()
      .from(skillNodes)
      .where(eq(skillNodes.yearLevel, year))
      .orderBy(skillNodes.displayOrder);

    // Get edges where either side is in this year level
    const nodeIds = new Set(nodes.map((n) => n.id));
    const allEdges = await db.select().from(skillPrerequisites);
    const edges = allEdges.filter(
      (e) => nodeIds.has(e.skillId) || nodeIds.has(e.prerequisiteId),
    );

    res.json({ nodes, edges });
  } catch (err) {
    next(err);
  }
});

// GET /students/:id/skill-states — All skill states for a student
knowledgeGraphRoutes.get("/students/:id/skill-states", async (req, res, next) => {
  try {
    const { id } = req.params;

    const states = await db
      .select()
      .from(studentSkillStates)
      .where(eq(studentSkillStates.studentId, id));

    res.json({ states });
  } catch (err) {
    next(err);
  }
});

// GET /students/:id/gap-map — Computed gap map (nodes + states + mastery)
knowledgeGraphRoutes.get("/students/:id/gap-map", async (req, res, next) => {
  try {
    const { id } = req.params;

    const nodes = await db
      .select()
      .from(skillNodes)
      .where(eq(skillNodes.isActive, true))
      .orderBy(skillNodes.yearLevel, skillNodes.displayOrder);

    const edges = await db.select().from(skillPrerequisites);

    const states = await db
      .select()
      .from(studentSkillStates)
      .where(eq(studentSkillStates.studentId, id));

    const stateMap = new Map(states.map((s) => [s.skillId, s]));

    const gapMap = nodes.map((node) => {
      const state = stateMap.get(node.id);
      const prereqs = edges.filter((e) => e.skillId === node.id).map((e) => e.prerequisiteId);
      const dependents = edges.filter((e) => e.prerequisiteId === node.id).map((e) => e.skillId);

      return {
        ...node,
        masteryStatus: state?.masteryStatus ?? "unknown",
        masteryProbability: state?.masteryProbability ?? 0.5,
        totalAttempts: state?.totalAttempts ?? 0,
        correctAttempts: state?.correctAttempts ?? 0,
        lastAssessed: state?.lastAssessed ?? null,
        prerequisites: prereqs,
        dependents,
      };
    });

    // Summary counts
    const summary = {
      total: gapMap.length,
      mastered: gapMap.filter((n) => n.masteryStatus === "mastered" || n.masteryStatus === "review").length,
      learning: gapMap.filter((n) => n.masteryStatus === "learning" || n.masteryStatus === "almost").length,
      unknown: gapMap.filter((n) => n.masteryStatus === "unknown").length,
    };

    res.json({ nodes: gapMap, edges, summary });
  } catch (err) {
    next(err);
  }
});
