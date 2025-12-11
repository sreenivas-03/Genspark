import {
  users,
  languages,
  lessons,
  userProgress,
  userFavorites,
  achievements,
  userAchievements,
  quizzes,
  quizQuestions,
  userQuizAttempts,
  challenges,
  userChallengeSubmissions,
  chatMessages,
  type User,
  type UpsertUser,
  type Language,
  type Lesson,
  type UserProgress,
  type UserFavorite,
  type Achievement,
  type UserAchievement,
  type Quiz,
  type QuizQuestion,
  type UserQuizAttempt,
  type Challenge,
  type UserChallengeSubmission,
  type ChatMessage,
  type InsertProgress,
  type InsertFavorite,
  type InsertQuizAttempt,
  type InsertChallengeSubmission,
  type InsertChatMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserXP(userId: string, xp: number): Promise<void>;
  updateUserStreak(userId: string, streak: number): Promise<void>;
  
  // Language operations
  getLanguages(): Promise<Language[]>;
  getLanguage(id: string): Promise<Language | undefined>;
  getLanguageById(id: string): Promise<Language | undefined>;
  
  // Lesson operations
  getLessonsByLanguage(languageId: string): Promise<Lesson[]>;
  getLessonById(id: string): Promise<Lesson | undefined>;
  
  // Progress operations
  getUserProgress(userId: string): Promise<UserProgress[]>;
  getProgressByLesson(userId: string, lessonId: string): Promise<UserProgress | undefined>;
  markLessonComplete(progress: InsertProgress): Promise<UserProgress>;
  
  // Favorites operations
  getUserFavorites(userId: string): Promise<UserFavorite[]>;
  addFavorite(favorite: InsertFavorite): Promise<UserFavorite>;
  removeFavorite(userId: string, languageId: string): Promise<void>;
  
  // Achievement operations
  getAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: string): Promise<UserAchievement[]>;
  unlockAchievement(userId: string, achievementId: string): Promise<UserAchievement>;
  
  // Quiz operations
  getQuizzesByLanguage(languageId: string): Promise<Quiz[]>;
  getQuiz(id: string): Promise<Quiz | undefined>;
  getQuizById(id: string): Promise<Quiz | undefined>;
  getQuizQuestions(quizId: string): Promise<QuizQuestion[]>;
  submitQuizAttempt(attempt: InsertQuizAttempt): Promise<UserQuizAttempt>;
  getUserQuizAttempts(userId: string): Promise<UserQuizAttempt[]>;
  
  // Challenge operations
  getChallenges(): Promise<Challenge[]>;
  getChallenge(id: string): Promise<Challenge | undefined>;
  getChallengeById(id: string): Promise<Challenge | undefined>;
  submitChallenge(submission: InsertChallengeSubmission): Promise<UserChallengeSubmission>;
  getUserChallengeSubmissions(userId: string): Promise<UserChallengeSubmission[]>;
  
  // Chat operations
  getChatHistory(userId: string, limit?: number): Promise<ChatMessage[]>;
  addChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  clearChatHistory(userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.email,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserXP(userId: string, xp: number): Promise<void> {
    await db.update(users)
      .set({ xp, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  async updateUserStreak(userId: string, streak: number): Promise<void> {
    await db.update(users)
      .set({ streak, lastActiveDate: new Date(), updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  // Language operations
  async getLanguages(): Promise<Language[]> {
    return db.select().from(languages);
  }

  async getLanguage(id: string): Promise<Language | undefined> {
    const [language] = await db.select().from(languages).where(eq(languages.id, id));
    return language;
  }

  async getLanguageById(id: string): Promise<Language | undefined> {
    return this.getLanguage(id);
  }

  // Lesson operations
  async getLessonsByLanguage(languageId: string): Promise<Lesson[]> {
    return db.select().from(lessons)
      .where(eq(lessons.languageId, languageId))
      .orderBy(lessons.order);
  }

  async getLessonById(id: string): Promise<Lesson | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson;
  }

  // Progress operations
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return db.select().from(userProgress).where(eq(userProgress.userId, userId));
  }

  async getProgressByLesson(userId: string, lessonId: string): Promise<UserProgress | undefined> {
    const [progress] = await db.select().from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.lessonId, lessonId)));
    return progress;
  }

  async markLessonComplete(progress: InsertProgress): Promise<UserProgress> {
    const [result] = await db.insert(userProgress)
      .values({ ...progress, completed: true, completedAt: new Date() })
      .onConflictDoUpdate({
        target: [userProgress.userId, userProgress.lessonId],
        set: { completed: true, completedAt: new Date() },
      })
      .returning();
    return result;
  }

  // Favorites operations
  async getUserFavorites(userId: string): Promise<UserFavorite[]> {
    return db.select().from(userFavorites).where(eq(userFavorites.userId, userId));
  }

  async addFavorite(favorite: InsertFavorite): Promise<UserFavorite> {
    const [result] = await db.insert(userFavorites).values(favorite).returning();
    return result;
  }

  async removeFavorite(userId: string, languageId: string): Promise<void> {
    await db.delete(userFavorites)
      .where(and(eq(userFavorites.userId, userId), eq(userFavorites.languageId, languageId)));
  }

  // Achievement operations
  async getAchievements(): Promise<Achievement[]> {
    return db.select().from(achievements);
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return db.select().from(userAchievements).where(eq(userAchievements.userId, userId));
  }

  async unlockAchievement(userId: string, achievementId: string): Promise<UserAchievement> {
    const [result] = await db.insert(userAchievements)
      .values({ userId, achievementId })
      .returning();
    return result;
  }

  // Quiz operations
  async getQuizzesByLanguage(languageId: string): Promise<Quiz[]> {
    return db.select().from(quizzes).where(eq(quizzes.languageId, languageId));
  }

  async getQuiz(id: string): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, id));
    return quiz;
  }

  async getQuizById(id: string): Promise<Quiz | undefined> {
    return this.getQuiz(id);
  }

  async getQuizQuestions(quizId: string): Promise<QuizQuestion[]> {
    return db.select().from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId))
      .orderBy(quizQuestions.order);
  }

  async submitQuizAttempt(attempt: InsertQuizAttempt): Promise<UserQuizAttempt> {
    const [result] = await db.insert(userQuizAttempts).values(attempt).returning();
    return result;
  }

  async getUserQuizAttempts(userId: string): Promise<UserQuizAttempt[]> {
    return db.select().from(userQuizAttempts)
      .where(eq(userQuizAttempts.userId, userId))
      .orderBy(desc(userQuizAttempts.completedAt));
  }

  // Challenge operations
  async getChallenges(): Promise<Challenge[]> {
    return db.select().from(challenges);
  }

  async getChallenge(id: string): Promise<Challenge | undefined> {
    const [challenge] = await db.select().from(challenges).where(eq(challenges.id, id));
    return challenge;
  }

  async getChallengeById(id: string): Promise<Challenge | undefined> {
    return this.getChallenge(id);
  }

  async submitChallenge(submission: InsertChallengeSubmission): Promise<UserChallengeSubmission> {
    const [result] = await db.insert(userChallengeSubmissions).values(submission).returning();
    return result;
  }

  async getUserChallengeSubmissions(userId: string): Promise<UserChallengeSubmission[]> {
    return db.select().from(userChallengeSubmissions)
      .where(eq(userChallengeSubmissions.userId, userId))
      .orderBy(desc(userChallengeSubmissions.submittedAt));
  }

  // Chat operations
  async getChatHistory(userId: string, limit = 50): Promise<ChatMessage[]> {
    return db.select().from(chatMessages)
      .where(eq(chatMessages.userId, userId))
      .orderBy(desc(chatMessages.createdAt))
      .limit(limit);
  }

  async addChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [result] = await db.insert(chatMessages).values(message).returning();
    return result;
  }

  async clearChatHistory(userId: string): Promise<void> {
    await db.delete(chatMessages).where(eq(chatMessages.userId, userId));
  }
}

export const storage = new DatabaseStorage();
