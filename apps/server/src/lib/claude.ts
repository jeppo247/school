import Anthropic from "@anthropic-ai/sdk";
import { logger } from "./logger.js";

let claude: Anthropic | null = null;

if (process.env.ANTHROPIC_API_KEY) {
  claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
} else {
  logger.warn("ANTHROPIC_API_KEY not set — AI content generation will be unavailable");
}

export { claude };
