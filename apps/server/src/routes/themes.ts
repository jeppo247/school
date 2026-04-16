import { Router } from "express";
import { db } from "../db/client.js";
import { themes } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const themeRoutes = Router();

// GET /themes — List all active themes
themeRoutes.get("/", async (_req, res, next) => {
  try {
    const allThemes = await db
      .select()
      .from(themes)
      .where(eq(themes.isActive, true))
      .orderBy(themes.displayOrder);

    res.json({ themes: allThemes });
  } catch (err) {
    next(err);
  }
});

// GET /themes/:id — Get a single theme
themeRoutes.get("/:id", async (req, res, next) => {
  try {
    const [theme] = await db.select().from(themes).where(eq(themes.id, req.params.id));
    if (!theme) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Theme not found" } });
      return;
    }
    res.json(theme);
  } catch (err) {
    next(err);
  }
});
