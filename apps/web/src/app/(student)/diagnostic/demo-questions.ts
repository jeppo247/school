import type { SupportedYearLevel } from "@upwise/shared";

type NaplanDomain = "numeracy" | "reading" | "spelling" | "grammar_punctuation" | "writing";

export interface QuestionData {
  id: string;
  type: string;
  domain: NaplanDomain;
  yearLevels: SupportedYearLevel[];
  content: {
    stem: string;
    answer: string | number;
    options?: string[];
    passage?: string;
    hint?: string;
    explanation?: string;
  };
}

export const SUPPORTED_DEMO_YEARS: SupportedYearLevel[] = [0, 1, 2, 3, 4, 5, 6, 7];

/**
 * Demo question bank tagged by the exact year levels it can be shown to.
 * Keep this non-cumulative so older learners do not see Prep-only warmups.
 */
export const DEMO_QUESTIONS: QuestionData[] = [
  // PREP — numbers to 10, simple patterns, short listening-style comprehension
  { id: "d1", type: "multiple_choice", domain: "numeracy", yearLevels: [0], content: { stem: "How many stars are there? ⭐⭐⭐", answer: "3", options: ["2", "3", "4", "5"], explanation: "Count them: 1, 2, 3!", hint: "Point to each star and count." } },
  { id: "d2", type: "multiple_choice", domain: "numeracy", yearLevels: [0], content: { stem: "What number comes after 4?", answer: "5", options: ["3", "4", "5", "6"], explanation: "When we count: 3, 4, 5 — so 5 comes after 4.", hint: "Try counting: 1, 2, 3, 4, ..." } },
  { id: "d3", type: "multiple_choice", domain: "numeracy", yearLevels: [0], content: { stem: "Which group has more? Group A has 3 counters. Group B has 5 counters.", answer: "Group B", options: ["Group A", "Group B", "They are the same", "I don't know"], explanation: "Group B has 5 counters, Group A has 3. 5 is more than 3.", hint: "Count the counters in each group." } },
  { id: "d4", type: "multiple_choice", domain: "numeracy", yearLevels: [0], content: { stem: "What comes next? Blue, red, blue, red, blue, ___", answer: "Red", options: ["Blue", "Red", "Green", "Yellow"], explanation: "The pattern goes blue, red, blue, red, so red comes next.", hint: "Look at the pattern: blue, red, blue, red..." } },
  { id: "d5", type: "multiple_choice", domain: "reading", yearLevels: [0], content: { passage: "Kobi the koala climbed a big tree. He ate some leaves. Then he had a nap.", stem: "What did Kobi do first?", answer: "Climbed a tree", options: ["Had a nap", "Climbed a tree", "Ate some leaves", "Went home"], explanation: "The story says Kobi climbed a tree first.", hint: "What happened at the very start?" } },
  { id: "d6", type: "multiple_choice", domain: "grammar_punctuation", yearLevels: [0], content: { stem: "Which one starts with a capital letter?", answer: "The dog is big.", options: ["the dog is big.", "The dog is big.", "the Dog is big.", "THE DOG IS BIG."], explanation: "Sentences start with ONE capital letter: 'The dog is big.'", hint: "Only the first letter should be big." } },

  // YEAR 1 — addition/subtraction to 20, early spelling
  { id: "d7", type: "multiple_choice", domain: "numeracy", yearLevels: [1], content: { stem: "What number comes after 7?", answer: "8", options: ["6", "7", "8", "9"], explanation: "The next number is 8.", hint: "Try counting: 5, 6, 7, ..." } },
  { id: "d8", type: "multiple_choice", domain: "numeracy", yearLevels: [1], content: { stem: "What is 3 + 5?", answer: "8", options: ["7", "8", "9", "10"], explanation: "3 + 5 = 8.", hint: "Start at 3 and count on 5 more." } },
  { id: "d9", type: "multiple_choice", domain: "numeracy", yearLevels: [1], content: { stem: "What is 9 - 4?", answer: "5", options: ["3", "4", "5", "6"], explanation: "9 - 4 = 5.", hint: "Start at 9 and count back 4." } },
  { id: "d10", type: "multiple_choice", domain: "numeracy", yearLevels: [1], content: { stem: "Which two numbers make 10?", answer: "3 and 7", options: ["3 and 7", "4 and 5", "2 and 9", "6 and 3"], explanation: "3 + 7 = 10!", hint: "Think about pairs that add up to 10." } },
  { id: "d11", type: "multiple_choice", domain: "spelling", yearLevels: [1], content: { stem: "Which word is 'cat'?", answer: "cat", options: ["kat", "cat", "cet", "kat"], explanation: "'Cat' starts with c-a-t.", hint: "Sound it out: c-a-t." } },

  // YEAR 2 — place value to 100, groups, simple sentence conventions
  { id: "d12", type: "multiple_choice", domain: "numeracy", yearLevels: [2], content: { stem: "What is the value of the 4 in the number 47?", answer: "40", options: ["4", "40", "47", "7"], explanation: "The 4 is in the tens place, so it means 40.", hint: "The 4 is in the tens column." } },
  { id: "d13", type: "multiple_choice", domain: "numeracy", yearLevels: [2], content: { stem: "There are 3 bags with 4 apples in each bag. How many apples altogether?", answer: "12", options: ["7", "10", "12", "14"], explanation: "3 groups of 4 = 12.", hint: "Count by fours: 4, 8, ..." } },
  { id: "d14", type: "multiple_choice", domain: "reading", yearLevels: [2], content: { passage: "The koala sat in the tall eucalyptus tree, munching on leaves.", stem: "Where was the koala?", answer: "In a eucalyptus tree", options: ["On the ground", "In a eucalyptus tree", "In a cave", "On a rock"], explanation: "The text says the koala was in the tall eucalyptus tree.", hint: "Look for the words that tell you where." } },
  { id: "d15", type: "multiple_choice", domain: "spelling", yearLevels: [2], content: { stem: "Which spelling is correct?", answer: "because", options: ["becuz", "becaus", "because", "becouse"], explanation: "'Because' is the correct spelling.", hint: "Sound it out: be-cause." } },
  { id: "d16", type: "multiple_choice", domain: "grammar_punctuation", yearLevels: [2], content: { stem: "Which sentence uses capital letters and full stops correctly?", answer: "The cat sat on the mat.", options: ["the cat sat on the mat.", "The cat sat on the mat", "The cat sat on the mat.", "the Cat sat on the Mat."], explanation: "Start with a capital, end with a full stop.", hint: "Look for capital at start AND full stop at end." } },

  // YEAR 3 — place value to 1000, multiplication facts, simple inference
  { id: "d17", type: "multiple_choice", domain: "numeracy", yearLevels: [3], content: { stem: "What is 365 written in expanded form?", answer: "300 + 60 + 5", options: ["300 + 60 + 5", "3 + 6 + 5", "360 + 5", "30 + 65"], explanation: "365 = 300 + 60 + 5.", hint: "Break it into hundreds, tens, and ones." } },
  { id: "d18", type: "multiple_choice", domain: "numeracy", yearLevels: [3], content: { stem: "What is 6 × 5?", answer: "30", options: ["25", "30", "35", "36"], explanation: "6 × 5 = 30.", hint: "Count by 5s six times." } },
  { id: "d19", type: "multiple_choice", domain: "reading", yearLevels: [3], content: { stem: "'Lily looked at her empty lunchbox and sighed.' How was Lily feeling?", answer: "Disappointed or sad", options: ["Happy and excited", "Disappointed or sad", "Angry and annoyed", "Scared and worried"], explanation: "Sighing at an empty lunchbox suggests disappointment.", hint: "What would make someone sigh at an empty lunchbox?" } },
  { id: "d20", type: "multiple_choice", domain: "reading", yearLevels: [3], content: { stem: "'The enormous waves crashed onto the shore.' What does 'enormous' mean?", answer: "Very big", options: ["Very small", "Very big", "Very fast", "Very quiet"], explanation: "'Enormous' means very big or huge.", hint: "Waves that crash are usually what size?" } },
  { id: "d21", type: "multiple_choice", domain: "spelling", yearLevels: [3], content: { stem: "What is the correct way to add -ing to 'run'?", answer: "running", options: ["runing", "running", "runeing", "runnning"], explanation: "Double the consonant before -ing: running.", hint: "Do you need to double the last letter?" } },
  { id: "d22", type: "multiple_choice", domain: "grammar_punctuation", yearLevels: [3], content: { stem: "Choose the correct past tense: 'Yesterday, I ___ to the park.'", answer: "walked", options: ["walk", "walked", "walking", "walks"], explanation: "'Yesterday' means past tense: walked.", hint: "'Yesterday' is a clue — it already happened." } },

  // YEAR 4 — larger whole numbers, fractions, spelling patterns
  { id: "d23", type: "multiple_choice", domain: "numeracy", yearLevels: [4], content: { stem: "A farmer has 342 sheep. He sells 178. How many are left?", answer: "164", options: ["164", "174", "236", "264"], explanation: "342 - 178 = 164.", hint: "Start with the ones column: 2 - 8. You'll need to borrow." } },
  { id: "d24", type: "multiple_choice", domain: "numeracy", yearLevels: [4], content: { stem: "What is 7 × 8?", answer: "56", options: ["48", "54", "56", "63"], explanation: "7 × 8 = 56.", hint: "Think: 7 × 8 is the same as 8 × 7." } },
  { id: "d25", type: "multiple_choice", domain: "numeracy", yearLevels: [4], content: { stem: "Which fraction is the same as 1/2?", answer: "2/4", options: ["1/4", "2/4", "2/3", "3/4"], explanation: "1/2 = 2/4.", hint: "Try doubling the top and bottom of 1/2." } },
  { id: "d26", type: "multiple_choice", domain: "numeracy", yearLevels: [4], content: { stem: "A school has 4 classes with 28 students each. How many students altogether?", answer: "112", options: ["96", "102", "112", "128"], explanation: "4 × 28 = 112.", hint: "Break it: 4 × 20 = 80, 4 × 8 = 32, then add." } },
  { id: "d27", type: "multiple_choice", domain: "spelling", yearLevels: [4], content: { stem: "What is the plural of 'baby'?", answer: "babies", options: ["babys", "babyes", "babies", "babiez"], explanation: "Change y to i and add -es: babies.", hint: "What happens to the 'y' at the end?" } },

  // YEAR 5 — decimals, main idea, cause/effect, morphology
  { id: "d28", type: "multiple_choice", domain: "numeracy", yearLevels: [5, 6], content: { stem: "Which decimal is the same as 3/10?", answer: "0.3", options: ["0.03", "0.3", "3.0", "0.13"], explanation: "Three tenths is written as 0.3.", hint: "Tenths are the first digit after the decimal point." } },
  { id: "d29", type: "multiple_choice", domain: "numeracy", yearLevels: [5, 6], content: { stem: "A water tank holds 2.5 litres. How many millilitres is that?", answer: "2500 mL", options: ["25 mL", "250 mL", "2500 mL", "25 000 mL"], explanation: "1 litre is 1000 millilitres, so 2.5 litres is 2500 millilitres.", hint: "Multiply litres by 1000 to get millilitres." } },
  { id: "d30", type: "multiple_choice", domain: "reading", yearLevels: [5], content: { passage: "At the school garden, students placed mulch around the seedlings before the hot weekend. By Monday, the uncovered seedlings had wilted, but the mulched plants still looked healthy.", stem: "What is the most likely reason the mulched plants stayed healthy?", answer: "The mulch helped keep moisture in the soil", options: ["The mulch helped keep moisture in the soil", "The plants grew taller because mulch is a fertiliser", "The weekend was colder near the mulched plants", "The students watered only the mulched plants"], explanation: "The passage contrasts hot weather with mulch, which suggests the mulch helped the soil hold moisture.", hint: "Think about what mulch can do for soil during hot weather." } },
  { id: "d31", type: "multiple_choice", domain: "grammar_punctuation", yearLevels: [5], content: { stem: "Which sentence uses a comma correctly?", answer: "After lunch, we walked to the oval.", options: ["After lunch we, walked to the oval.", "After lunch, we walked to the oval.", "After, lunch we walked to the oval.", "After lunch we walked, to the oval."], explanation: "A comma can separate the opening phrase 'After lunch' from the rest of the sentence.", hint: "Look for the comma after the opening time phrase." } },
  { id: "d32", type: "multiple_choice", domain: "spelling", yearLevels: [5], content: { stem: "Which word means 'able to be moved'?", answer: "movable", options: ["moveablee", "movible", "movable", "moovable"], explanation: "The suffix -able means 'able to be'.", hint: "Look for the base word 'move' and the suffix '-able'." } },

  // YEAR 6 — upper-primary consolidation before Year 7 concepts
  { id: "d33", type: "multiple_choice", domain: "numeracy", yearLevels: [6], content: { stem: "A jumper costs $48 and is reduced by 25%. What is the sale price?", answer: "$36", options: ["$12", "$24", "$36", "$42"], explanation: "25% of $48 is $12, so the sale price is $48 - $12 = $36.", hint: "Find one quarter of 48, then subtract it." } },
  { id: "d34", type: "multiple_choice", domain: "numeracy", yearLevels: [6], content: { stem: "The ratio of red counters to blue counters is 2:3. If there are 10 red counters, how many blue counters are there?", answer: "15", options: ["6", "12", "15", "30"], explanation: "The red amount has been multiplied by 5, so multiply the blue amount by 5 too: 3 × 5 = 15.", hint: "Work out what 2 was multiplied by to become 10." } },
  { id: "d35", type: "multiple_choice", domain: "reading", yearLevels: [6], content: { passage: "When the council opened the new bike path, traffic near the school became quieter. Some families still drove, but more students began riding because the path connected directly to the school gate.", stem: "Which detail best explains why more students began riding?", answer: "The path connected directly to the school gate", options: ["Traffic near the school became quieter", "Some families still drove", "The path connected directly to the school gate", "The council opened the path"], explanation: "The direct connection to the school gate explains why riding became easier for students.", hint: "Look for the detail that made riding more practical." } },
  { id: "d36", type: "multiple_choice", domain: "grammar_punctuation", yearLevels: [6], content: { stem: "Which sentence combines the ideas most clearly?", answer: "Although it was raining, the team kept training.", options: ["Although it was raining, the team kept training.", "It was raining although, the team kept training.", "Although, it was raining the team kept training.", "The team although it was raining kept training."], explanation: "The subordinating conjunction 'Although' introduces the contrast clearly.", hint: "The sentence should still sound natural when read aloud." } },
  { id: "d37", type: "multiple_choice", domain: "spelling", yearLevels: [6], content: { stem: "Which spelling is correct?", answer: "recommendation", options: ["recomendation", "recommendation", "reccomendation", "recommondation"], explanation: "'Recommendation' keeps the double m from 'recommend'.", hint: "Think about the spelling of 'recommend' first." } },

  // YEAR 7 — rational numbers, algebra, evaluation and advanced conventions
  { id: "d38", type: "multiple_choice", domain: "numeracy", yearLevels: [7], content: { stem: "Which expression is equivalent to 3(n + 4)?", answer: "3n + 12", options: ["3n + 4", "n + 12", "3n + 12", "7n"], explanation: "Multiply both terms inside the brackets by 3: 3 × n = 3n and 3 × 4 = 12.", hint: "Use the distributive law." } },
  { id: "d39", type: "multiple_choice", domain: "numeracy", yearLevels: [7], content: { stem: "A recipe uses 2 cups of rice for 5 people. How many cups are needed for 20 people?", answer: "8 cups", options: ["4 cups", "8 cups", "10 cups", "15 cups"], explanation: "20 people is 4 times as many as 5 people, so multiply 2 cups by 4 to get 8 cups.", hint: "Scale both the people and rice by the same factor." } },
  { id: "d40", type: "multiple_choice", domain: "reading", yearLevels: [7], content: { passage: "The article praised the wetlands project, but it also noted that nearby residents were worried about parking during weekend tours. The writer ended by saying the project would succeed only if visitors respected the neighbourhood.", stem: "Which statement best describes the writer's viewpoint?", answer: "Supportive, but aware of local concerns", options: ["Strongly opposed to the project", "Supportive, but aware of local concerns", "Uninterested in the project", "Certain that parking will ruin the project"], explanation: "The article praises the project while also acknowledging residents' concerns.", hint: "Look for both the positive and cautious parts of the passage." } },
  { id: "d41", type: "multiple_choice", domain: "grammar_punctuation", yearLevels: [7], content: { stem: "Which sentence uses a semicolon correctly?", answer: "The rehearsal was delayed; the hall lights had stopped working.", options: ["The rehearsal; was delayed the hall lights had stopped working.", "The rehearsal was delayed; the hall lights had stopped working.", "The rehearsal was delayed the hall; lights had stopped working.", "The rehearsal was; delayed the hall lights had stopped working."], explanation: "A semicolon can join two closely related independent clauses.", hint: "Both sides of the semicolon should make sense as complete sentences." } },
  { id: "d42", type: "multiple_choice", domain: "spelling", yearLevels: [7], content: { stem: "Which word is spelled correctly?", answer: "environment", options: ["enviroment", "environment", "enviornment", "envirnment"], explanation: "'Environment' includes 'environ' followed by '-ment'.", hint: "Listen for the 'ron' sound in the middle." } },
];

export function getDemoQuestionsForYear(yearLevel: number): QuestionData[] {
  const supportedYear = SUPPORTED_DEMO_YEARS.includes(yearLevel as SupportedYearLevel)
    ? yearLevel as SupportedYearLevel
    : 3;

  return DEMO_QUESTIONS.filter((question) => question.yearLevels.includes(supportedYear));
}
