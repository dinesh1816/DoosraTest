import { createClient } from "redis";
import config from "../config/index";

// eslint-disable-next-line import/no-mutable-exports
let RedisClient;

export function init() {
  const CONN_URL = config.redisConfig.connString;

  if (RedisClient) {
    return RedisClient;
  }

  log("info", `CONN_URL to connect to redis ${CONN_URL}`);

  RedisClient = createClient({
    url: CONN_URL,
  });

  //  Redis Connection Events
  RedisClient.on("connect", () => log("info", { redisConnection: "connect" }));
  RedisClient.on("ready", () => log("info", { redisConnection: "ready" }));
  RedisClient.on("reconnecting", () => log("info", { redisConnection: "reconnecting" }));
  RedisClient.on("end", () => log("info", { redisConnection: "disconnected" }));
  RedisClient.on("error", (error) => log("info", { error }));
  try {
    RedisClient.connect();
  } catch (error) {
    log("error", { error });
  }

  return RedisClient;
}

export function getDbInstance() {
  return RedisClient;
}
