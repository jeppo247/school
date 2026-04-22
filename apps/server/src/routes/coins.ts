import { Router } from "express";
import {
  getBalance,
  getTransactionHistory,
  purchaseItem,
  getOwnedItems,
} from "../services/coin-service.js";
import { AppError } from "../middleware/error-handler.js";
import { validate } from "../middleware/validate.js";
import { purchaseItemSchema } from "../schemas/validation.js";

export const coinRoutes = Router();

// GET /api/v1/coins/:studentId — Get coin balance and recent transactions
coinRoutes.get("/:studentId", async (req, res, next) => {
  try {
    const studentId = req.params.studentId as string;
    const [balance, transactions, ownedItems] = await Promise.all([
      getBalance(studentId),
      getTransactionHistory(studentId, 10),
      getOwnedItems(studentId),
    ]);

    res.json({ balance, recentTransactions: transactions, ownedItems });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/coins/:studentId/history — Paginated transaction history
coinRoutes.get("/:studentId/history", async (req, res, next) => {
  try {
    const studentId = req.params.studentId as string;
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const offset = Number(req.query.offset) || 0;

    const transactions = await getTransactionHistory(studentId, limit, offset);
    res.json({ transactions, limit, offset });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/coins/:studentId/purchase — Purchase a shop item
coinRoutes.post("/:studentId/purchase", validate(purchaseItemSchema), async (req, res, next) => {
  try {
    const studentId = req.params.studentId as string;
    const { itemId } = req.body;

    if (!itemId || typeof itemId !== "string") {
      throw new AppError(400, "VALIDATION_ERROR", "itemId is required");
    }

    const result = await purchaseItem(studentId, itemId);

    if (!result.success) {
      throw new AppError(400, "PURCHASE_FAILED", result.error ?? "Purchase failed");
    }

    res.json({ success: true, newBalance: result.newBalance });
  } catch (err) {
    next(err);
  }
});
