import { createClient } from "redis";
import config from "../config/index";

// eslint-disable-next-line import/no-mutable-exports
let RedisClient;

(async () => {
  RedisClient = createClient({
    url: config.redisConfig.connString,
  });

  RedisClient.on("connect", () => logToJSON("info", { redisConnection: "connect" }));
  RedisClient.on("ready", () => logToJSON("info", { redisConnection: "ready" }));
  RedisClient.on("reconnecting", () => logToJSON("info", { redisConnection: "reconnecting" }));
  RedisClient.on("end", () => logToJSON("info", { redisConnection: "disconnected" }));
  RedisClient.on("error", (error) => logToJSON("info", { error }));

  try {
    await RedisClient.connect();
    logToJSON("info", { redisConnection: "connected" });
  } catch (error) {
    logToJSON("error", { error });
  }
})();

export default RedisClient;
