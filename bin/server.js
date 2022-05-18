#!/usr/bin/env node

/**
 * Module dependencies.
 */
require("@babel/register");
require("regenerator-runtime/runtime");
require("core-js/stable");
const EventEmitter = require("events");

const eventEmitter = new EventEmitter();

require("../utils/WinstonLogger").init();
const mainDbConnection = require("../connections/MainDb").init();
const analyticsDbConnection = require("../connections/AnalyticsDb").init();
const redisClient = require("../connections/RedisClient").init();
const app = require("../app");

const MAIN_DB_CONNECTED = "mainDbConnected";
const ANALYTICS_DB_CONNECTED = "analyticsDbConnected";
const REDIS_CONNECTED = "redisConnected";
const START_APP = "startApp";

let isMainDbConnected = false;
let isAnalyticsDbConnected = false;
let isRedisConnected = false;

/**
 *
 * @param {string} connectionStatus
 * set respective application connected status
 */
function setApplicationStartStatus(connectionStatus) {
  if (MAIN_DB_CONNECTED === connectionStatus) {
    isMainDbConnected = true;
  } else if (ANALYTICS_DB_CONNECTED === connectionStatus) {
    isAnalyticsDbConnected = true;
  } else if (REDIS_CONNECTED === connectionStatus) {
    isRedisConnected = true;
  }
  if (isMainDbConnected && isRedisConnected) {
    log("info", { isMainDbConnected, isAnalyticsDbConnected, isRedisConnected });
    eventEmitter.emit(START_APP);
  }
}

function startApplication() {
  log("info", "starting application");
  const port = 4000;
  process.on("SIGINT", () => {
    process.exit();
  });
  app.listen(port, () => {
    log("info", `Listening on port ${port}`);
    eventEmitter.removeAllListeners(START_APP);
  }).on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      log("error", "port is already in use");
    } else {
      log("error", { error });
    }
    process.exit(1);
  });
}

// set connections statuses
mainDbConnection.once("open", () => setApplicationStartStatus(MAIN_DB_CONNECTED));
analyticsDbConnection.once("open", () => setApplicationStartStatus(ANALYTICS_DB_CONNECTED));
redisClient.on("ready", () => setApplicationStartStatus(REDIS_CONNECTED));

// start application when connections are ready
eventEmitter.on(START_APP, startApplication);
