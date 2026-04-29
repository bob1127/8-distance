// lib/redis.js
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL); // 請在 .env 設定 REDIS_URL

export default redis;