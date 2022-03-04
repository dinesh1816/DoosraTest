export default {
  dbconfig: {
    connString: "mongodb://localhost:27017/maindb",
  },
  analyticsDbConfig: {
    connString: "mongodb://localhost:27017/analyticsdb",
  },
  redisConfig: {
    connString: "redis://localhost:6379",
  },
  sentry_dsn: process.env.SENTRY_DSN,
};
