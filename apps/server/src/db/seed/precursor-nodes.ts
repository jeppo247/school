/**
 * Foundation (Prep) to Year 2 precursor skill nodes.
 * These enable back-chaining: when a Y3+ student fails a skill,
 * the system can trace the root cause back to earlier foundations.
 *
 * Covers basic numeracy and early literacy foundations.
 */

import type { SkillNodeSeed, PrerequisiteSeed } from "./skill-nodes.js";

export const precursorNodes: SkillNodeSeed[] = [
  // ============================================================
  // FOUNDATION (PREP) — Numeracy
  // ============================================================
  {
    code: "YF-NA-PV-001",
    name: "Count to 10",
    description: "Say number names in sequence from 0 to 10 and match to objects",
    yearLevel: 0, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    dokLevel: 1, difficultyBand: "below_level", displayOrder: 1,
  },
  {
    code: "YF-NA-PV-002",
    name: "Subitise to 4",
    description: "Instantly recognise the number of objects in collections up to 4 without counting",
    yearLevel: 0, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    dokLevel: 1, difficultyBand: "below_level", displayOrder: 2,
  },
  {
    code: "YF-NA-PV-003",
    name: "Compare quantities (more, less, same)",
    description: "Compare groups of objects and use language like 'more than', 'less than', 'the same as'",
    yearLevel: 0, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    dokLevel: 1, difficultyBand: "below_level", displayOrder: 3,
  },
  {
    code: "YF-NA-PV-004",
    name: "Represent numbers to 10",
    description: "Represent numbers using fingers, objects, drawings, and numerals",
    yearLevel: 0, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    dokLevel: 1, difficultyBand: "below_level", displayOrder: 4,
  },
  {
    code: "YF-NA-PV-005",
    name: "Combine and separate small groups",
    description: "Combine two small groups and tell how many altogether (addition concept to 10)",
    yearLevel: 0, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    dokLevel: 2, difficultyBand: "below_level", displayOrder: 5,
  },
  {
    code: "YF-NA-PA-001",
    name: "Copy and continue simple patterns",
    description: "Recognise, copy, and continue simple repeating patterns (AB, ABB, ABC)",
    yearLevel: 0, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "patterns_algebra",
    dokLevel: 1, difficultyBand: "below_level", displayOrder: 6,
  },

  // ============================================================
  // FOUNDATION (PREP) — Early Literacy
  // ============================================================
  {
    code: "YF-RD-PH-001",
    name: "Letter-sound knowledge",
    description: "Recognise and name all upper and lower case letters and know their common sounds",
    yearLevel: 0, domain: "reading", learningArea: "english", strand: "language", subStrand: "reading_comprehension",
    dokLevel: 1, difficultyBand: "below_level", displayOrder: 1,
  },
  {
    code: "YF-RD-PH-002",
    name: "Blend CVC words",
    description: "Blend sounds to read simple consonant-vowel-consonant words (cat, dog, sit)",
    yearLevel: 0, domain: "reading", learningArea: "english", strand: "language", subStrand: "reading_comprehension",
    dokLevel: 1, difficultyBand: "below_level", displayOrder: 2,
  },
  {
    code: "YF-RD-CM-001",
    name: "Listen and retell",
    description: "Listen to a short text read aloud and retell key events in order",
    yearLevel: 0, domain: "reading", learningArea: "english", strand: "literacy", subStrand: "reading_comprehension",
    dokLevel: 1, difficultyBand: "below_level", displayOrder: 3,
  },
  {
    code: "YF-SP-PH-001",
    name: "Write CVC words",
    description: "Use letter-sound knowledge to spell simple CVC words",
    yearLevel: 0, domain: "spelling", learningArea: "english", strand: "language", subStrand: "spelling_patterns",
    dokLevel: 1, difficultyBand: "below_level", displayOrder: 1,
  },
  {
    code: "YF-GP-SB-001",
    name: "Capital letters and full stops",
    description: "Understand that sentences start with a capital letter and end with a full stop",
    yearLevel: 0, domain: "grammar_punctuation", learningArea: "english", strand: "language", subStrand: "grammar_knowledge",
    dokLevel: 1, difficultyBand: "below_level", displayOrder: 1,
  },

  // ============================================================
  // YEAR 1 — Early Literacy (filling gaps between Prep and Y3)
  // ============================================================
  {
    code: "Y1-RD-PH-001",
    name: "Decode CCVC and CVCC words",
    description: "Use phonics to decode words with consonant blends (frog, jump, slip)",
    yearLevel: 1, domain: "reading", learningArea: "english", strand: "language", subStrand: "reading_comprehension",
    dokLevel: 1, difficultyBand: "below_level", displayOrder: 1,
  },
  {
    code: "Y1-RD-CM-001",
    name: "Read and understand simple sentences",
    description: "Read simple sentences with known words and understand their meaning",
    yearLevel: 1, domain: "reading", learningArea: "english", strand: "literacy", subStrand: "reading_comprehension",
    dokLevel: 1, difficultyBand: "below_level", displayOrder: 2,
  },
  {
    code: "Y1-SP-PH-001",
    name: "Spell common CVC and CCVC words",
    description: "Spell common words with short vowels and consonant blends",
    yearLevel: 1, domain: "spelling", learningArea: "english", strand: "language", subStrand: "spelling_patterns",
    dokLevel: 1, difficultyBand: "below_level", displayOrder: 1,
  },
  {
    code: "Y1-SP-HF-001",
    name: "High-frequency sight words (Year 1)",
    description: "Spell the 100 most common words used in early reading and writing",
    yearLevel: 1, domain: "spelling", learningArea: "english", strand: "language", subStrand: "spelling_patterns",
    dokLevel: 1, difficultyBand: "below_level", displayOrder: 2,
  },

  // ============================================================
  // YEAR 2 — Bridging Literacy
  // ============================================================
  {
    code: "Y2-RD-FL-001",
    name: "Read short texts fluently",
    description: "Read short texts with accuracy, fluency, and understanding",
    yearLevel: 2, domain: "reading", learningArea: "english", strand: "literacy", subStrand: "reading_comprehension",
    dokLevel: 1, difficultyBand: "below_level", displayOrder: 1,
  },
  {
    code: "Y2-RD-CM-001",
    name: "Answer literal comprehension questions",
    description: "Answer who, what, where, when questions about a short text",
    yearLevel: 2, domain: "reading", learningArea: "english", strand: "literacy", subStrand: "reading_comprehension",
    dokLevel: 1, difficultyBand: "below_level", displayOrder: 2,
  },
  {
    code: "Y2-RD-IF-001",
    name: "Simple predictions and connections",
    description: "Make simple predictions about what might happen next and connect to own experience",
    yearLevel: 2, domain: "reading", learningArea: "english", strand: "literacy", subStrand: "reading_comprehension",
    dokLevel: 2, difficultyBand: "below_level", displayOrder: 3,
  },
  {
    code: "Y2-SP-PH-001",
    name: "Common vowel patterns (Year 2)",
    description: "Spell words with common long vowel patterns (a_e, ee, igh, oa)",
    yearLevel: 2, domain: "spelling", learningArea: "english", strand: "language", subStrand: "spelling_patterns",
    dokLevel: 1, difficultyBand: "below_level", displayOrder: 1,
  },
  {
    code: "Y2-SP-HF-001",
    name: "High-frequency words (Year 2)",
    description: "Spell the 200 most common words used in Year 2 reading and writing",
    yearLevel: 2, domain: "spelling", learningArea: "english", strand: "language", subStrand: "spelling_patterns",
    dokLevel: 1, difficultyBand: "below_level", displayOrder: 2,
  },
  {
    code: "Y2-GP-SB-001",
    name: "Write complete sentences",
    description: "Write complete sentences with capital letters, full stops, and basic structure",
    yearLevel: 2, domain: "grammar_punctuation", learningArea: "english", strand: "language", subStrand: "grammar_knowledge",
    dokLevel: 1, difficultyBand: "below_level", displayOrder: 1,
  },
  {
    code: "Y2-GP-NV-001",
    name: "Nouns and verbs (Year 2)",
    description: "Identify and use nouns and verbs in simple sentences",
    yearLevel: 2, domain: "grammar_punctuation", learningArea: "english", strand: "language", subStrand: "grammar_knowledge",
    dokLevel: 1, difficultyBand: "below_level", displayOrder: 2,
  },
];

// ============================================================
// PRECURSOR PREREQUISITES — linking Prep/Y1/Y2 to Y1/Y3 nodes
// ============================================================

export const precursorPrerequisites: PrerequisiteSeed[] = [
  // Prep → Y1 Numeracy
  { skillCode: "Y1-NA-PV-001", prerequisiteCode: "YF-NA-PV-001", strength: "required" },
  { skillCode: "Y1-NA-PV-003", prerequisiteCode: "YF-NA-PV-002", strength: "required" },
  { skillCode: "Y1-NA-PV-005", prerequisiteCode: "YF-NA-PV-001", strength: "required" },
  { skillCode: "Y1-NA-PV-006", prerequisiteCode: "YF-NA-PV-005", strength: "required" },
  { skillCode: "Y1-NA-PA-001", prerequisiteCode: "YF-NA-PA-001", strength: "required" },

  // Prep → Y1 Literacy
  { skillCode: "Y1-RD-PH-001", prerequisiteCode: "YF-RD-PH-001", strength: "required" },
  { skillCode: "Y1-RD-PH-001", prerequisiteCode: "YF-RD-PH-002", strength: "required" },
  { skillCode: "Y1-RD-CM-001", prerequisiteCode: "YF-RD-CM-001", strength: "required" },
  { skillCode: "Y1-SP-PH-001", prerequisiteCode: "YF-SP-PH-001", strength: "required" },

  // Y1 → Y2 Literacy
  { skillCode: "Y2-RD-FL-001", prerequisiteCode: "Y1-RD-CM-001", strength: "required" },
  { skillCode: "Y2-RD-CM-001", prerequisiteCode: "Y1-RD-CM-001", strength: "required" },
  { skillCode: "Y2-RD-IF-001", prerequisiteCode: "Y2-RD-CM-001", strength: "required" },
  { skillCode: "Y2-SP-PH-001", prerequisiteCode: "Y1-SP-PH-001", strength: "required" },
  { skillCode: "Y2-SP-HF-001", prerequisiteCode: "Y1-SP-HF-001", strength: "required" },
  { skillCode: "Y2-GP-SB-001", prerequisiteCode: "YF-GP-SB-001", strength: "required" },
  { skillCode: "Y2-GP-NV-001", prerequisiteCode: "Y2-GP-SB-001", strength: "recommended" },

  // Y2 → Y3 Literacy (connecting to existing Y3 nodes)
  { skillCode: "Y3-RD-LC-001", prerequisiteCode: "Y2-RD-CM-001", strength: "required" },
  { skillCode: "Y3-RD-IF-001", prerequisiteCode: "Y2-RD-IF-001", strength: "required" },
  { skillCode: "Y3-SP-PH-001", prerequisiteCode: "Y2-SP-PH-001", strength: "required" },
  { skillCode: "Y3-SP-HF-001", prerequisiteCode: "Y2-SP-HF-001", strength: "required" },
  { skillCode: "Y3-GP-SB-001", prerequisiteCode: "Y2-GP-SB-001", strength: "required" },
  { skillCode: "Y3-GP-NV-001", prerequisiteCode: "Y2-GP-NV-001", strength: "required" },
];
