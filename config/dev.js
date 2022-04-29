import "dotenv/config";

export default {
  mainDbconfig: {
    connString: process.env.MAIN_DB_CONN_STRING, // Change all required config to env variables
  },
  analyticsDbConfig: {
    connString: process.env.ANALYTICS_DB_CONN_STRING,
  },
  redisConfig: {
    connString: "redis://localhost:6379",
  },
  sentry_dsn: process.env.SENTRY_DSN,
};
