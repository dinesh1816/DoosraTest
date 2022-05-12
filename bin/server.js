#!/usr/bin/env node

/**
 * Module dependencies.
 */
require("@babel/register");
require("regenerator-runtime/runtime");
require("core-js/stable");
const WinstonLogger = require("../utils/WinstonLogger");
// init
WinstonLogger.init();

const app = require("../app");

const port = 4000;

app
  .listen(port, () => {
    logToJSON("info", `Listening on port ${port}`);
  })
  .on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      logToJSON("info", "port is already in use");
    } else {
      logToJSON("error", { error });
    }
    process.exit(1);
  });
