import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { logger } from "./lib/logger.js";
import { errorHandler } from "./middleware/error-handler.js";
import { requestLogger } from "./middleware/request-logger.js";
import { globalLimiter, strictLimiter, checkoutLimiter } from "./middleware/rate-limit.js";

// Route imports
import { authRoutes } from "./routes/auth.js";
import { studentRoutes } from "./routes/students.js";
import { familyRoutes } from "./routes/families.js";
import { diagnosticRoutes } from "./routes/diagnostic.js";
import { sessionRoutes } from "./routes/sessions.js";
import { knowledgeGraphRoutes } from "./routes/knowledge-graph.js";
import { parentRoutes } from "./routes/parent.js";
import { themeRoutes } from "./routes/themes.js";
import { feedbackRoutes } from "./routes/feedback.js";
import { adminRoutes } from "./routes/admin.js";
import { webhookRoutes } from "./routes/webhooks.js";
import { coinRoutes } from "./routes/coins.js";
import { shopRoutes } from "./routes/shop.js";
import { subscriptionRoutes } from "./routes/subscriptions.js";
import { waitlistRoutes } from "./routes/waitlist.js";

const app = express();
const PORT = process.env.PORT ?? 4000;

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL.split(",")
      : ["http://localhost:3000", "https://upwise.com.au", "https://www.upwise.com.au", "https://upwiseweb-production.up.railway.app"],
    credentials: true,
  }),
);

// Webhooks need raw body (Stripe signature verification)
app.use("/api/v1/webhooks", express.raw({ type: "application/json" }));

// Parse JSON for all other routes
app.use(express.json({ limit: "10mb" }));

// Rate limiting
app.use(globalLimiter);
app.use("/api/v1/diagnostic", strictLimiter);
app.use("/api/v1/admin/questions/generate", strictLimiter);
app.use("/api/v1/subscriptions", checkoutLimiter);
app.use("/api/v1/sessions", strictLimiter);
app.use("/api/v1/families", strictLimiter);
app.use("/api/v1/waitlist", strictLimiter);

// Request logging
app.use(requestLogger);

// API routes
const api = express.Router();
api.use("/auth", authRoutes);
api.use("/students", studentRoutes);
api.use("/families", familyRoutes);
api.use("/diagnostic", diagnosticRoutes);
api.use("/sessions", sessionRoutes);
api.use("/knowledge-graph", knowledgeGraphRoutes);
api.use("/parent", parentRoutes);
api.use("/themes", themeRoutes);
api.use("/feedback", feedbackRoutes);
api.use("/admin", adminRoutes);
api.use("/webhooks", webhookRoutes);
api.use("/coins", coinRoutes);
api.use("/shop", shopRoutes);
api.use("/subscriptions", subscriptionRoutes);
api.use("/waitlist", waitlistRoutes);

app.use("/api/v1", api);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "upwise-api", timestamp: new Date().toISOString() });
});

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Upwise API running on port ${PORT}`);
});

export default app;
