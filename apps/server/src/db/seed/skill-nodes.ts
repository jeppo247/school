/**
 * ACARA Year 1–4 Number & Algebra skill nodes.
 *
 * Organised by year level and sub-strand. Each node has a unique code:
 *   Y{year}-NA-{substrand}-{number}
 *
 * Sub-strand codes:
 *   PV = Number and place value
 *   FD = Fractions and decimals
 *   MF = Money and financial mathematics
 *   PA = Patterns and algebra
 */

export interface SkillNodeSeed {
  code: string;
  name: string;
  description: string;
  yearLevel: number;
  domain: string;
  learningArea: string;
  strand: string;
  subStrand: string;
  acaraCode?: string;
  acaraDescription?: string;
  dokLevel: number;
  difficultyBand: string;
  displayOrder: number;
}

export interface PrerequisiteSeed {
  skillCode: string;
  prerequisiteCode: string;
  strength: "required" | "recommended";
}

// ============================================================
// YEAR 1
// ============================================================

const year1Nodes: SkillNodeSeed[] = [
  // Number and place value
  {
    code: "Y1-NA-PV-001",
    name: "Count to and from 20",
    description: "Count forwards and backwards from any starting point between 0 and 20",
    yearLevel: 1, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA001", dokLevel: 1, difficultyBand: "on_level", displayOrder: 1,
  },
  {
    code: "Y1-NA-PV-002",
    name: "Represent numbers to 20",
    description: "Read, write, and represent numbers from 0 to 20 using objects, pictures, and numerals",
    yearLevel: 1, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA001", dokLevel: 1, difficultyBand: "on_level", displayOrder: 2,
  },
  {
    code: "Y1-NA-PV-003",
    name: "Subitise small collections",
    description: "Instantly recognise the number of objects in small collections (1–5) without counting",
    yearLevel: 1, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA003", dokLevel: 1, difficultyBand: "on_level", displayOrder: 3,
  },
  {
    code: "Y1-NA-PV-004",
    name: "Compare and order numbers to 20",
    description: "Compare and order numbers from 0 to 20 using 'more than', 'less than', and 'equal to'",
    yearLevel: 1, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA289", dokLevel: 2, difficultyBand: "on_level", displayOrder: 4,
  },
  {
    code: "Y1-NA-PV-005",
    name: "Count collections to 20",
    description: "Count and compare collections of up to 20 objects, including grouping by tens and ones",
    yearLevel: 1, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA004", dokLevel: 1, difficultyBand: "on_level", displayOrder: 5,
  },
  {
    code: "Y1-NA-PV-006",
    name: "Addition facts to 10",
    description: "Solve simple addition problems using concrete materials and counting strategies for numbers to 10",
    yearLevel: 1, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA005", dokLevel: 2, difficultyBand: "on_level", displayOrder: 6,
  },
  {
    code: "Y1-NA-PV-007",
    name: "Subtraction facts to 10",
    description: "Solve simple subtraction problems using concrete materials and counting back for numbers to 10",
    yearLevel: 1, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA005", dokLevel: 2, difficultyBand: "on_level", displayOrder: 7,
  },
  {
    code: "Y1-NA-PV-008",
    name: "Number bonds to 10",
    description: "Know pairs of numbers that make 10 (e.g., 3+7, 4+6, 5+5)",
    yearLevel: 1, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA005", dokLevel: 2, difficultyBand: "on_level", displayOrder: 8,
  },
  {
    code: "Y1-NA-PV-009",
    name: "Addition and subtraction word problems to 10",
    description: "Solve simple word problems involving addition and subtraction with numbers to 10",
    yearLevel: 1, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA006", dokLevel: 3, difficultyBand: "on_level", displayOrder: 9,
  },
  // Fractions
  {
    code: "Y1-NA-FD-001",
    name: "Recognise halves",
    description: "Recognise and describe halves as one of two equal parts of a whole",
    yearLevel: 1, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "fractions_decimals",
    acaraCode: "ACMNA016", dokLevel: 1, difficultyBand: "on_level", displayOrder: 10,
  },
  // Money
  {
    code: "Y1-NA-MF-001",
    name: "Recognise Australian coins",
    description: "Recognise, describe, and order Australian coins according to their value",
    yearLevel: 1, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "money_financial",
    acaraCode: "ACMNA017", dokLevel: 1, difficultyBand: "on_level", displayOrder: 11,
  },
  // Patterns
  {
    code: "Y1-NA-PA-001",
    name: "Investigate and describe number patterns",
    description: "Investigate and describe number patterns formed by skip counting and patterns with objects",
    yearLevel: 1, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "patterns_algebra",
    acaraCode: "ACMNA018", dokLevel: 2, difficultyBand: "on_level", displayOrder: 12,
  },
  {
    code: "Y1-NA-PA-002",
    name: "Skip counting by 2s, 5s, and 10s",
    description: "Skip count forwards and backwards by 2s, 5s, and 10s from any starting point",
    yearLevel: 1, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "patterns_algebra",
    acaraCode: "ACMNA012", dokLevel: 1, difficultyBand: "on_level", displayOrder: 13,
  },
];

// ============================================================
// YEAR 2
// ============================================================

const year2Nodes: SkillNodeSeed[] = [
  // Number and place value
  {
    code: "Y2-NA-PV-001",
    name: "Count to and from 100",
    description: "Count forwards and backwards from any starting point between 0 and 100",
    yearLevel: 2, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA027", dokLevel: 1, difficultyBand: "on_level", displayOrder: 1,
  },
  {
    code: "Y2-NA-PV-002",
    name: "Place value: tens and ones",
    description: "Recognise, model, read, write, and order numbers to at least 100, understanding tens and ones",
    yearLevel: 2, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA027", dokLevel: 2, difficultyBand: "on_level", displayOrder: 2,
  },
  {
    code: "Y2-NA-PV-003",
    name: "Partition numbers to 100",
    description: "Partition numbers into tens and ones (e.g., 47 = 40 + 7 = 4 tens and 7 ones)",
    yearLevel: 2, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA028", dokLevel: 2, difficultyBand: "on_level", displayOrder: 3,
  },
  {
    code: "Y2-NA-PV-004",
    name: "Compare and order numbers to 100",
    description: "Compare and order two-digit numbers using place value understanding",
    yearLevel: 2, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA289", dokLevel: 2, difficultyBand: "on_level", displayOrder: 4,
  },
  {
    code: "Y2-NA-PV-005",
    name: "Addition to 20 (mental strategies)",
    description: "Use mental strategies to add single-digit numbers and multiples of 10 up to 20",
    yearLevel: 2, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA030", dokLevel: 2, difficultyBand: "on_level", displayOrder: 5,
  },
  {
    code: "Y2-NA-PV-006",
    name: "Subtraction to 20 (mental strategies)",
    description: "Use mental strategies to subtract single-digit numbers from numbers up to 20",
    yearLevel: 2, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA030", dokLevel: 2, difficultyBand: "on_level", displayOrder: 6,
  },
  {
    code: "Y2-NA-PV-007",
    name: "Addition of two-digit numbers (no regrouping)",
    description: "Add two-digit numbers without regrouping (e.g., 23 + 14)",
    yearLevel: 2, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA030", dokLevel: 2, difficultyBand: "on_level", displayOrder: 7,
  },
  {
    code: "Y2-NA-PV-008",
    name: "Subtraction of two-digit numbers (no regrouping)",
    description: "Subtract two-digit numbers without regrouping (e.g., 48 - 23)",
    yearLevel: 2, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA030", dokLevel: 2, difficultyBand: "on_level", displayOrder: 8,
  },
  {
    code: "Y2-NA-PV-009",
    name: "Number bonds to 20",
    description: "Know pairs of numbers that add to 20 and use them for mental calculation",
    yearLevel: 2, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA030", dokLevel: 2, difficultyBand: "on_level", displayOrder: 9,
  },
  {
    code: "Y2-NA-PV-010",
    name: "Represent multiplication as groups",
    description: "Recognise and represent multiplication as repeated addition and groups/arrays",
    yearLevel: 2, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA031", dokLevel: 2, difficultyBand: "on_level", displayOrder: 10,
  },
  {
    code: "Y2-NA-PV-011",
    name: "Represent division as sharing",
    description: "Recognise and represent division as sharing equally and grouping",
    yearLevel: 2, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA032", dokLevel: 2, difficultyBand: "on_level", displayOrder: 11,
  },
  {
    code: "Y2-NA-PV-012",
    name: "Addition and subtraction word problems to 100",
    description: "Solve word problems involving addition and subtraction with two-digit numbers",
    yearLevel: 2, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA030", dokLevel: 3, difficultyBand: "on_level", displayOrder: 12,
  },
  {
    code: "Y2-NA-PV-013",
    name: "Odd and even numbers",
    description: "Identify and describe odd and even numbers",
    yearLevel: 2, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA051", dokLevel: 1, difficultyBand: "on_level", displayOrder: 13,
  },
  // Fractions
  {
    code: "Y2-NA-FD-001",
    name: "Halves, quarters, and eighths",
    description: "Recognise and interpret common uses of halves, quarters, and eighths of shapes and collections",
    yearLevel: 2, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "fractions_decimals",
    acaraCode: "ACMNA033", dokLevel: 2, difficultyBand: "on_level", displayOrder: 14,
  },
  // Money
  {
    code: "Y2-NA-MF-001",
    name: "Count collections of coins and notes",
    description: "Count and order small collections of Australian coins and notes according to their value",
    yearLevel: 2, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "money_financial",
    acaraCode: "ACMNA034", dokLevel: 2, difficultyBand: "on_level", displayOrder: 15,
  },
  // Patterns
  {
    code: "Y2-NA-PA-001",
    name: "Describe patterns in number sequences",
    description: "Describe patterns in number sequences involving 2s, 3s, 5s, and 10s",
    yearLevel: 2, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "patterns_algebra",
    acaraCode: "ACMNA035", dokLevel: 2, difficultyBand: "on_level", displayOrder: 16,
  },
  {
    code: "Y2-NA-PA-002",
    name: "Skip counting by 3s",
    description: "Skip count forwards and backwards by 3s from any starting point",
    yearLevel: 2, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "patterns_algebra",
    acaraCode: "ACMNA026", dokLevel: 1, difficultyBand: "on_level", displayOrder: 17,
  },
];

// ============================================================
// YEAR 3
// ============================================================

const year3Nodes: SkillNodeSeed[] = [
  // Number and place value
  {
    code: "Y3-NA-PV-001",
    name: "Count to and from 1000",
    description: "Count forwards and backwards by ones, tens, and hundreds from any starting point to 1000",
    yearLevel: 3, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA052", dokLevel: 1, difficultyBand: "on_level", displayOrder: 1,
  },
  {
    code: "Y3-NA-PV-002",
    name: "Place value: hundreds, tens, and ones",
    description: "Recognise, model, represent, and order numbers to at least 1000",
    yearLevel: 3, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA052", dokLevel: 2, difficultyBand: "on_level", displayOrder: 2,
  },
  {
    code: "Y3-NA-PV-003",
    name: "Partition three-digit numbers",
    description: "Partition numbers into hundreds, tens, and ones (e.g., 365 = 300 + 60 + 5)",
    yearLevel: 3, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA053", dokLevel: 2, difficultyBand: "on_level", displayOrder: 3,
  },
  {
    code: "Y3-NA-PV-004",
    name: "Compare and order numbers to 1000",
    description: "Compare and order three-digit numbers using place value understanding",
    yearLevel: 3, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA052", dokLevel: 2, difficultyBand: "on_level", displayOrder: 4,
  },
  {
    code: "Y3-NA-PV-005",
    name: "Addition of two-digit numbers (with regrouping)",
    description: "Add two-digit numbers with regrouping/carrying (e.g., 47 + 38)",
    yearLevel: 3, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA055", dokLevel: 2, difficultyBand: "on_level", displayOrder: 5,
  },
  {
    code: "Y3-NA-PV-006",
    name: "Subtraction of two-digit numbers (with regrouping)",
    description: "Subtract two-digit numbers with regrouping/borrowing (e.g., 63 - 28)",
    yearLevel: 3, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA055", dokLevel: 2, difficultyBand: "on_level", displayOrder: 6,
  },
  {
    code: "Y3-NA-PV-007",
    name: "Addition of three-digit numbers",
    description: "Add three-digit numbers using written and mental strategies",
    yearLevel: 3, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA055", dokLevel: 2, difficultyBand: "on_level", displayOrder: 7,
  },
  {
    code: "Y3-NA-PV-008",
    name: "Subtraction of three-digit numbers",
    description: "Subtract three-digit numbers using written and mental strategies",
    yearLevel: 3, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA055", dokLevel: 2, difficultyBand: "on_level", displayOrder: 8,
  },
  {
    code: "Y3-NA-PV-009",
    name: "Multiplication facts: 2s, 5s, and 10s",
    description: "Recall multiplication facts for 2, 5, and 10 and use related division facts",
    yearLevel: 3, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA056", dokLevel: 1, difficultyBand: "on_level", displayOrder: 9,
  },
  {
    code: "Y3-NA-PV-010",
    name: "Multiplication facts: 3s and 4s",
    description: "Recall multiplication facts for 3 and 4 and use related division facts",
    yearLevel: 3, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA056", dokLevel: 1, difficultyBand: "on_level", displayOrder: 10,
  },
  {
    code: "Y3-NA-PV-011",
    name: "Multiplication word problems",
    description: "Solve word problems involving multiplication using known facts and strategies",
    yearLevel: 3, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA057", dokLevel: 3, difficultyBand: "on_level", displayOrder: 11,
  },
  {
    code: "Y3-NA-PV-012",
    name: "Division word problems",
    description: "Solve word problems involving division including sharing and grouping",
    yearLevel: 3, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA057", dokLevel: 3, difficultyBand: "on_level", displayOrder: 12,
  },
  {
    code: "Y3-NA-PV-013",
    name: "Addition and subtraction word problems to 1000",
    description: "Solve multi-step word problems involving addition and subtraction with three-digit numbers",
    yearLevel: 3, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA055", dokLevel: 3, difficultyBand: "on_level", displayOrder: 13,
  },
  {
    code: "Y3-NA-PV-014",
    name: "Rounding to nearest 10 and 100",
    description: "Round numbers to the nearest 10 or 100 for estimation",
    yearLevel: 3, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA054", dokLevel: 2, difficultyBand: "on_level", displayOrder: 14,
  },
  // Fractions
  {
    code: "Y3-NA-FD-001",
    name: "Model and represent unit fractions",
    description: "Model and represent unit fractions including 1/2, 1/4, 1/3, 1/5 and their multiples",
    yearLevel: 3, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "fractions_decimals",
    acaraCode: "ACMNA058", dokLevel: 2, difficultyBand: "on_level", displayOrder: 15,
  },
  {
    code: "Y3-NA-FD-002",
    name: "Locate fractions on a number line",
    description: "Locate unit fractions on a number line from 0 to 1",
    yearLevel: 3, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "fractions_decimals",
    acaraCode: "ACMNA058", dokLevel: 2, difficultyBand: "on_level", displayOrder: 16,
  },
  // Money
  {
    code: "Y3-NA-MF-001",
    name: "Represent money values",
    description: "Represent money values in multiple ways and count the change required for simple transactions",
    yearLevel: 3, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "money_financial",
    acaraCode: "ACMNA059", dokLevel: 2, difficultyBand: "on_level", displayOrder: 17,
  },
  {
    code: "Y3-NA-MF-002",
    name: "Calculate change",
    description: "Calculate change from simple purchases involving whole dollar amounts",
    yearLevel: 3, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "money_financial",
    acaraCode: "ACMNA059", dokLevel: 3, difficultyBand: "on_level", displayOrder: 18,
  },
  // Patterns
  {
    code: "Y3-NA-PA-001",
    name: "Describe and create number patterns",
    description: "Describe, continue, and create number patterns resulting from performing addition or subtraction",
    yearLevel: 3, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "patterns_algebra",
    acaraCode: "ACMNA060", dokLevel: 2, difficultyBand: "on_level", displayOrder: 19,
  },
];

// ============================================================
// YEAR 4
// ============================================================

const year4Nodes: SkillNodeSeed[] = [
  // Number and place value
  {
    code: "Y4-NA-PV-001",
    name: "Place value: thousands",
    description: "Recognise, represent, and order numbers to at least tens of thousands",
    yearLevel: 4, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA072", dokLevel: 2, difficultyBand: "on_level", displayOrder: 1,
  },
  {
    code: "Y4-NA-PV-002",
    name: "Read and write five-digit numbers",
    description: "Read, write, and represent numbers up to 99,999 in expanded and standard form",
    yearLevel: 4, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA072", dokLevel: 2, difficultyBand: "on_level", displayOrder: 2,
  },
  {
    code: "Y4-NA-PV-003",
    name: "Compare and order large numbers",
    description: "Compare and order numbers to tens of thousands using place value",
    yearLevel: 4, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA072", dokLevel: 2, difficultyBand: "on_level", displayOrder: 3,
  },
  {
    code: "Y4-NA-PV-004",
    name: "Addition of four-digit numbers",
    description: "Add numbers with up to four digits using written algorithms",
    yearLevel: 4, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA076", dokLevel: 2, difficultyBand: "on_level", displayOrder: 4,
  },
  {
    code: "Y4-NA-PV-005",
    name: "Subtraction of four-digit numbers",
    description: "Subtract numbers with up to four digits using written algorithms",
    yearLevel: 4, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA076", dokLevel: 2, difficultyBand: "on_level", displayOrder: 5,
  },
  {
    code: "Y4-NA-PV-006",
    name: "Multiplication facts to 10×10",
    description: "Recall multiplication facts up to 10×10 and related division facts",
    yearLevel: 4, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA075", dokLevel: 1, difficultyBand: "on_level", displayOrder: 6,
  },
  {
    code: "Y4-NA-PV-007",
    name: "Multiply two-digit by one-digit",
    description: "Multiply two-digit numbers by one-digit numbers using mental and written strategies",
    yearLevel: 4, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA076", dokLevel: 2, difficultyBand: "on_level", displayOrder: 7,
  },
  {
    code: "Y4-NA-PV-008",
    name: "Divide two-digit by one-digit",
    description: "Divide two-digit numbers by one-digit numbers with and without remainders",
    yearLevel: 4, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA076", dokLevel: 2, difficultyBand: "on_level", displayOrder: 8,
  },
  {
    code: "Y4-NA-PV-009",
    name: "Multi-step word problems (four operations)",
    description: "Solve multi-step word problems using any combination of the four operations",
    yearLevel: 4, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA076", dokLevel: 3, difficultyBand: "on_level", displayOrder: 9,
  },
  {
    code: "Y4-NA-PV-010",
    name: "Rounding and estimation",
    description: "Use rounding to estimate answers and check reasonableness of calculations",
    yearLevel: 4, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA073", dokLevel: 2, difficultyBand: "on_level", displayOrder: 10,
  },
  {
    code: "Y4-NA-PV-011",
    name: "Factors and multiples",
    description: "Investigate number sequences involving multiples of 2, 3, 4, 5, and 10 and identify factors",
    yearLevel: 4, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA074", dokLevel: 2, difficultyBand: "on_level", displayOrder: 11,
  },
  {
    code: "Y4-NA-PV-012",
    name: "Properties of odd and even numbers",
    description: "Investigate and use properties of odd and even numbers in calculations",
    yearLevel: 4, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "number_place_value",
    acaraCode: "ACMNA071", dokLevel: 2, difficultyBand: "on_level", displayOrder: 12,
  },
  // Fractions and decimals
  {
    code: "Y4-NA-FD-001",
    name: "Equivalent fractions",
    description: "Investigate equivalent fractions used in contexts (e.g., 1/2 = 2/4 = 3/6)",
    yearLevel: 4, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "fractions_decimals",
    acaraCode: "ACMNA077", dokLevel: 2, difficultyBand: "on_level", displayOrder: 13,
  },
  {
    code: "Y4-NA-FD-002",
    name: "Compare and order fractions",
    description: "Count by quarters, halves, and thirds, and locate fractions on a number line",
    yearLevel: 4, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "fractions_decimals",
    acaraCode: "ACMNA078", dokLevel: 2, difficultyBand: "on_level", displayOrder: 14,
  },
  {
    code: "Y4-NA-FD-003",
    name: "Decimals: tenths",
    description: "Recognise that the place value system can be extended to tenths and hundredths",
    yearLevel: 4, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "fractions_decimals",
    acaraCode: "ACMNA079", dokLevel: 2, difficultyBand: "on_level", displayOrder: 15,
  },
  {
    code: "Y4-NA-FD-004",
    name: "Connect fractions and decimals",
    description: "Make connections between fraction and decimal notation (e.g., 1/2 = 0.5, 1/4 = 0.25)",
    yearLevel: 4, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "fractions_decimals",
    acaraCode: "ACMNA079", dokLevel: 2, difficultyBand: "on_level", displayOrder: 16,
  },
  // Money
  {
    code: "Y4-NA-MF-001",
    name: "Solve problems involving purchases",
    description: "Solve problems involving purchases and the calculation of change to the nearest 5 cents",
    yearLevel: 4, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "money_financial",
    acaraCode: "ACMNA080", dokLevel: 3, difficultyBand: "on_level", displayOrder: 17,
  },
  // Patterns
  {
    code: "Y4-NA-PA-001",
    name: "Number patterns with multiplication",
    description: "Explore and describe number patterns resulting from multiplication",
    yearLevel: 4, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "patterns_algebra",
    acaraCode: "ACMNA081", dokLevel: 2, difficultyBand: "on_level", displayOrder: 18,
  },
  {
    code: "Y4-NA-PA-002",
    name: "Use equivalent number sentences",
    description: "Use equivalent number sentences involving addition and subtraction to find unknown quantities",
    yearLevel: 4, domain: "numeracy", learningArea: "mathematics", strand: "number_algebra", subStrand: "patterns_algebra",
    acaraCode: "ACMNA083", dokLevel: 3, difficultyBand: "on_level", displayOrder: 19,
  },
];

// ============================================================
// PREREQUISITES (DAG edges)
// ============================================================

export const prerequisites: PrerequisiteSeed[] = [
  // Year 1 internal
  { skillCode: "Y1-NA-PV-002", prerequisiteCode: "Y1-NA-PV-001", strength: "required" },
  { skillCode: "Y1-NA-PV-004", prerequisiteCode: "Y1-NA-PV-002", strength: "required" },
  { skillCode: "Y1-NA-PV-005", prerequisiteCode: "Y1-NA-PV-001", strength: "required" },
  { skillCode: "Y1-NA-PV-006", prerequisiteCode: "Y1-NA-PV-003", strength: "recommended" },
  { skillCode: "Y1-NA-PV-006", prerequisiteCode: "Y1-NA-PV-005", strength: "required" },
  { skillCode: "Y1-NA-PV-007", prerequisiteCode: "Y1-NA-PV-006", strength: "required" },
  { skillCode: "Y1-NA-PV-008", prerequisiteCode: "Y1-NA-PV-006", strength: "required" },
  { skillCode: "Y1-NA-PV-009", prerequisiteCode: "Y1-NA-PV-006", strength: "required" },
  { skillCode: "Y1-NA-PV-009", prerequisiteCode: "Y1-NA-PV-007", strength: "required" },
  { skillCode: "Y1-NA-PA-002", prerequisiteCode: "Y1-NA-PV-001", strength: "required" },

  // Year 1 → Year 2
  { skillCode: "Y2-NA-PV-001", prerequisiteCode: "Y1-NA-PV-001", strength: "required" },
  { skillCode: "Y2-NA-PV-002", prerequisiteCode: "Y1-NA-PV-002", strength: "required" },
  { skillCode: "Y2-NA-PV-005", prerequisiteCode: "Y1-NA-PV-006", strength: "required" },
  { skillCode: "Y2-NA-PV-005", prerequisiteCode: "Y1-NA-PV-008", strength: "required" },
  { skillCode: "Y2-NA-PV-006", prerequisiteCode: "Y1-NA-PV-007", strength: "required" },
  { skillCode: "Y2-NA-FD-001", prerequisiteCode: "Y1-NA-FD-001", strength: "required" },
  { skillCode: "Y2-NA-MF-001", prerequisiteCode: "Y1-NA-MF-001", strength: "required" },
  { skillCode: "Y2-NA-PA-001", prerequisiteCode: "Y1-NA-PA-001", strength: "required" },
  { skillCode: "Y2-NA-PA-002", prerequisiteCode: "Y1-NA-PA-002", strength: "required" },

  // Year 2 internal
  { skillCode: "Y2-NA-PV-003", prerequisiteCode: "Y2-NA-PV-002", strength: "required" },
  { skillCode: "Y2-NA-PV-004", prerequisiteCode: "Y2-NA-PV-002", strength: "required" },
  { skillCode: "Y2-NA-PV-007", prerequisiteCode: "Y2-NA-PV-003", strength: "required" },
  { skillCode: "Y2-NA-PV-007", prerequisiteCode: "Y2-NA-PV-005", strength: "required" },
  { skillCode: "Y2-NA-PV-008", prerequisiteCode: "Y2-NA-PV-003", strength: "required" },
  { skillCode: "Y2-NA-PV-008", prerequisiteCode: "Y2-NA-PV-006", strength: "required" },
  { skillCode: "Y2-NA-PV-009", prerequisiteCode: "Y2-NA-PV-005", strength: "required" },
  { skillCode: "Y2-NA-PV-010", prerequisiteCode: "Y2-NA-PV-005", strength: "required" },
  { skillCode: "Y2-NA-PV-011", prerequisiteCode: "Y2-NA-PV-006", strength: "required" },
  { skillCode: "Y2-NA-PV-012", prerequisiteCode: "Y2-NA-PV-007", strength: "required" },
  { skillCode: "Y2-NA-PV-012", prerequisiteCode: "Y2-NA-PV-008", strength: "required" },
  { skillCode: "Y2-NA-PV-013", prerequisiteCode: "Y2-NA-PV-001", strength: "recommended" },

  // Year 2 → Year 3
  { skillCode: "Y3-NA-PV-001", prerequisiteCode: "Y2-NA-PV-001", strength: "required" },
  { skillCode: "Y3-NA-PV-002", prerequisiteCode: "Y2-NA-PV-002", strength: "required" },
  { skillCode: "Y3-NA-PV-005", prerequisiteCode: "Y2-NA-PV-007", strength: "required" },
  { skillCode: "Y3-NA-PV-006", prerequisiteCode: "Y2-NA-PV-008", strength: "required" },
  { skillCode: "Y3-NA-PV-009", prerequisiteCode: "Y2-NA-PV-010", strength: "required" },
  { skillCode: "Y3-NA-PV-010", prerequisiteCode: "Y2-NA-PV-010", strength: "required" },
  { skillCode: "Y3-NA-FD-001", prerequisiteCode: "Y2-NA-FD-001", strength: "required" },
  { skillCode: "Y3-NA-MF-001", prerequisiteCode: "Y2-NA-MF-001", strength: "required" },
  { skillCode: "Y3-NA-PA-001", prerequisiteCode: "Y2-NA-PA-001", strength: "required" },

  // Year 3 internal
  { skillCode: "Y3-NA-PV-003", prerequisiteCode: "Y3-NA-PV-002", strength: "required" },
  { skillCode: "Y3-NA-PV-004", prerequisiteCode: "Y3-NA-PV-002", strength: "required" },
  { skillCode: "Y3-NA-PV-007", prerequisiteCode: "Y3-NA-PV-005", strength: "required" },
  { skillCode: "Y3-NA-PV-007", prerequisiteCode: "Y3-NA-PV-003", strength: "required" },
  { skillCode: "Y3-NA-PV-008", prerequisiteCode: "Y3-NA-PV-006", strength: "required" },
  { skillCode: "Y3-NA-PV-008", prerequisiteCode: "Y3-NA-PV-003", strength: "required" },
  { skillCode: "Y3-NA-PV-011", prerequisiteCode: "Y3-NA-PV-009", strength: "required" },
  { skillCode: "Y3-NA-PV-012", prerequisiteCode: "Y3-NA-PV-011", strength: "recommended" },
  { skillCode: "Y3-NA-PV-013", prerequisiteCode: "Y3-NA-PV-007", strength: "required" },
  { skillCode: "Y3-NA-PV-013", prerequisiteCode: "Y3-NA-PV-008", strength: "required" },
  { skillCode: "Y3-NA-PV-014", prerequisiteCode: "Y3-NA-PV-002", strength: "required" },
  { skillCode: "Y3-NA-FD-002", prerequisiteCode: "Y3-NA-FD-001", strength: "required" },
  { skillCode: "Y3-NA-MF-002", prerequisiteCode: "Y3-NA-MF-001", strength: "required" },

  // Year 3 → Year 4
  { skillCode: "Y4-NA-PV-001", prerequisiteCode: "Y3-NA-PV-002", strength: "required" },
  { skillCode: "Y4-NA-PV-004", prerequisiteCode: "Y3-NA-PV-007", strength: "required" },
  { skillCode: "Y4-NA-PV-005", prerequisiteCode: "Y3-NA-PV-008", strength: "required" },
  { skillCode: "Y4-NA-PV-006", prerequisiteCode: "Y3-NA-PV-009", strength: "required" },
  { skillCode: "Y4-NA-PV-006", prerequisiteCode: "Y3-NA-PV-010", strength: "required" },
  { skillCode: "Y4-NA-FD-001", prerequisiteCode: "Y3-NA-FD-001", strength: "required" },
  { skillCode: "Y4-NA-MF-001", prerequisiteCode: "Y3-NA-MF-002", strength: "required" },
  { skillCode: "Y4-NA-PA-001", prerequisiteCode: "Y3-NA-PA-001", strength: "required" },

  // Year 4 internal
  { skillCode: "Y4-NA-PV-002", prerequisiteCode: "Y4-NA-PV-001", strength: "required" },
  { skillCode: "Y4-NA-PV-003", prerequisiteCode: "Y4-NA-PV-001", strength: "required" },
  { skillCode: "Y4-NA-PV-004", prerequisiteCode: "Y4-NA-PV-001", strength: "required" },
  { skillCode: "Y4-NA-PV-005", prerequisiteCode: "Y4-NA-PV-001", strength: "required" },
  { skillCode: "Y4-NA-PV-007", prerequisiteCode: "Y4-NA-PV-006", strength: "required" },
  { skillCode: "Y4-NA-PV-008", prerequisiteCode: "Y4-NA-PV-006", strength: "required" },
  { skillCode: "Y4-NA-PV-009", prerequisiteCode: "Y4-NA-PV-004", strength: "required" },
  { skillCode: "Y4-NA-PV-009", prerequisiteCode: "Y4-NA-PV-005", strength: "required" },
  { skillCode: "Y4-NA-PV-009", prerequisiteCode: "Y4-NA-PV-007", strength: "required" },
  { skillCode: "Y4-NA-PV-009", prerequisiteCode: "Y4-NA-PV-008", strength: "required" },
  { skillCode: "Y4-NA-PV-010", prerequisiteCode: "Y4-NA-PV-001", strength: "required" },
  { skillCode: "Y4-NA-PV-011", prerequisiteCode: "Y4-NA-PV-006", strength: "required" },
  { skillCode: "Y4-NA-PV-012", prerequisiteCode: "Y2-NA-PV-013", strength: "required" },
  { skillCode: "Y4-NA-FD-002", prerequisiteCode: "Y4-NA-FD-001", strength: "required" },
  { skillCode: "Y4-NA-FD-003", prerequisiteCode: "Y4-NA-PV-001", strength: "required" },
  { skillCode: "Y4-NA-FD-004", prerequisiteCode: "Y4-NA-FD-001", strength: "required" },
  { skillCode: "Y4-NA-FD-004", prerequisiteCode: "Y4-NA-FD-003", strength: "required" },
  { skillCode: "Y4-NA-PA-002", prerequisiteCode: "Y4-NA-PV-004", strength: "required" },
  { skillCode: "Y4-NA-PA-002", prerequisiteCode: "Y4-NA-PV-005", strength: "required" },
];

export const allSkillNodes: SkillNodeSeed[] = [
  ...year1Nodes,
  ...year2Nodes,
  ...year3Nodes,
  ...year4Nodes,
];
