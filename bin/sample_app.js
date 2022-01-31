#!/usr/bin/env node

/**
 * Module dependencies.
 */
require("babel-core/register");
require("babel-polyfill");
const app = require("../app");

const port = 4000;

app
  .listen(port, () => {
    console.log(`Listening on port ${port}`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log("port is already in use");
    } else {
      console.log(err);
    }
    process.exit(1);
  });
