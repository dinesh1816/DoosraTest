import { createClient } from "redis";
import config from "../config/index";

// eslint-disable-next-line import/no-mutable-exports
let RedisClient;

(async () => {
  RedisClient = createClient({
    url: config.redisConfig.connString,
  });

  RedisClient.on("connect", () => logToJSON("info", "Redis Client Initiating Connection..."));
  RedisClient.on("ready", () => logToJSON("info", "Redis Client Connected Successfully."));
  RedisClient.on("reconnecting", () => logToJSON("info", "Redis Client Reconnecting..."));
  RedisClient.on("end", () => logToJSON("info", "Redis Client Disconnected."));
  RedisClient.on("error", (err) => logToJSON("info", "Redis Client Error", err));

  try {
    await RedisClient.connect();
    logToJSON("info", "Redis Client Connected");
  } catch (err) {
    logToJSON("error", "Redis Client Exception", err);
  }
})();

export default RedisClient;
