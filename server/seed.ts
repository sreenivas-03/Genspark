import { db } from "./db";
import { languages, lessons, achievements, quizzes, quizQuestions, challenges } from "@shared/schema";

const LANGUAGES_DATA = [
  {
    id: "python",
    name: "Python",
    description: "A versatile, beginner-friendly language perfect for data science, AI, and web development.",
    icon: "SiPython",
    color: "#3776AB",
    difficulty: "beginner",
    category: "programming",
    lessonsCount: 24,
  },
  {
    id: "javascript",
    name: "JavaScript",
    description: "The language of the web. Build interactive websites and full-stack applications.",
    icon: "SiJavascript",
    color: "#F7DF1E",
    difficulty: "beginner",
    category: "programming",
    lessonsCount: 28,
  },
  {
    id: "java",
    name: "Java",
    description: "Enterprise-grade language for building robust, scalable applications.",
    icon: "SiOpenjdk",
    color: "#ED8B00",
    difficulty: "intermediate",
    category: "programming",
    lessonsCount: 32,
  },
  {
    id: "c",
    name: "C",
    description: "The foundational language for systems programming and embedded systems.",
    icon: "SiC",
    color: "#A8B9CC",
    difficulty: "intermediate",
    category: "programming",
    lessonsCount: 20,
  },
  {
    id: "cpp",
    name: "C++",
    description: "Powerful language for game development, systems programming, and high-performance apps.",
    icon: "SiCplusplus",
    color: "#00599C",
    difficulty: "advanced",
    category: "programming",
    lessonsCount: 30,
  },
  {
    id: "html",
    name: "HTML",
    description: "The backbone of web pages. Learn to structure content for the web.",
    icon: "SiHtml5",
    color: "#E34F26",
    difficulty: "beginner",
    category: "web",
    lessonsCount: 15,
  },
  {
    id: "css",
    name: "CSS",
    description: "Style your web pages with beautiful designs, layouts, and animations.",
    icon: "SiCss3",
    color: "#1572B6",
    difficulty: "beginner",
    category: "web",
    lessonsCount: 18,
  },
  {
    id: "sql",
    name: "SQL",
    description: "Query and manage databases with the universal database language.",
    icon: "SiPostgresql",
    color: "#4479A1",
    difficulty: "beginner",
    category: "database",
    lessonsCount: 16,
  },
  {
    id: "fullstack",
    name: "Full Stack",
    description: "Master both frontend and backend development to build complete web applications.",
    icon: "SiReact",
    color: "#61DAFB",
    difficulty: "advanced",
    category: "web",
    lessonsCount: 40,
  },
  {
    id: "dsa",
    name: "DSA",
    description: "Data Structures & Algorithms - the foundation for coding interviews and efficient programming.",
    icon: "SiLeetcode",
    color: "#FFA116",
    difficulty: "intermediate",
    category: "dsa",
    lessonsCount: 50,
  },
];

const LESSONS_DATA = {
  python: [
    { id: "py-1", languageId: "python", title: "Introduction to Python", description: "Get started with Python basics", order: 1, duration: 15, xpReward: 50, content: "Learn Python fundamentals including syntax, variables, and basic operations." },
    { id: "py-2", languageId: "python", title: "Variables and Data Types", description: "Learn about Python data types", order: 2, duration: 20, xpReward: 60, content: "Explore strings, integers, floats, booleans, and type conversion." },
    { id: "py-3", languageId: "python", title: "Control Flow", description: "Master if statements and loops", order: 3, duration: 25, xpReward: 70, content: "Learn conditional statements, for loops, and while loops." },
    { id: "py-4", languageId: "python", title: "Functions", description: "Create reusable code with functions", order: 4, duration: 30, xpReward: 80, content: "Define functions, parameters, return values, and scope." },
    { id: "py-5", languageId: "python", title: "Lists and Tuples", description: "Work with collections in Python", order: 5, duration: 25, xpReward: 70, content: "Master lists, tuples, and common operations on sequences." },
  ],
  javascript: [
    { id: "js-1", languageId: "javascript", title: "JavaScript Fundamentals", description: "Core concepts of JavaScript", order: 1, duration: 15, xpReward: 50, content: "Learn JavaScript basics including variables, operators, and expressions." },
    { id: "js-2", languageId: "javascript", title: "DOM Manipulation", description: "Interact with web pages", order: 2, duration: 25, xpReward: 70, content: "Select, modify, and create HTML elements with JavaScript." },
    { id: "js-3", languageId: "javascript", title: "Async JavaScript", description: "Promises and async/await", order: 3, duration: 30, xpReward: 80, content: "Handle asynchronous operations with callbacks, promises, and async/await." },
    { id: "js-4", languageId: "javascript", title: "ES6+ Features", description: "Modern JavaScript syntax", order: 4, duration: 25, xpReward: 70, content: "Arrow functions, destructuring, spread operator, and modules." },
  ],
};

const ACHIEVEMENTS_DATA = [
  { id: "first-lesson", name: "First Steps", description: "Complete your first lesson", icon: "Trophy", type: "lessons", requirement: 1 },
  { id: "streak-3", name: "On Fire", description: "Maintain a 3-day streak", icon: "Flame", type: "streak", requirement: 3 },
  { id: "streak-7", name: "Week Warrior", description: "Maintain a 7-day streak", icon: "Flame", type: "streak", requirement: 7 },
  { id: "xp-500", name: "Rising Star", description: "Earn 500 XP", icon: "Star", type: "xp", requirement: 500 },
  { id: "xp-1000", name: "Knowledge Seeker", description: "Earn 1000 XP", icon: "Star", type: "xp", requirement: 1000 },
  { id: "quiz-master", name: "Quiz Master", description: "Complete 10 quizzes", icon: "CheckCircle", type: "quizzes", requirement: 10 },
  { id: "challenge-ace", name: "Challenge Ace", description: "Solve 5 coding challenges", icon: "Code", type: "challenges", requirement: 5 },
  { id: "python-pro", name: "Python Pro", description: "Complete all Python lessons", icon: "Award", type: "language", requirement: 1 },
];

const CHALLENGES_DATA = [
  {
    id: "ch-1",
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "easy",
    category: "Arrays",
    xpReward: 150,
    starterCode: `def two_sum(nums, target):
    # Your code here
    pass`,
    testCases: [
      { input: "[2,7,11,15], 9", output: "[0,1]" },
      { input: "[3,2,4], 6", output: "[1,2]" },
    ],
  },
  {
    id: "ch-2",
    title: "Reverse String",
    description: "Write a function that reverses a string. The input string is given as an array of characters.",
    difficulty: "easy",
    category: "Strings",
    xpReward: 100,
    starterCode: `def reverse_string(s):
    # Your code here
    pass`,
    testCases: [
      { input: '["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
    ],
  },
  {
    id: "ch-3",
    title: "Valid Parentheses",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    difficulty: "medium",
    category: "Stack",
    xpReward: 200,
    starterCode: `def is_valid(s):
    # Your code here
    pass`,
    testCases: [
      { input: '"()"', output: "true" },
      { input: '"()[]{}"', output: "true" },
      { input: '"(]"', output: "false" },
    ],
  },
];

export async function seedDatabase() {
  console.log("Seeding database...");
  
  try {
    // Seed languages
    for (const lang of LANGUAGES_DATA) {
      await db.insert(languages).values(lang).onConflictDoNothing();
    }
    console.log(`Seeded ${LANGUAGES_DATA.length} languages`);

    // Seed lessons
    const allLessons = [...(LESSONS_DATA.python || []), ...(LESSONS_DATA.javascript || [])];
    for (const lesson of allLessons) {
      await db.insert(lessons).values(lesson).onConflictDoNothing();
    }
    console.log(`Seeded ${allLessons.length} lessons`);

    // Seed achievements
    for (const achievement of ACHIEVEMENTS_DATA) {
      await db.insert(achievements).values(achievement).onConflictDoNothing();
    }
    console.log(`Seeded ${ACHIEVEMENTS_DATA.length} achievements`);

    // Seed challenges
    for (const challenge of CHALLENGES_DATA) {
      await db.insert(challenges).values(challenge).onConflictDoNothing();
    }
    console.log(`Seeded ${CHALLENGES_DATA.length} challenges`);

    console.log("Database seeding complete!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
