import "dotenv/config";
import { db } from "../client.js";
import { themes } from "../schema.js";
import { logger } from "../../lib/logger.js";

async function seed() {
  logger.info("Seeding database...");

  // Seed themes
  await db
    .insert(themes)
    .values([
      {
        id: "default",
        name: "Upwise Blue",
        description: "The classic Upwise look",
        colorPrimary: "#4F8CF7",
        colorSecondary: "#A78BFA",
        colorAccent: "#34D399",
        soundSet: "default",
        isActive: true,
        displayOrder: 0,
      },
      {
        id: "afl",
        name: "AFL Footy",
        description: "Kick goals with your learning!",
        colorPrimary: "#002B5C",
        colorSecondary: "#E31937",
        colorAccent: "#FFD700",
        soundSet: "afl",
        isActive: true,
        displayOrder: 1,
      },
      {
        id: "bluey",
        name: "Bluey",
        description: "Learn and play like Bluey!",
        colorPrimary: "#5B9BD5",
        colorSecondary: "#FF8C42",
        colorAccent: "#7EC8E3",
        soundSet: "bluey",
        isActive: true,
        displayOrder: 2,
      },
      {
        id: "superheroes",
        name: "Superheroes",
        description: "Become a learning superhero!",
        colorPrimary: "#DC2626",
        colorSecondary: "#1D4ED8",
        colorAccent: "#FACC15",
        soundSet: "superheroes",
        isActive: true,
        displayOrder: 3,
      },
      {
        id: "space",
        name: "Space Explorer",
        description: "Explore the universe of knowledge!",
        colorPrimary: "#6366F1",
        colorSecondary: "#06B6D4",
        colorAccent: "#F59E0B",
        soundSet: "space",
        isActive: true,
        displayOrder: 4,
      },
      {
        id: "animals",
        name: "Animal Kingdom",
        description: "Learn with your favourite animals!",
        colorPrimary: "#16A34A",
        colorSecondary: "#92400E",
        colorAccent: "#F97316",
        soundSet: "animals",
        isActive: true,
        displayOrder: 5,
      },
      {
        id: "golf",
        name: "Golf Pro",
        description: "Ace your way to the top!",
        colorPrimary: "#15803D",
        colorSecondary: "#FBBF24",
        colorAccent: "#ECFDF5",
        soundSet: "golf",
        isActive: true,
        displayOrder: 6,
      },
    ])
    .onConflictDoNothing();

  logger.info("Themes seeded successfully");
  logger.info("Database seeding complete");
  process.exit(0);
}

seed().catch((err) => {
  logger.error("Seed failed", { error: err });
  process.exit(1);
});
