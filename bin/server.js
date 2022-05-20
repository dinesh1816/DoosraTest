#!/usr/bin/env node

/**
 * Module dependencies.
 */
require("@babel/register");
require("regenerator-runtime/runtime");
require("core-js/stable");

require("../utils/WinstonLogger").init();
const mainDbConnection = require("../connections/MainDb").init();
const analyticsDbConnection = require("../connections/AnalyticsDb").init();
const redisClient = require("../connections/RedisClient").init();
const app = require("../app");

const MAIN_DB_CONNECTED = "mainDbConnected";
const ANALYTICS_DB_CONNECTED = "analyticsDbConnected";
const REDIS_CONNECTED = "redisConnected";

let isMainDbConnected = false;
let isAnalyticsDbConnected = false;
let isRedisConnected = false;

function startApplication() {
  log("info", "starting application");
  const port = 4000;
  process.on("SIGINT", () => {
    process.exit();
  });
  app.listen(port, () => {
    log("info", `Listening on port ${port}`);
  }).on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      log("error", "port is already in use");
    } else {
      log("error", { error });
    }
    process.exit(1);
  });
}

/**
 *
 * @param {string} connectionStatus
 * set respective application connected status
 */
function setConnectionsStatus(connectionStatus) {
  if (MAIN_DB_CONNECTED === connectionStatus) {
    isMainDbConnected = true;
  } else if (ANALYTICS_DB_CONNECTED === connectionStatus) {
    isAnalyticsDbConnected = true;
  } else if (REDIS_CONNECTED === connectionStatus) {
    isRedisConnected = true;
  }
  if (isMainDbConnected && isAnalyticsDbConnected && isRedisConnected) {
    log("info", { isMainDbConnected, isAnalyticsDbConnected, isRedisConnected });
    startApplication();
  }
}

// set connections statuses
mainDbConnection.once("open", () => setConnectionsStatus(MAIN_DB_CONNECTED));
analyticsDbConnection.once("open", () => setConnectionsStatus(ANALYTICS_DB_CONNECTED));
redisClient.on("ready", () => setConnectionsStatus(REDIS_CONNECTED));
