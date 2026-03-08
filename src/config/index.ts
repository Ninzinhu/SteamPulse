import dotenv from "dotenv";

dotenv.config();
console.log('config loaded, DATABASE_URL=', process.env.DATABASE_URL, 'REDIS_URL=', process.env.REDIS_URL);

export const config = {
  databaseUrl: process.env.DATABASE_URL || "",
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  jwtSecret: process.env.JWT_SECRET || "changeme",
  vapidPublicKey: process.env.VAPID_PUBLIC_KEY || "",
  vapidPrivateKey: process.env.VAPID_PRIVATE_KEY || "",
  steamReturnUrl:
    process.env.STEAM_RETURN_URL || "http://localhost:3000/auth/steam/return",
  steamApiKey: process.env.STEAM_API_KEY || "",
};
