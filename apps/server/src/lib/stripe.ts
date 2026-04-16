import Stripe from "stripe";
import { logger } from "./logger.js";

let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
} else {
  logger.warn("STRIPE_SECRET_KEY not set — payments will be unavailable");
}

export { stripe };
