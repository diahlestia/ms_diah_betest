import { createClient } from 'redis';
import dotenv from "dotenv";

dotenv.config()

const REDIS_URL = process.env.REDIS_URL
const REDIS_INSTANCE_NAME=process.env.REDIS_INSTANCE_NAME
let redisClient = null;

const getRedis = () => {
    if (!redisClient) {
        redisClient = createClient({
            url: REDIS_URL,
            name: REDIS_INSTANCE_NAME,
            retryStrategy: (options) => {
                console.error('Redis connection error:', err);
                if (options.attempt > 10) {
                    return new Error('Max retries exceeded');
                }
                return Math.min(options.attempt * 100, 3000);
            },
        });

        redisClient.connect().catch((err) => {
            console.error('Redis connection error:', err);
        });
    }

    return redisClient;
};

export default getRedis;
