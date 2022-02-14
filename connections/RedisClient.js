import { createClient } from "redis";
import config from "../config/index";

// eslint-disable-next-line import/no-mutable-exports
let RedisClient;

(async () => {
  RedisClient = createClient({
    url: config.redisConfig.connString,
  });

  RedisClient.on("error", (err) => console.log("Redis Client Error", err));

  await RedisClient.connect();
  console.log("Redis Client Connected", RedisClient);
})();

export default RedisClient;
