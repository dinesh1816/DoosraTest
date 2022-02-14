import "dotenv/config";

export default {
  dbconfig: {
    connString: process.env.MAIN_DB_CONN_STRING, // Change all required config to env variables
  },
  analyticsDbConfig: {
    connString: process.env.ANALYTICS_DB_CONN_STRING,
  },
  redisConfig: {
    connString: `redis://${process.env.REDIS_PASSWORD}@test-redis.notring.internal`,
  },

};
