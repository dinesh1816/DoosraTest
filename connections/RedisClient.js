import { createClient } from "redis";
import config from "../config/index";

// eslint-disable-next-line import/no-mutable-exports
let RedisClient;

(async () => {
  RedisClient = createClient({
    url: config.redisConfig.connString,
  });

  RedisClient.on("connect", () => console.log("Redis Client Initiating Connection..."));
  RedisClient.on("ready", () => console.log("Redis Client Connected Successfully."));
  RedisClient.on("reconnecting", () => console.log("Redis Client Reconnecting..."));
  RedisClient.on("end", () => console.log("Redis Client Disconnected."));
  RedisClient.on("error", (err) => console.log("Redis Client Error", err));

  try {
    await RedisClient.connect();
    console.log("Redis Client Connected", RedisClient);
  } catch (err) {
    console.error("Redis Client Exception", err);
  }
})();

export default RedisClient;
