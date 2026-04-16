/**
 * Starter question bank for the diagnostic assessment.
 * These are hand-crafted, validated questions covering key skills
 * across Numeracy, Reading, and Spelling for Y1-4.
 *
 * Each question is tied to a skill node code and pre-validated.
 * The diagnostic engine will use these for the initial adaptive assessment.
 */

export interface StarterQuestion {
  skillCode: string;
  questionType: string;
  difficultyParam: number;
  content: {
    stem: string;
    answer: string | number;
    options?: string[];
    explanation: string;
    hint: string;
  };
}

export const starterQuestions: StarterQuestion[] = [
  // ============================================================
  // YEAR 1 NUMERACY
  // ============================================================
  {
    skillCode: "Y1-NA-PV-001",
    questionType: "multiple_choice",
    difficultyParam: -1.5,
    content: {
      stem: "What number comes after 7?",
      answer: "8",
      options: ["6", "7", "8", "9"],
      explanation: "When we count forward from 7, the next number is 8.",
      hint: "Try counting: 5, 6, 7, ...",
    },
  },
  {
    skillCode: "Y1-NA-PV-001",
    questionType: "multiple_choice",
    difficultyParam: -1.0,
    content: {
      stem: "What number comes before 12?",
      answer: "11",
      options: ["10", "11", "13", "14"],
      explanation: "When we count backward from 12, the number before it is 11.",
      hint: "Try counting backwards: 14, 13, 12, ...",
    },
  },
  {
    skillCode: "Y1-NA-PV-006",
    questionType: "multiple_choice",
    difficultyParam: -1.0,
    content: {
      stem: "What is 3 + 5?",
      answer: "8",
      options: ["7", "8", "9", "10"],
      explanation: "3 + 5 = 8. You can count on from 3: four, five, six, seven, eight!",
      hint: "Start at 3 and count on 5 more.",
    },
  },
  {
    skillCode: "Y1-NA-PV-007",
    questionType: "multiple_choice",
    difficultyParam: -0.8,
    content: {
      stem: "What is 9 - 4?",
      answer: "5",
      options: ["3", "4", "5", "6"],
      explanation: "9 - 4 = 5. Starting at 9, count back 4: eight, seven, six, five.",
      hint: "Start at 9 and count back 4.",
    },
  },
  {
    skillCode: "Y1-NA-PV-008",
    questionType: "multiple_choice",
    difficultyParam: -0.5,
    content: {
      stem: "Which two numbers make 10?",
      answer: "3 and 7",
      options: ["3 and 7", "4 and 5", "2 and 9", "6 and 3"],
      explanation: "3 + 7 = 10. These are number bonds to 10!",
      hint: "Think about pairs that add up to 10.",
    },
  },

  // ============================================================
  // YEAR 2 NUMERACY
  // ============================================================
  {
    skillCode: "Y2-NA-PV-002",
    questionType: "multiple_choice",
    difficultyParam: -0.5,
    content: {
      stem: "What is the value of the 4 in the number 47?",
      answer: "40",
      options: ["4", "40", "47", "7"],
      explanation: "In the number 47, the 4 is in the tens place, so it means 40.",
      hint: "The 4 is in the tens column. What does that mean?",
    },
  },
  {
    skillCode: "Y2-NA-PV-005",
    questionType: "numeric_input",
    difficultyParam: -0.3,
    content: {
      stem: "What is 14 + 5?",
      answer: 19,
      explanation: "14 + 5 = 19. The ones: 4 + 5 = 9. The tens stay the same: 1 ten = 10. So 10 + 9 = 19.",
      hint: "Add the ones first: 4 + 5 = ?",
    },
  },
  {
    skillCode: "Y2-NA-PV-007",
    questionType: "numeric_input",
    difficultyParam: 0,
    content: {
      stem: "What is 23 + 14?",
      answer: 37,
      explanation: "23 + 14 = 37. Ones: 3 + 4 = 7. Tens: 2 + 1 = 3. So 37.",
      hint: "Add the ones column first, then the tens column.",
    },
  },
  {
    skillCode: "Y2-NA-PV-010",
    questionType: "multiple_choice",
    difficultyParam: 0,
    content: {
      stem: "There are 3 bags with 4 apples in each bag. How many apples are there altogether?",
      answer: "12",
      options: ["7", "10", "12", "14"],
      explanation: "3 groups of 4 = 3 × 4 = 12 apples.",
      hint: "Count by fours: 4, 8, ...",
    },
  },

  // ============================================================
  // YEAR 3 NUMERACY
  // ============================================================
  {
    skillCode: "Y3-NA-PV-002",
    questionType: "multiple_choice",
    difficultyParam: 0.3,
    content: {
      stem: "What is 365 written in expanded form?",
      answer: "300 + 60 + 5",
      options: ["300 + 60 + 5", "3 + 6 + 5", "360 + 5", "30 + 65"],
      explanation: "365 = 3 hundreds + 6 tens + 5 ones = 300 + 60 + 5.",
      hint: "Break the number into hundreds, tens, and ones.",
    },
  },
  {
    skillCode: "Y3-NA-PV-005",
    questionType: "numeric_input",
    difficultyParam: 0.5,
    content: {
      stem: "What is 47 + 38?",
      answer: 85,
      explanation: "47 + 38 = 85. Ones: 7 + 8 = 15, write 5 carry 1. Tens: 4 + 3 + 1 = 8. So 85.",
      hint: "Add the ones first: 7 + 8. Remember to carry!",
    },
  },
  {
    skillCode: "Y3-NA-PV-006",
    questionType: "numeric_input",
    difficultyParam: 0.5,
    content: {
      stem: "What is 63 - 28?",
      answer: 35,
      explanation: "63 - 28 = 35. Ones: 3 - 8, borrow: 13 - 8 = 5. Tens: 5 - 2 = 3. So 35.",
      hint: "You can't take 8 from 3, so you need to borrow from the tens.",
    },
  },
  {
    skillCode: "Y3-NA-PV-009",
    questionType: "multiple_choice",
    difficultyParam: 0.6,
    content: {
      stem: "What is 6 × 5?",
      answer: "30",
      options: ["25", "30", "35", "36"],
      explanation: "6 × 5 = 30. You can count by fives: 5, 10, 15, 20, 25, 30.",
      hint: "Count by 5s six times.",
    },
  },
  {
    skillCode: "Y3-NA-PV-013",
    questionType: "numeric_input",
    difficultyParam: 0.8,
    content: {
      stem: "A farmer has 342 sheep. He sells 178 sheep at the market. How many sheep does the farmer have left?",
      answer: 164,
      explanation: "342 - 178 = 164. You need to borrow twice: ones (12-8=4), tens (13-7=6), hundreds (2-1=1).",
      hint: "Start with the ones column: 2 - 8. You'll need to borrow.",
    },
  },

  // ============================================================
  // YEAR 4 NUMERACY
  // ============================================================
  {
    skillCode: "Y4-NA-PV-006",
    questionType: "multiple_choice",
    difficultyParam: 0.8,
    content: {
      stem: "What is 7 × 8?",
      answer: "56",
      options: ["48", "54", "56", "63"],
      explanation: "7 × 8 = 56.",
      hint: "Think: 7 × 8 is the same as 8 × 7.",
    },
  },
  {
    skillCode: "Y4-NA-PV-007",
    questionType: "numeric_input",
    difficultyParam: 1.0,
    content: {
      stem: "What is 36 × 4?",
      answer: 144,
      explanation: "36 × 4: ones: 6 × 4 = 24, write 4 carry 2. Tens: 3 × 4 = 12, plus 2 = 14. So 144.",
      hint: "Multiply the ones first (6 × 4), then the tens (3 × 4). Don't forget to carry!",
    },
  },
  {
    skillCode: "Y4-NA-FD-001",
    questionType: "multiple_choice",
    difficultyParam: 1.0,
    content: {
      stem: "Which fraction is the same as 1/2?",
      answer: "2/4",
      options: ["1/4", "2/4", "2/3", "3/4"],
      explanation: "1/2 = 2/4. If you multiply both the top and bottom of 1/2 by 2, you get 2/4.",
      hint: "Try doubling both the top and bottom numbers of 1/2.",
    },
  },
  {
    skillCode: "Y4-NA-PV-009",
    questionType: "numeric_input",
    difficultyParam: 1.2,
    content: {
      stem: "A school has 4 classes. Each class has 28 students. How many students are in the school altogether?",
      answer: 112,
      explanation: "4 × 28 = 112. You can work it out: 4 × 20 = 80, 4 × 8 = 32, 80 + 32 = 112.",
      hint: "Break it into two parts: 4 × 20, then 4 × 8, then add them together.",
    },
  },

  // ============================================================
  // YEAR 3 READING
  // ============================================================
  {
    skillCode: "Y3-RD-LC-001",
    questionType: "multiple_choice",
    difficultyParam: -0.3,
    content: {
      stem: "Read the sentence: 'The koala sat in the tall eucalyptus tree, munching on leaves.' Where was the koala sitting?",
      answer: "In a eucalyptus tree",
      options: ["On the ground", "In a eucalyptus tree", "In a cave", "On a rock"],
      explanation: "The text says the koala sat 'in the tall eucalyptus tree'.",
      hint: "Look for the words that tell you where the koala was.",
    },
  },
  {
    skillCode: "Y3-RD-IF-001",
    questionType: "multiple_choice",
    difficultyParam: 0.2,
    content: {
      stem: "Read: 'Mia looked at her empty lunchbox and sighed.' How do you think Mia was feeling?",
      answer: "Disappointed or sad",
      options: ["Happy and excited", "Disappointed or sad", "Angry and annoyed", "Scared and worried"],
      explanation: "When someone sighs at an empty lunchbox, it suggests they are disappointed or sad that their food is gone.",
      hint: "What would make someone sigh when looking at an empty lunchbox?",
    },
  },
  {
    skillCode: "Y3-RD-VB-001",
    questionType: "multiple_choice",
    difficultyParam: 0.3,
    content: {
      stem: "Read: 'The enormous waves crashed onto the shore.' What does 'enormous' mean?",
      answer: "Very big",
      options: ["Very small", "Very big", "Very fast", "Very quiet"],
      explanation: "'Enormous' means very big or huge.",
      hint: "Think about waves that crash — would they be big or small?",
    },
  },

  // ============================================================
  // YEAR 3 SPELLING
  // ============================================================
  {
    skillCode: "Y3-SP-HF-001",
    questionType: "multiple_choice",
    difficultyParam: -0.5,
    content: {
      stem: "Which spelling is correct?",
      answer: "because",
      options: ["becuz", "becaus", "because", "becouse"],
      explanation: "'Because' is the correct spelling. It's a tricky word to remember!",
      hint: "Sound it out: be-cause.",
    },
  },
  {
    skillCode: "Y3-SP-MO-001",
    questionType: "multiple_choice",
    difficultyParam: 0,
    content: {
      stem: "What is the correct way to add -ing to 'run'?",
      answer: "running",
      options: ["runing", "running", "runeing", "runnning"],
      explanation: "When a short word ends in a consonant after a short vowel, we double the consonant before adding -ing: run → running.",
      hint: "Think about whether you need to double the last letter.",
    },
  },
  {
    skillCode: "Y3-SP-RU-001",
    questionType: "multiple_choice",
    difficultyParam: 0,
    content: {
      stem: "What is the plural of 'baby'?",
      answer: "babies",
      options: ["babys", "babyes", "babies", "babiez"],
      explanation: "When a word ends in 'y' after a consonant, change the y to i and add -es: baby → babies.",
      hint: "What happens to the 'y' at the end?",
    },
  },

  // ============================================================
  // YEAR 3 GRAMMAR & PUNCTUATION
  // ============================================================
  {
    skillCode: "Y3-GP-SB-001",
    questionType: "multiple_choice",
    difficultyParam: -0.5,
    content: {
      stem: "Which sentence uses capital letters and full stops correctly?",
      answer: "The cat sat on the mat.",
      options: [
        "the cat sat on the mat.",
        "The cat sat on the mat",
        "The cat sat on the mat.",
        "the Cat sat on the Mat.",
      ],
      explanation: "A sentence starts with a capital letter and ends with a full stop: 'The cat sat on the mat.'",
      hint: "Look for the one that starts with a capital AND ends with a full stop.",
    },
  },
  {
    skillCode: "Y3-GP-TE-001",
    questionType: "multiple_choice",
    difficultyParam: 0.2,
    content: {
      stem: "Choose the correct past tense: 'Yesterday, I ___ to the park.'",
      answer: "walked",
      options: ["walk", "walked", "walking", "walks"],
      explanation: "'Yesterday' tells us this happened in the past, so we need past tense: 'walked'.",
      hint: "The word 'yesterday' is a clue — this already happened.",
    },
  },
  {
    skillCode: "Y3-GP-CM-001",
    questionType: "multiple_choice",
    difficultyParam: 0.1,
    content: {
      stem: "Which sentence uses commas in a list correctly?",
      answer: "I need apples, bananas, milk and bread.",
      options: [
        "I need apples bananas milk and bread.",
        "I need apples, bananas, milk and bread.",
        "I need, apples bananas milk, and bread.",
        "I need apples bananas, milk and, bread.",
      ],
      explanation: "In a list, we put commas between items. The last two items are joined with 'and' (no comma needed before 'and' in Australian English).",
      hint: "Commas go between each item in the list.",
    },
  },
];
