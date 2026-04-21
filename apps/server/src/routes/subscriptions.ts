import { Router } from "express";
import { db } from "../db/client.js";
import { families, subscriptions } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { stripe } from "../lib/stripe.js";
import { AppError } from "../middleware/error-handler.js";
import { logger } from "../lib/logger.js";

export const subscriptionRoutes = Router();

const PRICE_IDS: Record<string, string> = {
  standard: process.env.STRIPE_PRICE_STANDARD ?? "",
  family: process.env.STRIPE_PRICE_FAMILY ?? "",
};

const FRONTEND_URL = process.env.FRONTEND_URL ?? "https://upwiseweb-production.up.railway.app";

// POST /subscriptions/checkout — Create a Stripe Checkout session
subscriptionRoutes.post("/checkout", async (req, res, next) => {
  try {
    if (!stripe) throw new AppError(500, "STRIPE_NOT_CONFIGURED", "Stripe is not configured");

    const { familyId, tier } = req.body;
    if (!tier || !["standard", "family"].includes(tier)) {
      throw new AppError(400, "VALIDATION_ERROR", "tier must be 'standard' or 'family'");
    }

    const priceId = PRICE_IDS[tier];
    if (!priceId) {
      throw new AppError(500, "PRICE_NOT_CONFIGURED", `Stripe price ID not configured for ${tier}. Set STRIPE_PRICE_STANDARD and STRIPE_PRICE_FAMILY env vars.`);
    }

    // Get or create Stripe customer
    let customerId: string | undefined;
    if (familyId) {
      const [family] = await db.select().from(families).where(eq(families.id, familyId));
      if (family?.stripeCustomerId) {
        customerId = family.stripeCustomerId;
      } else if (family) {
        const customer = await stripe.customers.create({
          email: family.email,
          name: family.name,
          metadata: { familyId: family.id },
        });
        customerId = customer.id;
        await db.update(families).set({ stripeCustomerId: customer.id }).where(eq(families.id, familyId));
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${FRONTEND_URL}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/subscribe/cancel`,
      metadata: { familyId: familyId ?? "", tier },
      subscription_data: {
        metadata: { familyId: familyId ?? "", tier },
        trial_period_days: 7,
      },
    });

    logger.info("Checkout session created", { familyId, tier, sessionId: session.id });
    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    next(err);
  }
});

// GET /subscriptions/:familyId — Get current subscription status
subscriptionRoutes.get("/:familyId", async (req, res, next) => {
  try {
    const { familyId } = req.params;

    const [family] = await db.select().from(families).where(eq(families.id, familyId));
    if (!family) throw new AppError(404, "NOT_FOUND", "Family not found");

    const [sub] = await db.select().from(subscriptions).where(eq(subscriptions.familyId, familyId));

    const now = new Date();
    const trialActive = family.subscriptionTier === "trial" && family.trialEndsAt && new Date(family.trialEndsAt) > now;
    const isPaid = family.subscriptionTier === "standard" || family.subscriptionTier === "family";
    const hasAccess = trialActive || isPaid;

    res.json({
      tier: family.subscriptionTier,
      status: family.subscriptionStatus,
      hasAccess,
      trialActive,
      trialEndsAt: family.trialEndsAt,
      subscription: sub ?? null,
    });
  } catch (err) {
    next(err);
  }
});

// POST /subscriptions/:familyId/portal — Get Stripe Customer Portal link
subscriptionRoutes.post("/:familyId/portal", async (req, res, next) => {
  try {
    if (!stripe) throw new AppError(500, "STRIPE_NOT_CONFIGURED", "Stripe is not configured");

    const { familyId } = req.params;
    const [family] = await db.select().from(families).where(eq(families.id, familyId));

    if (!family?.stripeCustomerId) {
      throw new AppError(400, "NO_CUSTOMER", "No Stripe customer found for this family");
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: family.stripeCustomerId,
      return_url: `${FRONTEND_URL}/parent-dashboard`,
    });

    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
});

// POST /subscriptions/:familyId/cancel — Cancel subscription
subscriptionRoutes.post("/:familyId/cancel", async (req, res, next) => {
  try {
    if (!stripe) throw new AppError(500, "STRIPE_NOT_CONFIGURED", "Stripe is not configured");

    const [sub] = await db.select().from(subscriptions).where(eq(subscriptions.familyId, req.params.familyId));
    if (!sub?.stripeSubscriptionId) {
      throw new AppError(400, "NO_SUBSCRIPTION", "No active subscription found");
    }

    await stripe.subscriptions.update(sub.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    await db.update(subscriptions).set({
      status: "cancelling",
      updatedAt: new Date(),
    }).where(eq(subscriptions.id, sub.id));

    logger.info("Subscription cancellation requested", { familyId: req.params.familyId });
    res.json({ cancelled: true, message: "Subscription will cancel at end of current period" });
  } catch (err) {
    next(err);
  }
});
