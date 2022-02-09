import "dotenv/config";

export default {
  dbconfig: {
    dbname: process.env.MAIN_DB, // Change all required config to env variables
    host: "localhost",
    hostWithPort: "localhost:27017",
    isReplicaSet: false,
    replicaHosts: "localhost:27018,localhost:27019",
    replicaName: "rs0",
    port: 27017,
    dbuser: "",
    connString: "mongodb://localhost:27017/main",
  },
  analyticsDbConfig: {
    dbname: "analyticsdb",
    host: "localhost",
    isReplicaSet: false,
    replicaHosts: "localhost:27018,localhost:27019",
    replicaName: "rs0",
    port: 27017,
    dbuser: "",
    connString: "mongodb://localhost:27017/analytics",
  },
  redisConfig: {
    connString: "redis://localhost:6379",
  },
};
