import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  xp: integer("xp").default(0).notNull(),
  streak: integer("streak").default(0).notNull(),
  lastActiveDate: timestamp("last_active_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Languages table
export const languages = pgTable("languages", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  icon: varchar("icon"),
  color: varchar("color"),
  difficulty: varchar("difficulty").notNull(), // beginner, intermediate, advanced
  category: varchar("category").notNull(), // programming, web, database, dsa
  lessonsCount: integer("lessons_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Lessons table
export const lessons = pgTable("lessons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  languageId: varchar("language_id").notNull().references(() => languages.id),
  title: varchar("title").notNull(),
  description: text("description"),
  content: text("content").notNull(),
  order: integer("order").notNull(),
  duration: integer("duration").default(10), // in minutes
  xpReward: integer("xp_reward").default(50),
  createdAt: timestamp("created_at").defaultNow(),
});

// User progress on lessons
export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  lessonId: varchar("lesson_id").notNull().references(() => lessons.id),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User favorites
export const userFavorites = pgTable("user_favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  languageId: varchar("language_id").notNull().references(() => languages.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Achievements/Badges
export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  icon: varchar("icon"),
  xpRequired: integer("xp_required"),
  type: varchar("type").notNull(), // streak, xp, lessons, quizzes
  requirement: integer("requirement").notNull(),
});

// User achievements
export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  achievementId: varchar("achievement_id").notNull().references(() => achievements.id),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

// Quizzes
export const quizzes = pgTable("quizzes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  lessonId: varchar("lesson_id").references(() => lessons.id),
  languageId: varchar("language_id").notNull().references(() => languages.id),
  title: varchar("title").notNull(),
  description: text("description"),
  timeLimit: integer("time_limit").default(300), // in seconds
  xpReward: integer("xp_reward").default(100),
  createdAt: timestamp("created_at").defaultNow(),
});

// Quiz questions
export const quizQuestions = pgTable("quiz_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  quizId: varchar("quiz_id").notNull().references(() => quizzes.id),
  type: varchar("type").notNull(), // mcq, code-output, debugging
  question: text("question").notNull(),
  code: text("code"),
  options: jsonb("options").$type<string[]>(),
  correctAnswer: varchar("correct_answer").notNull(),
  explanation: text("explanation"),
  order: integer("order").notNull(),
});

// User quiz attempts
export const userQuizAttempts = pgTable("user_quiz_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  quizId: varchar("quiz_id").notNull().references(() => quizzes.id),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  timeTaken: integer("time_taken"), // in seconds
  completedAt: timestamp("completed_at").defaultNow(),
});

// Challenges (DSA problems)
export const challenges = pgTable("challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  difficulty: varchar("difficulty").notNull(), // easy, medium, hard
  category: varchar("category").notNull(),
  starterCode: text("starter_code"),
  testCases: jsonb("test_cases").$type<{ input: string; output: string }[]>(),
  xpReward: integer("xp_reward").default(150),
  createdAt: timestamp("created_at").defaultNow(),
});

// User challenge submissions
export const userChallengeSubmissions = pgTable("user_challenge_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  challengeId: varchar("challenge_id").notNull().references(() => challenges.id),
  code: text("code").notNull(),
  language: varchar("language").notNull(),
  passed: boolean("passed").default(false),
  submittedAt: timestamp("submitted_at").defaultNow(),
});

// AI Chat messages
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  role: varchar("role").notNull(), // user, assistant
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  progress: many(userProgress),
  favorites: many(userFavorites),
  achievements: many(userAchievements),
  quizAttempts: many(userQuizAttempts),
  challengeSubmissions: many(userChallengeSubmissions),
  chatMessages: many(chatMessages),
}));

export const languagesRelations = relations(languages, ({ many }) => ({
  lessons: many(lessons),
  quizzes: many(quizzes),
  favorites: many(userFavorites),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  language: one(languages, {
    fields: [lessons.languageId],
    references: [languages.id],
  }),
  progress: many(userProgress),
  quizzes: many(quizzes),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
  createdAt: true,
});

export const insertProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  createdAt: true,
});

export const insertFavoriteSchema = createInsertSchema(userFavorites).omit({
  id: true,
  createdAt: true,
});

export const insertQuizAttemptSchema = createInsertSchema(userQuizAttempts).omit({
  id: true,
  completedAt: true,
});

export const insertChallengeSubmissionSchema = createInsertSchema(userChallengeSubmissions).omit({
  id: true,
  submittedAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Language = typeof languages.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type UserFavorite = typeof userFavorites.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type Quiz = typeof quizzes.$inferSelect;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type UserQuizAttempt = typeof userQuizAttempts.$inferSelect;
export type Challenge = typeof challenges.$inferSelect;
export type UserChallengeSubmission = typeof userChallengeSubmissions.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type InsertProgress = z.infer<typeof insertProgressSchema>;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type InsertQuizAttempt = z.infer<typeof insertQuizAttemptSchema>;
export type InsertChallengeSubmission = z.infer<typeof insertChallengeSubmissionSchema>;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
