/**
 * ACARA English skill nodes for Reading and Spelling domains.
 *
 * Organised by NAPLAN domain, year level, and sub-strand.
 * Each node has a unique code:
 *   Y{year}-{domain_abbrev}-{substrand}-{number}
 *
 * Domain abbreviations:
 *   RD = Reading
 *   SP = Spelling
 *   GP = Grammar and Punctuation
 *   WR = Writing
 */

import type { SkillNodeSeed, PrerequisiteSeed } from "./skill-nodes.js";

// ============================================================
// READING — Years 3–7
// ============================================================

export const readingNodes: SkillNodeSeed[] = [
  // Year 3 Reading
  {
    code: "Y3-RD-LC-001",
    name: "Locate explicitly stated information",
    description: "Find and retrieve directly stated facts, details, and information from a text",
    yearLevel: 3, domain: "reading", learningArea: "english", strand: "literacy", subStrand: "reading_comprehension",
    acaraCode: "AC9E3LY05", dokLevel: 1, difficultyBand: "on_level", displayOrder: 1,
  },
  {
    code: "Y3-RD-LC-002",
    name: "Sequence events in a text",
    description: "Identify the order of events in a narrative or information text",
    yearLevel: 3, domain: "reading", learningArea: "english", strand: "literacy", subStrand: "reading_comprehension",
    dokLevel: 1, difficultyBand: "on_level", displayOrder: 2,
  },
  {
    code: "Y3-RD-IF-001",
    name: "Make simple inferences",
    description: "Use clues in the text to work out information that is not directly stated",
    yearLevel: 3, domain: "reading", learningArea: "english", strand: "literacy", subStrand: "reading_comprehension",
    acaraCode: "AC9E3LY05", dokLevel: 2, difficultyBand: "on_level", displayOrder: 3,
  },
  {
    code: "Y3-RD-IF-002",
    name: "Connect text and images",
    description: "Use illustrations, diagrams, and images to support understanding of written text",
    yearLevel: 3, domain: "reading", learningArea: "english", strand: "literacy", subStrand: "reading_comprehension",
    dokLevel: 2, difficultyBand: "on_level", displayOrder: 4,
  },
  {
    code: "Y3-RD-VB-001",
    name: "Word meaning from context",
    description: "Work out the meaning of unfamiliar words using surrounding context clues",
    yearLevel: 3, domain: "reading", learningArea: "english", strand: "language", subStrand: "reading_comprehension",
    dokLevel: 2, difficultyBand: "on_level", displayOrder: 5,
  },
  {
    code: "Y3-RD-TS-001",
    name: "Identify text type and purpose",
    description: "Recognise whether a text is narrative, informative, or persuasive and identify its purpose",
    yearLevel: 3, domain: "reading", learningArea: "english", strand: "literature", subStrand: "reading_comprehension",
    dokLevel: 2, difficultyBand: "on_level", displayOrder: 6,
  },

  // Year 5 Reading
  {
    code: "Y5-RD-LC-001",
    name: "Locate information across paragraphs",
    description: "Find and combine information from multiple paragraphs or sections of a text",
    yearLevel: 5, domain: "reading", learningArea: "english", strand: "literacy", subStrand: "reading_comprehension",
    acaraCode: "AC9E5LY05", dokLevel: 2, difficultyBand: "on_level", displayOrder: 1,
  },
  {
    code: "Y5-RD-IF-001",
    name: "Infer character feelings and motives",
    description: "Use evidence from the text to infer how characters feel and why they act the way they do",
    yearLevel: 5, domain: "reading", learningArea: "english", strand: "literacy", subStrand: "reading_comprehension",
    acaraCode: "AC9E5LY05", dokLevel: 2, difficultyBand: "on_level", displayOrder: 2,
  },
  {
    code: "Y5-RD-IF-002",
    name: "Identify main idea and supporting details",
    description: "Determine the main idea of a paragraph or text and identify the details that support it",
    yearLevel: 5, domain: "reading", learningArea: "english", strand: "literacy", subStrand: "reading_comprehension",
    acaraCode: "AC9E5LY05", dokLevel: 2, difficultyBand: "on_level", displayOrder: 3,
  },
  {
    code: "Y5-RD-IF-003",
    name: "Cause and effect relationships",
    description: "Identify cause and effect relationships within and across texts",
    yearLevel: 5, domain: "reading", learningArea: "english", strand: "literacy", subStrand: "reading_comprehension",
    dokLevel: 2, difficultyBand: "on_level", displayOrder: 4,
  },
  {
    code: "Y5-RD-AN-001",
    name: "Interpret diagrams and data displays",
    description: "Read and interpret information from tables, graphs, diagrams, and maps within texts",
    yearLevel: 5, domain: "reading", learningArea: "english", strand: "literacy", subStrand: "reading_comprehension",
    dokLevel: 2, difficultyBand: "on_level", displayOrder: 5,
  },
  {
    code: "Y5-RD-AN-002",
    name: "Identify author's perspective",
    description: "Recognise the author's point of view and how language is used to influence the reader",
    yearLevel: 5, domain: "reading", learningArea: "english", strand: "literacy", subStrand: "reading_comprehension",
    dokLevel: 3, difficultyBand: "on_level", displayOrder: 6,
  },
  {
    code: "Y5-RD-VB-001",
    name: "Figurative language understanding",
    description: "Interpret similes, metaphors, and idioms in context",
    yearLevel: 5, domain: "reading", learningArea: "english", strand: "language", subStrand: "reading_comprehension",
    dokLevel: 2, difficultyBand: "on_level", displayOrder: 7,
  },
  {
    code: "Y5-RD-TS-001",
    name: "Text structure and features",
    description: "Identify how texts are organised using headings, subheadings, paragraphs, and text features",
    yearLevel: 5, domain: "reading", learningArea: "english", strand: "literacy", subStrand: "reading_comprehension",
    dokLevel: 2, difficultyBand: "on_level", displayOrder: 8,
  },

  // Year 7 Reading
  {
    code: "Y7-RD-LC-001",
    name: "Locate and synthesise across texts",
    description: "Find, compare, and combine information from multiple sources or sections",
    yearLevel: 7, domain: "reading", learningArea: "english", strand: "literacy", subStrand: "reading_comprehension",
    acaraCode: "AC9E7LY05", dokLevel: 3, difficultyBand: "on_level", displayOrder: 1,
  },
  {
    code: "Y7-RD-IF-001",
    name: "Complex inference and interpretation",
    description: "Draw complex inferences from implicit information, tone, and subtext",
    yearLevel: 7, domain: "reading", learningArea: "english", strand: "literacy", subStrand: "reading_comprehension",
    acaraCode: "AC9E7LY05", dokLevel: 3, difficultyBand: "on_level", displayOrder: 2,
  },
  {
    code: "Y7-RD-AN-001",
    name: "Evaluate evidence and argument",
    description: "Evaluate the strength of evidence and reasoning in persuasive and informative texts",
    yearLevel: 7, domain: "reading", learningArea: "english", strand: "literacy", subStrand: "reading_comprehension",
    acaraCode: "AC9E7LY05", dokLevel: 3, difficultyBand: "on_level", displayOrder: 3,
  },
  {
    code: "Y7-RD-AN-002",
    name: "Analyse language choices and effects",
    description: "Analyse how authors use language, imagery, and literary devices to create meaning and effect",
    yearLevel: 7, domain: "reading", learningArea: "english", strand: "literature", subStrand: "reading_comprehension",
    acaraCode: "AC9E7LY03", dokLevel: 3, difficultyBand: "on_level", displayOrder: 4,
  },
  {
    code: "Y7-RD-AN-003",
    name: "Compare ideas and perspectives",
    description: "Compare and contrast ideas, information, and perspectives across different texts",
    yearLevel: 7, domain: "reading", learningArea: "english", strand: "literacy", subStrand: "reading_comprehension",
    dokLevel: 3, difficultyBand: "on_level", displayOrder: 5,
  },
  {
    code: "Y7-RD-VB-001",
    name: "Technical and subject-specific vocabulary",
    description: "Understand and interpret technical, subject-specific, and sophisticated vocabulary",
    yearLevel: 7, domain: "reading", learningArea: "english", strand: "language", subStrand: "reading_comprehension",
    dokLevel: 2, difficultyBand: "on_level", displayOrder: 6,
  },
  {
    code: "Y7-RD-TS-001",
    name: "Analyse text structure and purpose",
    description: "Analyse how text structure and organisation contribute to meaning and purpose",
    yearLevel: 7, domain: "reading", learningArea: "english", strand: "literacy", subStrand: "reading_comprehension",
    acaraCode: "AC9E7LY03", dokLevel: 3, difficultyBand: "on_level", displayOrder: 7,
  },
];

// ============================================================
// SPELLING — Years 3–7
// ============================================================

export const spellingNodes: SkillNodeSeed[] = [
  // Year 3 Spelling
  {
    code: "Y3-SP-PH-001",
    name: "Common vowel digraphs",
    description: "Spell words with common vowel digraphs (ee, ea, oa, ai, ay, oo, ou, ow)",
    yearLevel: 3, domain: "spelling", learningArea: "english", strand: "language", subStrand: "spelling_patterns",
    dokLevel: 1, difficultyBand: "on_level", displayOrder: 1,
  },
  {
    code: "Y3-SP-PH-002",
    name: "Common consonant digraphs and blends",
    description: "Spell words with consonant digraphs (sh, ch, th, wh) and blends (bl, cr, st, sp)",
    yearLevel: 3, domain: "spelling", learningArea: "english", strand: "language", subStrand: "spelling_patterns",
    dokLevel: 1, difficultyBand: "on_level", displayOrder: 2,
  },
  {
    code: "Y3-SP-HF-001",
    name: "High-frequency words (Year 3)",
    description: "Correctly spell high-frequency words commonly used in Year 3 writing",
    yearLevel: 3, domain: "spelling", learningArea: "english", strand: "language", subStrand: "spelling_patterns",
    acaraCode: "AC9E3LA11", dokLevel: 1, difficultyBand: "on_level", displayOrder: 3,
  },
  {
    code: "Y3-SP-MO-001",
    name: "Common prefixes and suffixes",
    description: "Add common prefixes (un-, re-, dis-) and suffixes (-ed, -ing, -ly, -ful) to base words",
    yearLevel: 3, domain: "spelling", learningArea: "english", strand: "language", subStrand: "spelling_patterns",
    dokLevel: 2, difficultyBand: "on_level", displayOrder: 4,
  },
  {
    code: "Y3-SP-PR-001",
    name: "Proofread for spelling errors",
    description: "Identify and correct misspelt words in sentences and short texts",
    yearLevel: 3, domain: "spelling", learningArea: "english", strand: "language", subStrand: "spelling_patterns",
    acaraCode: "AC9E3LA11", dokLevel: 2, difficultyBand: "on_level", displayOrder: 5,
  },
  {
    code: "Y3-SP-RU-001",
    name: "Plural rules (s, es, ies)",
    description: "Apply rules for making words plural including adding -s, -es, and changing y to -ies",
    yearLevel: 3, domain: "spelling", learningArea: "english", strand: "language", subStrand: "spelling_patterns",
    dokLevel: 2, difficultyBand: "on_level", displayOrder: 6,
  },

  // Year 5 Spelling
  {
    code: "Y5-SP-PH-001",
    name: "Less common vowel patterns",
    description: "Spell words with less common vowel patterns (ough, eigh, igh, augh)",
    yearLevel: 5, domain: "spelling", learningArea: "english", strand: "language", subStrand: "spelling_patterns",
    dokLevel: 2, difficultyBand: "on_level", displayOrder: 1,
  },
  {
    code: "Y5-SP-MO-001",
    name: "Morphemic word building",
    description: "Use knowledge of prefixes, suffixes, and root words to spell complex words",
    yearLevel: 5, domain: "spelling", learningArea: "english", strand: "language", subStrand: "spelling_patterns",
    acaraCode: "AC9E5LA09", dokLevel: 2, difficultyBand: "on_level", displayOrder: 2,
  },
  {
    code: "Y5-SP-MO-002",
    name: "Latin and Greek roots",
    description: "Recognise and use common Latin and Greek word roots (tele-, micro-, graph, struct)",
    yearLevel: 5, domain: "spelling", learningArea: "english", strand: "language", subStrand: "spelling_patterns",
    dokLevel: 2, difficultyBand: "on_level", displayOrder: 3,
  },
  {
    code: "Y5-SP-HF-001",
    name: "High-frequency words (Year 5)",
    description: "Correctly spell high-frequency and subject-specific words used in Year 5 writing",
    yearLevel: 5, domain: "spelling", learningArea: "english", strand: "language", subStrand: "spelling_patterns",
    acaraCode: "AC9E5LA09", dokLevel: 1, difficultyBand: "on_level", displayOrder: 4,
  },
  {
    code: "Y5-SP-RU-001",
    name: "Doubling rules and silent letters",
    description: "Apply spelling rules for doubling consonants before suffixes and recognise silent letters",
    yearLevel: 5, domain: "spelling", learningArea: "english", strand: "language", subStrand: "spelling_patterns",
    dokLevel: 2, difficultyBand: "on_level", displayOrder: 5,
  },
  {
    code: "Y5-SP-HO-001",
    name: "Homophones and commonly confused words",
    description: "Distinguish and correctly spell homophones (their/there/they're, to/too/two, your/you're)",
    yearLevel: 5, domain: "spelling", learningArea: "english", strand: "language", subStrand: "spelling_patterns",
    dokLevel: 2, difficultyBand: "on_level", displayOrder: 6,
  },
  {
    code: "Y5-SP-PR-001",
    name: "Proofread and self-correct (Year 5)",
    description: "Identify and correct spelling errors in paragraphs and longer texts",
    yearLevel: 5, domain: "spelling", learningArea: "english", strand: "language", subStrand: "spelling_patterns",
    acaraCode: "AC9E5LA09", dokLevel: 2, difficultyBand: "on_level", displayOrder: 7,
  },

  // Year 7 Spelling
  {
    code: "Y7-SP-MO-001",
    name: "Advanced morphology",
    description: "Use knowledge of etymology, morphemes, and word families to spell complex and technical words",
    yearLevel: 7, domain: "spelling", learningArea: "english", strand: "language", subStrand: "spelling_patterns",
    acaraCode: "AC9E7LA09", dokLevel: 2, difficultyBand: "on_level", displayOrder: 1,
  },
  {
    code: "Y7-SP-MO-002",
    name: "Suffixing rules for longer words",
    description: "Apply rules for adding suffixes to multi-syllable words (e.g., -tion, -sion, -ence, -ance)",
    yearLevel: 7, domain: "spelling", learningArea: "english", strand: "language", subStrand: "spelling_patterns",
    dokLevel: 2, difficultyBand: "on_level", displayOrder: 2,
  },
  {
    code: "Y7-SP-HF-001",
    name: "Subject-specific vocabulary spelling",
    description: "Correctly spell technical and subject-specific vocabulary across learning areas",
    yearLevel: 7, domain: "spelling", learningArea: "english", strand: "language", subStrand: "spelling_patterns",
    acaraCode: "AC9E7LY08", dokLevel: 2, difficultyBand: "on_level", displayOrder: 3,
  },
  {
    code: "Y7-SP-PR-001",
    name: "Proofread extended texts (Year 7)",
    description: "Identify and correct spelling, punctuation, and grammar errors in extended writing",
    yearLevel: 7, domain: "spelling", learningArea: "english", strand: "language", subStrand: "spelling_patterns",
    acaraCode: "AC9E7LA09", dokLevel: 2, difficultyBand: "on_level", displayOrder: 4,
  },
  {
    code: "Y7-SP-ET-001",
    name: "Etymology and word origins",
    description: "Use knowledge of word origins (Latin, Greek, French) to predict and verify spelling",
    yearLevel: 7, domain: "spelling", learningArea: "english", strand: "language", subStrand: "spelling_patterns",
    dokLevel: 3, difficultyBand: "on_level", displayOrder: 5,
  },
];

// ============================================================
// READING PREREQUISITES
// ============================================================

export const readingPrerequisites: PrerequisiteSeed[] = [
  // Y3 internal
  { skillCode: "Y3-RD-IF-001", prerequisiteCode: "Y3-RD-LC-001", strength: "required" },
  { skillCode: "Y3-RD-IF-002", prerequisiteCode: "Y3-RD-LC-001", strength: "required" },
  { skillCode: "Y3-RD-VB-001", prerequisiteCode: "Y3-RD-LC-001", strength: "recommended" },
  { skillCode: "Y3-RD-TS-001", prerequisiteCode: "Y3-RD-IF-001", strength: "recommended" },

  // Y3 → Y5
  { skillCode: "Y5-RD-LC-001", prerequisiteCode: "Y3-RD-LC-001", strength: "required" },
  { skillCode: "Y5-RD-IF-001", prerequisiteCode: "Y3-RD-IF-001", strength: "required" },
  { skillCode: "Y5-RD-IF-002", prerequisiteCode: "Y3-RD-IF-001", strength: "required" },
  { skillCode: "Y5-RD-VB-001", prerequisiteCode: "Y3-RD-VB-001", strength: "required" },
  { skillCode: "Y5-RD-TS-001", prerequisiteCode: "Y3-RD-TS-001", strength: "required" },

  // Y5 internal
  { skillCode: "Y5-RD-IF-003", prerequisiteCode: "Y5-RD-IF-002", strength: "required" },
  { skillCode: "Y5-RD-AN-001", prerequisiteCode: "Y5-RD-LC-001", strength: "required" },
  { skillCode: "Y5-RD-AN-002", prerequisiteCode: "Y5-RD-IF-002", strength: "required" },

  // Y5 → Y7
  { skillCode: "Y7-RD-LC-001", prerequisiteCode: "Y5-RD-LC-001", strength: "required" },
  { skillCode: "Y7-RD-IF-001", prerequisiteCode: "Y5-RD-IF-001", strength: "required" },
  { skillCode: "Y7-RD-IF-001", prerequisiteCode: "Y5-RD-IF-003", strength: "required" },
  { skillCode: "Y7-RD-AN-001", prerequisiteCode: "Y5-RD-AN-002", strength: "required" },
  { skillCode: "Y7-RD-AN-002", prerequisiteCode: "Y5-RD-VB-001", strength: "required" },
  { skillCode: "Y7-RD-AN-003", prerequisiteCode: "Y5-RD-AN-002", strength: "required" },
  { skillCode: "Y7-RD-VB-001", prerequisiteCode: "Y5-RD-VB-001", strength: "required" },
  { skillCode: "Y7-RD-TS-001", prerequisiteCode: "Y5-RD-TS-001", strength: "required" },
];

// ============================================================
// SPELLING PREREQUISITES
// ============================================================

export const spellingPrerequisites: PrerequisiteSeed[] = [
  // Y3 internal
  { skillCode: "Y3-SP-MO-001", prerequisiteCode: "Y3-SP-PH-001", strength: "required" },
  { skillCode: "Y3-SP-MO-001", prerequisiteCode: "Y3-SP-PH-002", strength: "required" },
  { skillCode: "Y3-SP-PR-001", prerequisiteCode: "Y3-SP-HF-001", strength: "required" },
  { skillCode: "Y3-SP-RU-001", prerequisiteCode: "Y3-SP-HF-001", strength: "recommended" },

  // Y3 → Y5
  { skillCode: "Y5-SP-PH-001", prerequisiteCode: "Y3-SP-PH-001", strength: "required" },
  { skillCode: "Y5-SP-MO-001", prerequisiteCode: "Y3-SP-MO-001", strength: "required" },
  { skillCode: "Y5-SP-HF-001", prerequisiteCode: "Y3-SP-HF-001", strength: "required" },
  { skillCode: "Y5-SP-RU-001", prerequisiteCode: "Y3-SP-RU-001", strength: "required" },
  { skillCode: "Y5-SP-PR-001", prerequisiteCode: "Y3-SP-PR-001", strength: "required" },

  // Y5 internal
  { skillCode: "Y5-SP-MO-002", prerequisiteCode: "Y5-SP-MO-001", strength: "required" },
  { skillCode: "Y5-SP-HO-001", prerequisiteCode: "Y5-SP-HF-001", strength: "recommended" },

  // Y5 → Y7
  { skillCode: "Y7-SP-MO-001", prerequisiteCode: "Y5-SP-MO-002", strength: "required" },
  { skillCode: "Y7-SP-MO-002", prerequisiteCode: "Y5-SP-MO-001", strength: "required" },
  { skillCode: "Y7-SP-MO-002", prerequisiteCode: "Y5-SP-RU-001", strength: "required" },
  { skillCode: "Y7-SP-HF-001", prerequisiteCode: "Y5-SP-HF-001", strength: "required" },
  { skillCode: "Y7-SP-PR-001", prerequisiteCode: "Y5-SP-PR-001", strength: "required" },
  { skillCode: "Y7-SP-ET-001", prerequisiteCode: "Y5-SP-MO-002", strength: "required" },
];
