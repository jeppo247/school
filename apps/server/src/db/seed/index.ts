import "dotenv/config";
import { db } from "../client.js";
import { themes, shopItems, skillNodes, skillPrerequisites, questions } from "../schema.js";
import { eq } from "drizzle-orm";
import { allSkillNodes, prerequisites } from "./skill-nodes.js";
import {
  readingNodes, spellingNodes, grammarPunctuationNodes, writingNodes,
  readingPrerequisites, spellingPrerequisites, grammarPunctuationPrerequisites, writingPrerequisites,
} from "./english-skill-nodes.js";
import { precursorNodes, precursorPrerequisites } from "./precursor-nodes.js";
import { starterQuestions } from "./starter-questions.js";
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

  // Seed shop items
  await db
    .insert(shopItems)
    .values([
      // Themes (2E–4E range: 40-60 coins, ~2-4 days saving)
      {
        id: "theme_underwater",
        category: "theme",
        name: "Underwater World",
        description: "Dive deep into learning with ocean colours and sea creature friends!",
        price: 60,
        previewData: { colorPrimary: "#0891B2", colorSecondary: "#06B6D4", colorAccent: "#22D3EE" },
        isActive: true,
        displayOrder: 1,
      },
      {
        id: "theme_dinosaurs",
        category: "theme",
        name: "Dinosaur Adventure",
        description: "Stomp through maths problems like a T-Rex!",
        price: 60,
        previewData: { colorPrimary: "#65A30D", colorSecondary: "#A16207", colorAccent: "#CA8A04" },
        isActive: true,
        displayOrder: 2,
      },
      {
        id: "theme_rainbow",
        category: "theme",
        name: "Rainbow Magic",
        description: "Add a splash of colour to every lesson!",
        price: 40,
        previewData: { colorPrimary: "#EC4899", colorSecondary: "#8B5CF6", colorAccent: "#06B6D4" },
        isActive: true,
        displayOrder: 3,
      },
      // Avatar Items (0.5E–1E range: 8-15 coins, first-session purchase)
      {
        id: "avatar_wizard_hat",
        category: "avatar",
        name: "Wizard Hat",
        description: "A magical hat for a magical learner!",
        price: 10,
        isActive: true,
        displayOrder: 10,
      },
      {
        id: "avatar_space_helmet",
        category: "avatar",
        name: "Space Helmet",
        description: "Ready for intergalactic learning missions!",
        price: 12,
        isActive: true,
        displayOrder: 11,
      },
      {
        id: "avatar_footy_beanie",
        category: "avatar",
        name: "Footy Beanie",
        description: "Show your team spirit while you learn!",
        price: 10,
        isActive: true,
        displayOrder: 12,
      },
      {
        id: "avatar_crown",
        category: "avatar",
        name: "Golden Crown",
        description: "For the king or queen of learning!",
        price: 15,
        isActive: true,
        displayOrder: 13,
      },
      {
        id: "avatar_frame_sparkle",
        category: "avatar",
        name: "Sparkle Frame",
        description: "A sparkly border around your profile picture!",
        price: 8,
        isActive: true,
        displayOrder: 14,
      },
      {
        id: "avatar_outfit_astronaut",
        category: "avatar",
        name: "Astronaut Suit",
        description: "One small step for learning, one giant leap for you!",
        price: 15,
        isActive: true,
        displayOrder: 15,
      },
      // Celebration Styles (1E–2E: 15-20 coins)
      {
        id: "celebration_stars",
        category: "celebration",
        name: "Star Burst",
        description: "Correct answers explode into golden stars!",
        price: 15,
        previewData: { particleType: "stars" },
        isActive: true,
        displayOrder: 20,
      },
      {
        id: "celebration_footballs",
        category: "celebration",
        name: "Footy Frenzy",
        description: "Footballs fly everywhere when you get it right!",
        price: 15,
        previewData: { particleType: "footballs" },
        isActive: true,
        displayOrder: 21,
      },
      {
        id: "celebration_paws",
        category: "celebration",
        name: "Paw Prints",
        description: "Cute paw prints bounce across the screen!",
        price: 15,
        previewData: { particleType: "paws" },
        isActive: true,
        displayOrder: 22,
      },
      {
        id: "celebration_rockets",
        category: "celebration",
        name: "Rocket Launch",
        description: "Rockets blast off with every correct answer!",
        price: 20,
        previewData: { particleType: "rockets" },
        isActive: true,
        displayOrder: 23,
      },
      // Sound Packs (1E–2E: 18-25 coins)
      {
        id: "sound_silly",
        category: "sound_pack",
        name: "Silly Sounds",
        description: "Cartoon boings, squeaks, and funny noises!",
        price: 18,
        isActive: true,
        displayOrder: 30,
      },
      {
        id: "sound_nature",
        category: "sound_pack",
        name: "Nature Sounds",
        description: "Bird calls, ocean waves, and peaceful chimes!",
        price: 18,
        isActive: true,
        displayOrder: 31,
      },
      {
        id: "sound_aussie_animals",
        category: "sound_pack",
        name: "Aussie Animals",
        description: "Kookaburra laughs, koala grunts, and more!",
        price: 22,
        isActive: true,
        displayOrder: 32,
      },
      {
        id: "sound_music",
        category: "sound_pack",
        name: "Musical Notes",
        description: "Short musical riffs for every answer!",
        price: 25,
        isActive: true,
        displayOrder: 33,
      },
      // Brain Break Upgrades (1E–2E: 12-25 coins)
      {
        id: "break_breathing",
        category: "brain_break",
        name: "Calm Breathing",
        description: "A peaceful breathing exercise with calming animation!",
        price: 12,
        isActive: true,
        displayOrder: 40,
      },
      {
        id: "break_dance",
        category: "brain_break",
        name: "Dance Break",
        description: "Bust some moves with a fun dance prompt!",
        price: 18,
        isActive: true,
        displayOrder: 41,
      },
      {
        id: "break_pattern_match",
        category: "brain_break",
        name: "Pattern Match",
        description: "A fun visual pattern matching mini-game!",
        price: 22,
        isActive: true,
        displayOrder: 42,
      },
      {
        id: "break_coin_catcher",
        category: "brain_break",
        name: "Coin Catcher",
        description: "Catch falling coins in this quick mini-game!",
        price: 25,
        isActive: true,
        displayOrder: 43,
      },
      // Collectible Badges (1E–3E: 15-30 coins)
      {
        id: "badge_maths_legend",
        category: "badge",
        name: "Maths Legend",
        description: "Show everyone you're a maths legend!",
        price: 30,
        isActive: true,
        displayOrder: 50,
      },
      {
        id: "badge_streak_champion",
        category: "badge",
        name: "Streak Champion",
        description: "For dedicated daily learners!",
        price: 25,
        prerequisite: { minStreak: 20 },
        isActive: true,
        displayOrder: 51,
      },
      {
        id: "badge_number_ninja",
        category: "badge",
        name: "Number Ninja",
        description: "Master of numbers and calculations!",
        price: 18,
        isActive: true,
        displayOrder: 52,
      },
      {
        id: "badge_early_bird",
        category: "badge",
        name: "Early Bird",
        description: "For those who love morning learning sessions!",
        price: 15,
        isActive: true,
        displayOrder: 53,
      },
      {
        id: "badge_perfectionist",
        category: "badge",
        name: "Perfectionist",
        description: "For getting a perfect score in a session!",
        price: 28,
        isActive: true,
        displayOrder: 54,
      },
    ])
    .onConflictDoNothing();

  logger.info("Shop items seeded successfully");

  // Seed skill nodes
  for (const node of allSkillNodes) {
    await db
      .insert(skillNodes)
      .values({
        code: node.code,
        name: node.name,
        description: node.description,
        yearLevel: node.yearLevel,
        domain: node.domain,
        learningArea: node.learningArea,
        strand: node.strand,
        subStrand: node.subStrand,
        acaraCode: node.acaraCode,
        dokLevel: node.dokLevel,
        difficultyBand: node.difficultyBand,
        displayOrder: node.displayOrder,
      })
      .onConflictDoNothing();
  }

  // Seed English skill nodes (Reading + Spelling)
  const englishNodes = [...readingNodes, ...spellingNodes, ...grammarPunctuationNodes, ...writingNodes, ...precursorNodes];
  for (const node of englishNodes) {
    await db
      .insert(skillNodes)
      .values({
        code: node.code,
        name: node.name,
        description: node.description,
        yearLevel: node.yearLevel,
        domain: node.domain,
        learningArea: node.learningArea,
        strand: node.strand,
        subStrand: node.subStrand,
        acaraCode: node.acaraCode,
        dokLevel: node.dokLevel,
        difficultyBand: node.difficultyBand,
        displayOrder: node.displayOrder,
      })
      .onConflictDoNothing();
  }

  logger.info(`Skill nodes seeded: ${allSkillNodes.length} maths + ${englishNodes.length} english nodes`);

  // Seed prerequisites
  for (const prereq of prerequisites) {
    const [skill] = await db
      .select({ id: skillNodes.id })
      .from(skillNodes)
      .where(eq(skillNodes.code, prereq.skillCode));
    const [prerequisite] = await db
      .select({ id: skillNodes.id })
      .from(skillNodes)
      .where(eq(skillNodes.code, prereq.prerequisiteCode));

    if (skill && prerequisite) {
      await db
        .insert(skillPrerequisites)
        .values({
          skillId: skill.id,
          prerequisiteId: prerequisite.id,
          strength: prereq.strength,
        })
        .onConflictDoNothing();
    }
  }

  // Seed English prerequisites (Reading + Spelling)
  const englishPrereqs = [...readingPrerequisites, ...spellingPrerequisites, ...grammarPunctuationPrerequisites, ...writingPrerequisites, ...precursorPrerequisites];
  for (const prereq of englishPrereqs) {
    const [skill] = await db
      .select({ id: skillNodes.id })
      .from(skillNodes)
      .where(eq(skillNodes.code, prereq.skillCode));
    const [prerequisite] = await db
      .select({ id: skillNodes.id })
      .from(skillNodes)
      .where(eq(skillNodes.code, prereq.prerequisiteCode));

    if (skill && prerequisite) {
      await db
        .insert(skillPrerequisites)
        .values({
          skillId: skill.id,
          prerequisiteId: prerequisite.id,
          strength: prereq.strength,
        })
        .onConflictDoNothing();
    }
  }

  logger.info(`Prerequisites seeded: ${prerequisites.length} maths + ${englishPrereqs.length} english edges`);

  // Seed starter questions
  let questionsSeeded = 0;
  for (const q of starterQuestions) {
    const [skill] = await db
      .select({ id: skillNodes.id })
      .from(skillNodes)
      .where(eq(skillNodes.code, q.skillCode));

    if (skill) {
      await db
        .insert(questions)
        .values({
          skillId: skill.id,
          content: q.content,
          difficultyParam: q.difficultyParam,
          questionType: q.questionType,
          isValidated: true,
        })
        .onConflictDoNothing();
      questionsSeeded++;
    }
  }

  logger.info(`Starter questions seeded: ${questionsSeeded}`);
  logger.info("Database seeding complete");
  process.exit(0);
}

seed().catch((err) => {
  logger.error("Seed failed", { error: err });
  process.exit(1);
});
