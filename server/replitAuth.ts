import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import { storage } from "./storage";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  return session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: sessionTtl,
    },
  });
}

async function updateUserSession(user: any) {
  const now = Date.now();
  const userId = "local-user-" + Math.random().toString(36).substr(2, 9);
  
  user.claims = {
    sub: userId,
    email: "dev@example.com",
    first_name: "Dev",
    last_name: "User",
  };
  user.access_token = "dev-token";
  user.refresh_token = "dev-refresh";
  user.expires_at = Math.floor(Date.now() / 1000) + 86400;
  
  // Create user in database
  await storage.upsertUser({
    id: userId,
    email: user.claims.email,
    firstName: user.claims.first_name,
    lastName: user.claims.last_name,
    profileImageUrl: null,
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());

  app.get("/api/login", async (req: any, res) => {
    try {
      if (!req.user) {
        req.user = {};
        await updateUserSession(req.user);
      }
      req.isAuthenticated = () => true;
      res.redirect("/");
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.get("/api/callback", (req, res) => {
    res.redirect("/");
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect("/");
    });
  });
  
  // Middleware to ensure user is always authenticated in dev
  app.use(async (req: any, res, next) => {
    if (!req.user) {
      req.user = {};
      await updateUserSession(req.user);
      req.isAuthenticated = () => true;
    }
    next();
  });
}

export const isAuthenticated: RequestHandler = async (req: any, res, next) => {
  if (req.isAuthenticated?.()) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};
