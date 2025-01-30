import redis from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const createRedisClient = async () => {
  const client = redis.createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  });

  await client.connect();

  client.on('connect', () => {
    console.log('Successfully connected to Redis!');
  });

  client.on('error', (err) => {
    console.error('Error connecting to Redis:', err);
  });

  return client;
};

export default createRedisClient;
