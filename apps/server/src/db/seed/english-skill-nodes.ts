/**
 * ACARA English skill nodes for all English NAPLAN domains:
 * Reading, Spelling, Grammar & Punctuation, and Writing.
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
// GRAMMAR & PUNCTUATION — Years 3–7
// ============================================================

export const grammarPunctuationNodes: SkillNodeSeed[] = [
  // Year 3 Grammar & Punctuation
  {
    code: "Y3-GP-SB-001",
    name: "Sentence boundaries",
    description: "Use capital letters and full stops to mark sentence boundaries correctly",
    yearLevel: 3, domain: "grammar_punctuation", learningArea: "english", strand: "language", subStrand: "grammar_knowledge",
    acaraCode: "AC9E3LA06", dokLevel: 1, difficultyBand: "on_level", displayOrder: 1,
  },
  {
    code: "Y3-GP-SB-002",
    name: "Question marks and exclamation marks",
    description: "Use question marks and exclamation marks correctly at the end of sentences",
    yearLevel: 3, domain: "grammar_punctuation", learningArea: "english", strand: "language", subStrand: "grammar_knowledge",
    dokLevel: 1, difficultyBand: "on_level", displayOrder: 2,
  },
  {
    code: "Y3-GP-NV-001",
    name: "Nouns, verbs, and adjectives",
    description: "Identify and use nouns, verbs, and adjectives in sentences",
    yearLevel: 3, domain: "grammar_punctuation", learningArea: "english", strand: "language", subStrand: "grammar_knowledge",
    acaraCode: "AC9E3LA06", dokLevel: 1, difficultyBand: "on_level", displayOrder: 3,
  },
  {
    code: "Y3-GP-TE-001",
    name: "Simple past and present tense",
    description: "Use past and present tense correctly and consistently in writing",
    yearLevel: 3, domain: "grammar_punctuation", learningArea: "english", strand: "language", subStrand: "grammar_knowledge",
    acaraCode: "AC9E3LA07", dokLevel: 2, difficultyBand: "on_level", displayOrder: 4,
  },
  {
    code: "Y3-GP-AG-001",
    name: "Subject-verb agreement (simple)",
    description: "Ensure subjects and verbs agree in simple sentences (e.g., 'she runs' not 'she run')",
    yearLevel: 3, domain: "grammar_punctuation", learningArea: "english", strand: "language", subStrand: "grammar_knowledge",
    acaraCode: "AC9E3LA08", dokLevel: 2, difficultyBand: "on_level", displayOrder: 5,
  },
  {
    code: "Y3-GP-CM-001",
    name: "Commas in lists",
    description: "Use commas to separate items in a list within a sentence",
    yearLevel: 3, domain: "grammar_punctuation", learningArea: "english", strand: "language", subStrand: "punctuation",
    dokLevel: 1, difficultyBand: "on_level", displayOrder: 6,
  },
  {
    code: "Y3-GP-AP-001",
    name: "Apostrophes for possession",
    description: "Use apostrophes correctly to show possession (e.g., the dog's bone, the girls' room)",
    yearLevel: 3, domain: "grammar_punctuation", learningArea: "english", strand: "language", subStrand: "punctuation",
    dokLevel: 2, difficultyBand: "on_level", displayOrder: 7,
  },

  // Year 5 Grammar & Punctuation
  {
    code: "Y5-GP-SC-001",
    name: "Compound sentences",
    description: "Construct compound sentences using coordinating conjunctions (and, but, or, so, yet)",
    yearLevel: 5, domain: "grammar_punctuation", learningArea: "english", strand: "language", subStrand: "grammar_knowledge",
    acaraCode: "AC9E5LA05", dokLevel: 2, difficultyBand: "on_level", displayOrder: 1,
  },
  {
    code: "Y5-GP-SC-002",
    name: "Complex sentences with subordination",
    description: "Write complex sentences using subordinating conjunctions (because, although, when, if, while)",
    yearLevel: 5, domain: "grammar_punctuation", learningArea: "english", strand: "language", subStrand: "grammar_knowledge",
    acaraCode: "AC9E5LA05", dokLevel: 2, difficultyBand: "on_level", displayOrder: 2,
  },
  {
    code: "Y5-GP-TE-001",
    name: "Verb tense consistency",
    description: "Maintain consistent tense across paragraphs and identify tense shifts",
    yearLevel: 5, domain: "grammar_punctuation", learningArea: "english", strand: "language", subStrand: "grammar_knowledge",
    dokLevel: 2, difficultyBand: "on_level", displayOrder: 3,
  },
  {
    code: "Y5-GP-NG-001",
    name: "Expanded noun groups",
    description: "Build expanded noun groups using adjectives, articles, and prepositional phrases",
    yearLevel: 5, domain: "grammar_punctuation", learningArea: "english", strand: "language", subStrand: "grammar_knowledge",
    acaraCode: "AC9E5LA05", dokLevel: 2, difficultyBand: "on_level", displayOrder: 4,
  },
  {
    code: "Y5-GP-CM-001",
    name: "Commas in complex sentences",
    description: "Use commas after introductory clauses and to separate subordinate clauses",
    yearLevel: 5, domain: "grammar_punctuation", learningArea: "english", strand: "language", subStrand: "punctuation",
    acaraCode: "AC9E5LA09", dokLevel: 2, difficultyBand: "on_level", displayOrder: 5,
  },
  {
    code: "Y5-GP-DP-001",
    name: "Dialogue punctuation",
    description: "Punctuate direct speech correctly using speech marks, commas, and reporting clauses",
    yearLevel: 5, domain: "grammar_punctuation", learningArea: "english", strand: "language", subStrand: "punctuation",
    acaraCode: "AC9E5LA09", dokLevel: 2, difficultyBand: "on_level", displayOrder: 6,
  },
  {
    code: "Y5-GP-PR-001",
    name: "Pronoun reference clarity",
    description: "Use pronouns clearly so the reader knows what each pronoun refers to",
    yearLevel: 5, domain: "grammar_punctuation", learningArea: "english", strand: "language", subStrand: "grammar_knowledge",
    dokLevel: 2, difficultyBand: "on_level", displayOrder: 7,
  },
  {
    code: "Y5-GP-CO-001",
    name: "Connectives and text cohesion",
    description: "Use a range of connectives (however, therefore, meanwhile, in addition) to link ideas across sentences",
    yearLevel: 5, domain: "grammar_punctuation", learningArea: "english", strand: "language", subStrand: "grammar_knowledge",
    acaraCode: "AC9E5LA04", dokLevel: 2, difficultyBand: "on_level", displayOrder: 8,
  },

  // Year 7 Grammar & Punctuation
  {
    code: "Y7-GP-SC-001",
    name: "Compound-complex sentences",
    description: "Construct compound-complex sentences with multiple clauses for effect",
    yearLevel: 7, domain: "grammar_punctuation", learningArea: "english", strand: "language", subStrand: "grammar_knowledge",
    acaraCode: "AC9E7LA05", dokLevel: 3, difficultyBand: "on_level", displayOrder: 1,
  },
  {
    code: "Y7-GP-TE-001",
    name: "Modal verbs and conditional tense",
    description: "Use modal verbs (could, would, should, might) and conditional constructions accurately",
    yearLevel: 7, domain: "grammar_punctuation", learningArea: "english", strand: "language", subStrand: "grammar_knowledge",
    acaraCode: "AC9E7LA05", dokLevel: 2, difficultyBand: "on_level", displayOrder: 2,
  },
  {
    code: "Y7-GP-VO-001",
    name: "Active and passive voice",
    description: "Identify and use active and passive voice for different purposes",
    yearLevel: 7, domain: "grammar_punctuation", learningArea: "english", strand: "language", subStrand: "grammar_knowledge",
    acaraCode: "AC9E7LA06", dokLevel: 2, difficultyBand: "on_level", displayOrder: 3,
  },
  {
    code: "Y7-GP-CM-001",
    name: "Colons, semicolons, and dashes",
    description: "Use colons to introduce lists or explanations, semicolons to link related clauses, and dashes for emphasis",
    yearLevel: 7, domain: "grammar_punctuation", learningArea: "english", strand: "language", subStrand: "punctuation",
    acaraCode: "AC9E7LA09", dokLevel: 2, difficultyBand: "on_level", displayOrder: 4,
  },
  {
    code: "Y7-GP-AG-001",
    name: "Complex subject-verb agreement",
    description: "Maintain subject-verb agreement in complex sentences with intervening clauses",
    yearLevel: 7, domain: "grammar_punctuation", learningArea: "english", strand: "language", subStrand: "grammar_knowledge",
    acaraCode: "AC9E7LA05", dokLevel: 2, difficultyBand: "on_level", displayOrder: 5,
  },
  {
    code: "Y7-GP-CO-001",
    name: "Cohesive devices across paragraphs",
    description: "Use reference chains, substitution, and ellipsis to create cohesion across paragraphs",
    yearLevel: 7, domain: "grammar_punctuation", learningArea: "english", strand: "language", subStrand: "grammar_knowledge",
    acaraCode: "AC9E7LA04", dokLevel: 3, difficultyBand: "on_level", displayOrder: 6,
  },
  {
    code: "Y7-GP-PR-001",
    name: "Proofreading for grammar and punctuation",
    description: "Identify and correct grammatical errors and punctuation mistakes in extended texts",
    yearLevel: 7, domain: "grammar_punctuation", learningArea: "english", strand: "language", subStrand: "grammar_knowledge",
    acaraCode: "AC9E7LA09", dokLevel: 2, difficultyBand: "on_level", displayOrder: 7,
  },
];

// ============================================================
// WRITING — Years 3–7
// Mapped to the 10 NAPLAN writing rubric criteria
// ============================================================

export const writingNodes: SkillNodeSeed[] = [
  // Year 3 Writing
  {
    code: "Y3-WR-AU-001",
    name: "Audience awareness (Year 3)",
    description: "Write with awareness of the reader, using appropriate tone and language for the task",
    yearLevel: 3, domain: "writing", learningArea: "english", strand: "literacy", subStrand: "writing_creation",
    acaraCode: "AC9E3LY06", dokLevel: 2, difficultyBand: "on_level", displayOrder: 1,
  },
  {
    code: "Y3-WR-TS-001",
    name: "Narrative text structure",
    description: "Write narratives with a clear orientation, complication, and resolution",
    yearLevel: 3, domain: "writing", learningArea: "english", strand: "literacy", subStrand: "writing_creation",
    acaraCode: "AC9E3LY06", dokLevel: 2, difficultyBand: "on_level", displayOrder: 2,
  },
  {
    code: "Y3-WR-ID-001",
    name: "Develop ideas with detail",
    description: "Develop ideas with relevant supporting details, descriptions, and examples",
    yearLevel: 3, domain: "writing", learningArea: "english", strand: "literacy", subStrand: "writing_creation",
    dokLevel: 2, difficultyBand: "on_level", displayOrder: 3,
  },
  {
    code: "Y3-WR-CS-001",
    name: "Character and setting (Year 3)",
    description: "Create characters and settings using descriptive language in narratives",
    yearLevel: 3, domain: "writing", learningArea: "english", strand: "literature", subStrand: "writing_creation",
    dokLevel: 2, difficultyBand: "on_level", displayOrder: 4,
  },
  {
    code: "Y3-WR-VC-001",
    name: "Vocabulary choices (Year 3)",
    description: "Select vocabulary appropriate to the topic and text type, including some descriptive language",
    yearLevel: 3, domain: "writing", learningArea: "english", strand: "language", subStrand: "writing_creation",
    acaraCode: "AC9E3LA10", dokLevel: 2, difficultyBand: "on_level", displayOrder: 5,
  },
  {
    code: "Y3-WR-SS-001",
    name: "Simple and compound sentences in writing",
    description: "Write using a mix of simple and compound sentences with correct structure",
    yearLevel: 3, domain: "writing", learningArea: "english", strand: "language", subStrand: "writing_creation",
    dokLevel: 2, difficultyBand: "on_level", displayOrder: 6,
  },

  // Year 5 Writing
  {
    code: "Y5-WR-AU-001",
    name: "Audience and purpose control",
    description: "Adapt writing to suit audience and purpose, adjusting tone, formality, and language choices",
    yearLevel: 5, domain: "writing", learningArea: "english", strand: "literacy", subStrand: "writing_creation",
    acaraCode: "AC9E5LY06", dokLevel: 3, difficultyBand: "on_level", displayOrder: 1,
  },
  {
    code: "Y5-WR-TS-001",
    name: "Persuasive text structure",
    description: "Write persuasive texts with a clear position, supporting arguments, and a conclusion",
    yearLevel: 5, domain: "writing", learningArea: "english", strand: "literacy", subStrand: "writing_creation",
    acaraCode: "AC9E5LA03", dokLevel: 2, difficultyBand: "on_level", displayOrder: 2,
  },
  {
    code: "Y5-WR-CO-001",
    name: "Cohesion and paragraphing",
    description: "Organise writing into cohesive paragraphs using topic sentences, connectives, and reference chains",
    yearLevel: 5, domain: "writing", learningArea: "english", strand: "literacy", subStrand: "writing_creation",
    acaraCode: "AC9E5LA04", dokLevel: 2, difficultyBand: "on_level", displayOrder: 3,
  },
  {
    code: "Y5-WR-ID-001",
    name: "Develop and elaborate ideas",
    description: "Develop ideas with elaboration, evidence, and examples that support the main argument or narrative",
    yearLevel: 5, domain: "writing", learningArea: "english", strand: "literacy", subStrand: "writing_creation",
    dokLevel: 3, difficultyBand: "on_level", displayOrder: 4,
  },
  {
    code: "Y5-WR-VC-001",
    name: "Precise and varied vocabulary",
    description: "Use precise, topic-specific vocabulary and vary word choice to engage the reader",
    yearLevel: 5, domain: "writing", learningArea: "english", strand: "language", subStrand: "writing_creation",
    acaraCode: "AC9E5LA08", dokLevel: 2, difficultyBand: "on_level", displayOrder: 5,
  },
  {
    code: "Y5-WR-SS-001",
    name: "Complex sentence variety",
    description: "Write using a range of simple, compound, and complex sentences for effect",
    yearLevel: 5, domain: "writing", learningArea: "english", strand: "language", subStrand: "writing_creation",
    acaraCode: "AC9E5LA05", dokLevel: 2, difficultyBand: "on_level", displayOrder: 6,
  },

  // Year 7 Writing
  {
    code: "Y7-WR-AU-001",
    name: "Sophisticated audience engagement",
    description: "Engage and persuade readers through deliberate voice, tone, and rhetorical strategies",
    yearLevel: 7, domain: "writing", learningArea: "english", strand: "literacy", subStrand: "writing_creation",
    acaraCode: "AC9E7LY06", dokLevel: 3, difficultyBand: "on_level", displayOrder: 1,
  },
  {
    code: "Y7-WR-TS-001",
    name: "Controlled multi-paragraph structure",
    description: "Structure extended texts with deliberate paragraph organisation, transitions, and conclusion",
    yearLevel: 7, domain: "writing", learningArea: "english", strand: "literacy", subStrand: "writing_creation",
    acaraCode: "AC9E7LA03", dokLevel: 3, difficultyBand: "on_level", displayOrder: 2,
  },
  {
    code: "Y7-WR-ID-001",
    name: "Sustained and nuanced ideas",
    description: "Sustain and develop complex ideas with depth, nuance, and supporting evidence throughout a text",
    yearLevel: 7, domain: "writing", learningArea: "english", strand: "literacy", subStrand: "writing_creation",
    dokLevel: 3, difficultyBand: "on_level", displayOrder: 3,
  },
  {
    code: "Y7-WR-VC-001",
    name: "Sophisticated vocabulary and literary devices",
    description: "Use sophisticated, subject-specific vocabulary and literary devices (metaphor, irony, imagery)",
    yearLevel: 7, domain: "writing", learningArea: "english", strand: "language", subStrand: "writing_creation",
    acaraCode: "AC9E7LA08", dokLevel: 3, difficultyBand: "on_level", displayOrder: 4,
  },
  {
    code: "Y7-WR-SS-001",
    name: "Sentence craft for effect",
    description: "Vary sentence length, structure, and type deliberately for rhetorical and narrative effect",
    yearLevel: 7, domain: "writing", learningArea: "english", strand: "language", subStrand: "writing_creation",
    acaraCode: "AC9E7LA05", dokLevel: 3, difficultyBand: "on_level", displayOrder: 5,
  },
  {
    code: "Y7-WR-CO-001",
    name: "Advanced cohesion and text flow",
    description: "Create seamless text flow using sophisticated cohesive devices, reference chains, and paragraph transitions",
    yearLevel: 7, domain: "writing", learningArea: "english", strand: "literacy", subStrand: "writing_creation",
    acaraCode: "AC9E7LA04", dokLevel: 3, difficultyBand: "on_level", displayOrder: 6,
  },
];

// ============================================================
// GRAMMAR & PUNCTUATION PREREQUISITES
// ============================================================

export const grammarPunctuationPrerequisites: PrerequisiteSeed[] = [
  // Y3 internal
  { skillCode: "Y3-GP-SB-002", prerequisiteCode: "Y3-GP-SB-001", strength: "required" },
  { skillCode: "Y3-GP-TE-001", prerequisiteCode: "Y3-GP-NV-001", strength: "required" },
  { skillCode: "Y3-GP-AG-001", prerequisiteCode: "Y3-GP-NV-001", strength: "required" },
  { skillCode: "Y3-GP-AP-001", prerequisiteCode: "Y3-GP-SB-001", strength: "recommended" },

  // Y3 → Y5
  { skillCode: "Y5-GP-SC-001", prerequisiteCode: "Y3-GP-SB-001", strength: "required" },
  { skillCode: "Y5-GP-SC-001", prerequisiteCode: "Y3-GP-NV-001", strength: "required" },
  { skillCode: "Y5-GP-SC-002", prerequisiteCode: "Y5-GP-SC-001", strength: "required" },
  { skillCode: "Y5-GP-TE-001", prerequisiteCode: "Y3-GP-TE-001", strength: "required" },
  { skillCode: "Y5-GP-CM-001", prerequisiteCode: "Y3-GP-CM-001", strength: "required" },
  { skillCode: "Y5-GP-DP-001", prerequisiteCode: "Y3-GP-SB-002", strength: "required" },
  { skillCode: "Y5-GP-PR-001", prerequisiteCode: "Y3-GP-AG-001", strength: "recommended" },

  // Y5 internal
  { skillCode: "Y5-GP-NG-001", prerequisiteCode: "Y5-GP-SC-001", strength: "recommended" },
  { skillCode: "Y5-GP-CO-001", prerequisiteCode: "Y5-GP-SC-002", strength: "required" },

  // Y5 → Y7
  { skillCode: "Y7-GP-SC-001", prerequisiteCode: "Y5-GP-SC-002", strength: "required" },
  { skillCode: "Y7-GP-TE-001", prerequisiteCode: "Y5-GP-TE-001", strength: "required" },
  { skillCode: "Y7-GP-VO-001", prerequisiteCode: "Y5-GP-SC-002", strength: "required" },
  { skillCode: "Y7-GP-CM-001", prerequisiteCode: "Y5-GP-CM-001", strength: "required" },
  { skillCode: "Y7-GP-AG-001", prerequisiteCode: "Y5-GP-SC-002", strength: "required" },
  { skillCode: "Y7-GP-CO-001", prerequisiteCode: "Y5-GP-CO-001", strength: "required" },
  { skillCode: "Y7-GP-PR-001", prerequisiteCode: "Y5-GP-CM-001", strength: "required" },
  { skillCode: "Y7-GP-PR-001", prerequisiteCode: "Y5-GP-DP-001", strength: "required" },
];

// ============================================================
// WRITING PREREQUISITES
// ============================================================

export const writingPrerequisites: PrerequisiteSeed[] = [
  // Y3 internal
  { skillCode: "Y3-WR-ID-001", prerequisiteCode: "Y3-WR-AU-001", strength: "recommended" },
  { skillCode: "Y3-WR-CS-001", prerequisiteCode: "Y3-WR-TS-001", strength: "required" },
  { skillCode: "Y3-WR-SS-001", prerequisiteCode: "Y3-WR-VC-001", strength: "recommended" },

  // Y3 → Y5
  { skillCode: "Y5-WR-AU-001", prerequisiteCode: "Y3-WR-AU-001", strength: "required" },
  { skillCode: "Y5-WR-TS-001", prerequisiteCode: "Y3-WR-TS-001", strength: "required" },
  { skillCode: "Y5-WR-ID-001", prerequisiteCode: "Y3-WR-ID-001", strength: "required" },
  { skillCode: "Y5-WR-VC-001", prerequisiteCode: "Y3-WR-VC-001", strength: "required" },
  { skillCode: "Y5-WR-SS-001", prerequisiteCode: "Y3-WR-SS-001", strength: "required" },

  // Y5 internal
  { skillCode: "Y5-WR-CO-001", prerequisiteCode: "Y5-WR-TS-001", strength: "required" },

  // Y5 → Y7
  { skillCode: "Y7-WR-AU-001", prerequisiteCode: "Y5-WR-AU-001", strength: "required" },
  { skillCode: "Y7-WR-TS-001", prerequisiteCode: "Y5-WR-CO-001", strength: "required" },
  { skillCode: "Y7-WR-ID-001", prerequisiteCode: "Y5-WR-ID-001", strength: "required" },
  { skillCode: "Y7-WR-VC-001", prerequisiteCode: "Y5-WR-VC-001", strength: "required" },
  { skillCode: "Y7-WR-SS-001", prerequisiteCode: "Y5-WR-SS-001", strength: "required" },
  { skillCode: "Y7-WR-CO-001", prerequisiteCode: "Y5-WR-CO-001", strength: "required" },
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
