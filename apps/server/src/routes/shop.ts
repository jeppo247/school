import { Router } from "express";
import { db } from "../db/client.js";
import { shopItems, studentPurchases } from "../db/schema.js";
import { eq, and, or, isNull, gte } from "drizzle-orm";
import { getOwnedItems } from "../services/coin-service.js";

export const shopRoutes = Router();

// GET /api/v1/shop/items?studentId=xxx — List all active shop items with ownership status
shopRoutes.get("/items", async (req, res, next) => {
  try {
    const studentId = req.query.studentId as string | undefined;
    const now = new Date();

    // Get active items that are either not limited or within availability window
    const items = await db
      .select()
      .from(shopItems)
      .where(
        and(
          eq(shopItems.isActive, true),
          or(
            eq(shopItems.isLimited, false),
            and(
              or(isNull(shopItems.availableFrom), gte(now, shopItems.availableFrom!)),
              or(isNull(shopItems.availableUntil), gte(shopItems.availableUntil!, now)),
            ),
          ),
        ),
      )
      .orderBy(shopItems.displayOrder);

    // Add ownership status if studentId provided
    let ownedItemIds: string[] = [];
    if (studentId) {
      ownedItemIds = await getOwnedItems(studentId);
    }

    const itemsWithOwnership = items.map((item) => ({
      ...item,
      isOwned: ownedItemIds.includes(item.id),
    }));

    res.json({ items: itemsWithOwnership });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/shop/items/:itemId — Single item detail
shopRoutes.get("/items/:itemId", async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const studentId = req.query.studentId as string | undefined;

    const [item] = await db
      .select()
      .from(shopItems)
      .where(eq(shopItems.id, itemId));

    if (!item) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Item not found" } });
      return;
    }

    let isOwned = false;
    if (studentId) {
      const [purchase] = await db
        .select()
        .from(studentPurchases)
        .where(
          and(
            eq(studentPurchases.studentId, studentId),
            eq(studentPurchases.itemId, itemId),
          ),
        );
      isOwned = !!purchase;
    }

    res.json({ ...item, isOwned });
  } catch (err) {
    next(err);
  }
});
