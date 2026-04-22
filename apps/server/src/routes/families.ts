import { Router } from "express";
import { db } from "../db/client.js";
import { families, parents, students } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { AppError } from "../middleware/error-handler.js";
import { validate } from "../middleware/validate.js";
import { createFamilySchema, addParentSchema, addChildSchema } from "../schemas/validation.js";

export const familyRoutes = Router();

// POST /families — Create a new family (onboarding step 1)
familyRoutes.post("/", validate(createFamilySchema), async (req, res, next) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) throw new AppError(400, "VALIDATION_ERROR", "name and email required");

    const trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    const [family] = await db.insert(families).values({ name, email, trialEndsAt }).returning();
    res.status(201).json(family);
  } catch (err) {
    next(err);
  }
});

// GET /families/:id — Get family with children
familyRoutes.get("/:id", async (req, res, next) => {
  try {
    const familyId = req.params.id as string;
    const [family] = await db.select().from(families).where(eq(families.id, familyId));
    if (!family) throw new AppError(404, "NOT_FOUND", "Family not found");

    const children = await db.select().from(students).where(eq(students.familyId, family.id));
    const parentList = await db.select().from(parents).where(eq(parents.familyId, family.id));

    const now = new Date();
    const trialActive = family.subscriptionTier === "trial" && family.trialEndsAt && new Date(family.trialEndsAt) > now;
    const isPaid = family.subscriptionTier === "standard" || family.subscriptionTier === "family";
    const hasAccess = trialActive || isPaid;
    const trialDaysLeft = family.trialEndsAt ? Math.max(0, Math.ceil((new Date(family.trialEndsAt).getTime() - now.getTime()) / 86400000)) : 0;

    res.json({ ...family, children, parents: parentList, hasAccess, trialActive, trialDaysLeft });
  } catch (err) {
    next(err);
  }
});

// POST /families/:id/children — Add a child to the family
familyRoutes.post("/:id/children", validate(addChildSchema), async (req, res, next) => {
  try {
    const familyId = req.params.id as string;
    const { name, yearLevel, dateOfBirth, themeId } = req.body;
    if (!name || !yearLevel) throw new AppError(400, "VALIDATION_ERROR", "name and yearLevel required");

    const [child] = await db
      .insert(students)
      .values({
        familyId,
        name,
        yearLevel,
        dateOfBirth,
        themeId: themeId ?? "default",
      })
      .returning();

    res.status(201).json(child);
  } catch (err) {
    next(err);
  }
});

// POST /families/:id/parents — Add a parent to the family
familyRoutes.post("/:id/parents", validate(addParentSchema), async (req, res, next) => {
  try {
    const familyId = req.params.id as string;
    const { name, email, clerkUserId } = req.body;
    if (!name || !email) throw new AppError(400, "VALIDATION_ERROR", "name and email required");

    const [parent] = await db
      .insert(parents)
      .values({
        familyId,
        name,
        email,
        clerkUserId: clerkUserId ?? null,
      })
      .returning();

    res.status(201).json(parent);
  } catch (err) {
    next(err);
  }
});

// PUT /families/:id — Update family details
familyRoutes.put("/:id", async (req, res, next) => {
  try {
    const updates = req.body;
    const [updated] = await db
      .update(families)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(families.id, req.params.id as string))
      .returning();

    if (!updated) throw new AppError(404, "NOT_FOUND", "Family not found");
    res.json(updated);
  } catch (err) {
    next(err);
  }
});
