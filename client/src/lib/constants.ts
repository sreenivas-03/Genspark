// Language data with icons and colors
export const LANGUAGES = [
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

// Sample lessons data
export const SAMPLE_LESSONS = {
  python: [
    { id: "py-1", title: "Introduction to Python", description: "Get started with Python basics", order: 1, duration: 15, xpReward: 50 },
    { id: "py-2", title: "Variables and Data Types", description: "Learn about Python data types", order: 2, duration: 20, xpReward: 60 },
    { id: "py-3", title: "Control Flow", description: "Master if statements and loops", order: 3, duration: 25, xpReward: 70 },
    { id: "py-4", title: "Functions", description: "Create reusable code with functions", order: 4, duration: 30, xpReward: 80 },
    { id: "py-5", title: "Lists and Tuples", description: "Work with collections in Python", order: 5, duration: 25, xpReward: 70 },
  ],
  javascript: [
    { id: "js-1", title: "JavaScript Fundamentals", description: "Core concepts of JavaScript", order: 1, duration: 15, xpReward: 50 },
    { id: "js-2", title: "DOM Manipulation", description: "Interact with web pages", order: 2, duration: 25, xpReward: 70 },
    { id: "js-3", title: "Async JavaScript", description: "Promises and async/await", order: 3, duration: 30, xpReward: 80 },
    { id: "js-4", title: "ES6+ Features", description: "Modern JavaScript syntax", order: 4, duration: 25, xpReward: 70 },
  ],
};

// Achievements data
export const ACHIEVEMENTS = [
  { id: "first-lesson", name: "First Steps", description: "Complete your first lesson", icon: "Trophy", type: "lessons", requirement: 1 },
  { id: "streak-3", name: "On Fire", description: "Maintain a 3-day streak", icon: "Flame", type: "streak", requirement: 3 },
  { id: "streak-7", name: "Week Warrior", description: "Maintain a 7-day streak", icon: "Flame", type: "streak", requirement: 7 },
  { id: "xp-500", name: "Rising Star", description: "Earn 500 XP", icon: "Star", type: "xp", requirement: 500 },
  { id: "xp-1000", name: "Knowledge Seeker", description: "Earn 1000 XP", icon: "Star", type: "xp", requirement: 1000 },
  { id: "quiz-master", name: "Quiz Master", description: "Complete 10 quizzes", icon: "CheckCircle", type: "quizzes", requirement: 10 },
  { id: "challenge-ace", name: "Challenge Ace", description: "Solve 5 coding challenges", icon: "Code", type: "challenges", requirement: 5 },
  { id: "python-pro", name: "Python Pro", description: "Complete all Python lessons", icon: "Award", type: "language", requirement: 1 },
];

// Quick actions for dashboard
export const QUICK_ACTIONS = [
  { id: "learn", title: "Learn", description: "Continue learning", icon: "BookOpen", color: "primary", path: "/explore" },
  { id: "ai-tutor", title: "AI Tutor", description: "Ask anything", icon: "Bot", color: "secondary", path: "/ai" },
  { id: "compiler", title: "Compiler", description: "Write & run code", icon: "Terminal", color: "accent", path: "/practice" },
  { id: "challenges", title: "Challenges", description: "Test your skills", icon: "Trophy", color: "success", path: "/practice" },
];

// Sample quiz questions
export const SAMPLE_QUIZ = {
  id: "quiz-py-1",
  title: "Python Basics Quiz",
  description: "Test your Python fundamentals",
  timeLimit: 300,
  xpReward: 100,
  questions: [
    {
      id: "q1",
      type: "mcq",
      question: "What is the correct way to create a variable in Python?",
      options: ["var x = 5", "x = 5", "int x = 5", "let x = 5"],
      correctAnswer: "x = 5",
      explanation: "Python uses dynamic typing, so you simply assign a value to a variable name without declaring its type.",
    },
    {
      id: "q2",
      type: "code-output",
      question: "What will be the output of the following code?",
      code: 'print("Hello" + " " + "World")',
      options: ["HelloWorld", "Hello World", "Hello + World", "Error"],
      correctAnswer: "Hello World",
      explanation: "The + operator concatenates strings in Python.",
    },
    {
      id: "q3",
      type: "debugging",
      question: "Find the error in this code:",
      code: 'name = "Alice"\nprint("Hello, " + Name)',
      options: ["Variable naming error", "Syntax error", "Type error", "No error"],
      correctAnswer: "Variable naming error",
      explanation: "Python is case-sensitive. 'name' and 'Name' are different variables.",
    },
  ],
};

// Sample challenges
export const SAMPLE_CHALLENGES = [
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

// Sample lesson content
export const SAMPLE_LESSON_CONTENT = `
# Introduction to Python

Python is a powerful, easy-to-learn programming language. It has efficient high-level data structures and a simple but effective approach to object-oriented programming.

## Getting Started

Python's elegant syntax and dynamic typing make it an ideal language for scripting and rapid application development.

### Your First Program

Let's write our first Python program:

\`\`\`python
# This is a comment
print("Hello, World!")
\`\`\`

This simple program outputs "Hello, World!" to the console.

## Variables

In Python, you don't need to declare variable types:

\`\`\`python
# String variable
name = "Alice"

# Integer variable  
age = 25

# Float variable
height = 5.8

# Boolean variable
is_student = True
\`\`\`

## Practice

Try modifying the code above to print your own name!
`;
