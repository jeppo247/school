import { Router } from "express";
import type { Request, Response } from "express";
import Stripe from "stripe";
import { db } from "../db/client.js";
import { families, subscriptions } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { stripe } from "../lib/stripe.js";
import { logger } from "../lib/logger.js";

export const webhookRoutes = Router();

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

webhookRoutes.post("/stripe", async (req: Request, res: Response) => {
  if (!stripe || !WEBHOOK_SECRET) {
    logger.warn("Stripe webhook received but Stripe not configured");
    res.status(200).json({ received: true });
    return;
  }

  let event: Stripe.Event;
  try {
    const sig = req.headers["stripe-signature"] as string;
    event = stripe.webhooks.constructEvent(req.body, sig, WEBHOOK_SECRET);
  } catch (err) {
    logger.error("Webhook signature verification failed", { error: (err as Error).message });
    res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    return;
  }

  logger.info("Stripe webhook received", { type: event.type, id: event.id });

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const familyId = session.metadata?.familyId;
        const tier = session.metadata?.tier ?? "standard";

        if (familyId) {
          await db.update(families).set({
            subscriptionTier: tier,
            subscriptionStatus: "active",
            stripeCustomerId: session.customer as string,
            updatedAt: new Date(),
          }).where(eq(families.id, familyId));

          if (session.subscription) {
            await db.insert(subscriptions).values({
              familyId,
              stripeSubscriptionId: session.subscription as string,
              tier,
              status: "active",
            }).onConflictDoNothing();
          }

          logger.info("Subscription activated", { familyId, tier });
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const familyId = sub.metadata?.familyId;

        if (familyId) {
          const status = sub.cancel_at_period_end ? "cancelling" : sub.status === "active" ? "active" : sub.status;
          await db.update(families).set({
            subscriptionStatus: status,
            updatedAt: new Date(),
          }).where(eq(families.id, familyId));

          await db.update(subscriptions).set({
            status,
            currentPeriodStart: new Date(sub.current_period_start * 1000),
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
            cancelAt: sub.cancel_at ? new Date(sub.cancel_at * 1000) : null,
            updatedAt: new Date(),
          }).where(eq(subscriptions.stripeSubscriptionId, sub.id));

          logger.info("Subscription updated", { familyId, status });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const familyId = sub.metadata?.familyId;

        if (familyId) {
          await db.update(families).set({
            subscriptionTier: "expired",
            subscriptionStatus: "cancelled",
            updatedAt: new Date(),
          }).where(eq(families.id, familyId));

          await db.update(subscriptions).set({
            status: "cancelled",
            updatedAt: new Date(),
          }).where(eq(subscriptions.stripeSubscriptionId, sub.id));

          logger.info("Subscription cancelled", { familyId });
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = invoice.subscription as string;
        if (subId) {
          await db.update(subscriptions).set({
            status: "active",
            updatedAt: new Date(),
          }).where(eq(subscriptions.stripeSubscriptionId, subId));
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = invoice.subscription as string;
        if (subId) {
          await db.update(subscriptions).set({
            status: "past_due",
            updatedAt: new Date(),
          }).where(eq(subscriptions.stripeSubscriptionId, subId));

          logger.warn("Payment failed", { subscriptionId: subId });
        }
        break;
      }

      default:
        logger.info("Unhandled webhook event", { type: event.type });
    }
  } catch (err) {
    logger.error("Webhook processing error", { type: event.type, error: (err as Error).message });
  }

  res.json({ received: true });
});
