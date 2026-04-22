import { Router } from "express";
import { db } from "../db/client.js";
import { waitlist } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { validate } from "../middleware/validate.js";

const waitlistSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().max(100).optional(),
  source: z.string().max(50).optional(),
});

export const waitlistRoutes = Router();

waitlistRoutes.post("/", validate(waitlistSchema), async (req, res, next) => {
  try {
    const { email, name, source } = req.body;

    // Check for duplicate
    const [existing] = await db
      .select({ id: waitlist.id })
      .from(waitlist)
      .where(eq(waitlist.email, email.toLowerCase()));

    if (existing) {
      return res.json({ success: true, message: "You're already on the list!" });
    }

    await db.insert(waitlist).values({
      email: email.toLowerCase(),
      name: name || null,
      source: source || null,
    });

    res.status(201).json({ success: true, message: "You're on the list!" });
  } catch (err) {
    next(err);
  }
});
