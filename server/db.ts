import * as schema from "@shared/schema";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import * as fs from "fs";

let dbInstance: any;
let pool: any;

// Load .env file manually
function loadEnv() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const envPath = resolve(__dirname, "../.env");
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    const lines = envContent.split("\n");
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...valueParts] = trimmed.split("=");
        const value = valueParts.join("=");
        
        if (key && value) {
          process.env[key.trim()] = value.trim();
        }
      }
    }
  }
}

// Load env first
loadEnv();

async function initializeDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL not found! Please set DATABASE_URL in your .env file. Supabase is required."
    );
  }
  
  console.log("[DB] Connecting to Supabase PostgreSQL...");
  
  // Use PostgreSQL for Supabase
  const { drizzle: drizzlePostgres } = await import("drizzle-orm/node-postgres");
  const pg = await import("pg");
  const { Pool } = pg.default;
  
  try {
    pool = new Pool({ connectionString: databaseUrl });
    
    dbInstance = drizzlePostgres(pool, { schema });
    
    // Test connection in background - don't wait
    pool.query("SELECT NOW()").then(() => {
      console.log("[DB] ✓ Successfully connected to Supabase");
    }).catch((err: any) => {
      console.error("[DB] ✗ Connection test failed:", err.message);
    });
    
    return dbInstance;
  } catch (err) {
    console.error("[DB] ✗ Failed to initialize database:", err);
    throw new Error(`Database initialization failed: ${err}`);
  }
}

// Initialize on module load
const db = await initializeDatabase();

export { db, pool };
