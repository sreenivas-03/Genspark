import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { generateChatResponse } from "./openai";
import { seedDatabase } from "./seed";
import { 
  insertProgressSchema, 
  insertFavoriteSchema, 
  insertQuizAttemptSchema,
  insertChallengeSubmissionSchema,
  insertChatMessageSchema 
} from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth middleware
  await setupAuth(app);
  
  // Seed database in background (don't wait)
  seedDatabase().catch(err => console.error("[Routes] Seeding error:", err));

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Language routes
  app.get('/api/languages', async (req, res) => {
    try {
      const langs = await storage.getLanguages();
      res.json(langs);
    } catch (error) {
      console.error("Error fetching languages:", error);
      res.status(500).json({ message: "Failed to fetch languages" });
    }
  });

  app.get('/api/languages/:id', async (req, res) => {
    try {
      const language = await storage.getLanguage(req.params.id);
      if (!language) {
        return res.status(404).json({ message: "Language not found" });
      }
      res.json(language);
    } catch (error) {
      console.error("Error fetching language:", error);
      res.status(500).json({ message: "Failed to fetch language" });
    }
  });

  // Lesson routes
  app.get('/api/languages/:id/lessons', async (req, res) => {
    try {
      const lessonList = await storage.getLessonsByLanguage(req.params.id);
      res.json(lessonList);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      res.status(500).json({ message: "Failed to fetch lessons" });
    }
  });

  // Progress routes
  app.get('/api/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  app.post('/api/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertProgressSchema.parse({ ...req.body, userId });
      const progress = await storage.markLessonComplete(data);
      
      // Update user XP
      const user = await storage.getUser(userId);
      if (user) {
        const newXP = (user.xp || 0) + (req.body.xpReward || 50);
        await storage.updateUserXP(userId, newXP);
      }
      
      res.json(progress);
    } catch (error) {
      console.error("Error saving progress:", error);
      res.status(500).json({ message: "Failed to save progress" });
    }
  });

  // Favorites routes
  app.get('/api/favorites', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const favorites = await storage.getUserFavorites(userId);
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.post('/api/favorites', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertFavoriteSchema.parse({ ...req.body, userId });
      const favorite = await storage.addFavorite(data);
      res.json(favorite);
    } catch (error) {
      console.error("Error adding favorite:", error);
      res.status(500).json({ message: "Failed to add favorite" });
    }
  });

  app.delete('/api/favorites/:languageId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.removeFavorite(userId, req.params.languageId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });

  // Achievements routes
  app.get('/api/achievements', async (req, res) => {
    try {
      const achievementList = await storage.getAchievements();
      res.json(achievementList);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.get('/api/user/achievements', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const achievements = await storage.getUserAchievements(userId);
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // Quiz routes
  app.get('/api/quiz/:id', async (req, res) => {
    try {
      const quiz = await storage.getQuiz(req.params.id);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      res.json(quiz);
    } catch (error) {
      console.error("Error fetching quiz:", error);
      res.status(500).json({ message: "Failed to fetch quiz" });
    }
  });

  app.post('/api/quiz/submit', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertQuizAttemptSchema.parse({ ...req.body, userId });
      const attempt = await storage.submitQuizAttempt(data);
      
      // Update user XP based on score
      const user = await storage.getUser(userId);
      if (user) {
        const xpEarned = Math.floor((data.score / data.totalQuestions) * (req.body.xpReward || 100));
        const newXP = (user.xp || 0) + xpEarned;
        await storage.updateUserXP(userId, newXP);
      }
      
      res.json({ ...attempt, xpEarned: Math.floor((data.score / data.totalQuestions) * 100) });
    } catch (error) {
      console.error("Error submitting quiz:", error);
      res.status(500).json({ message: "Failed to submit quiz" });
    }
  });

  // Challenge routes
  app.get('/api/challenges', async (req, res) => {
    try {
      const challengeList = await storage.getChallenges();
      res.json(challengeList);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      res.status(500).json({ message: "Failed to fetch challenges" });
    }
  });

  app.get('/api/challenges/:id', async (req, res) => {
    try {
      const challenge = await storage.getChallenge(req.params.id);
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      res.json(challenge);
    } catch (error) {
      console.error("Error fetching challenge:", error);
      res.status(500).json({ message: "Failed to fetch challenge" });
    }
  });

  app.post('/api/challenges/submit', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertChallengeSubmissionSchema.parse({ ...req.body, userId });
      const submission = await storage.submitChallenge(data);
      
      // Update user XP if passed
      if (data.passed) {
        const user = await storage.getUser(userId);
        if (user) {
          const newXP = (user.xp || 0) + (req.body.xpReward || 150);
          await storage.updateUserXP(userId, newXP);
        }
      }
      
      res.json(submission);
    } catch (error) {
      console.error("Error submitting challenge:", error);
      res.status(500).json({ message: "Failed to submit challenge" });
    }
  });

  // AI Chat routes
  app.post('/api/chat', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { message } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Message is required" });
      }

      // Save user message
      await storage.addChatMessage({
        userId,
        role: "user",
        content: message,
      });

      // Get chat history for context
      const history = await storage.getChatHistory(userId, 10);
      const messages = history.reverse().map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      // Generate AI response
      let response: string;
      try {
        response = await generateChatResponse(messages);
      } catch (aiError) {
        console.error("OpenAI error:", aiError);
        response = "I apologize, but I'm having trouble generating a response right now. Please try again in a moment.";
      }

      // Save assistant response
      await storage.addChatMessage({
        userId,
        role: "assistant",
        content: response,
      });

      res.json({ response });
    } catch (error) {
      console.error("Error in chat:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  app.get('/api/chat/history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const history = await storage.getChatHistory(userId);
      res.json(history.reverse());
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ message: "Failed to fetch chat history" });
    }
  });

  app.delete('/api/chat/history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.clearChatHistory(userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error clearing chat history:", error);
      res.status(500).json({ message: "Failed to clear chat history" });
    }
  });

  // User stats route
  app.get('/api/user/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const progress = await storage.getUserProgress(userId);
      const achievements = await storage.getUserAchievements(userId);
      const quizAttempts = await storage.getUserQuizAttempts(userId);
      const challengeSubmissions = await storage.getUserChallengeSubmissions(userId);

      res.json({
        xp: user?.xp || 0,
        streak: user?.streak || 0,
        lessonsCompleted: progress.filter(p => p.completed).length,
        badgesEarned: achievements.length,
        quizzesCompleted: quizAttempts.length,
        challengesSolved: challengeSubmissions.filter(s => s.passed).length,
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  return httpServer;
}
