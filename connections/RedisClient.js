import { createClient } from "redis";
import config from "../config/index";

// eslint-disable-next-line import/no-mutable-exports
let RedisClient;

(async () => {
  RedisClient = createClient({
    url: config.redisConfig.connString,
  });

  RedisClient.on("connect", () => log("info", { redisConnection: "connect" }));
  RedisClient.on("ready", () => log("info", { redisConnection: "ready" }));
  RedisClient.on("reconnecting", () => log("info", { redisConnection: "reconnecting" }));
  RedisClient.on("end", () => log("info", { redisConnection: "disconnected" }));
  RedisClient.on("error", (error) => log("info", { error }));

  try {
    await RedisClient.connect();
    log("info", { redisConnection: "connected" });
  } catch (error) {
    log("error", { error });
  }
})();

export default RedisClient;
