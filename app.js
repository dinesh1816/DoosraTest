/* eslint-disable import/no-import-module-exports */
// Module Imports
import express from "express";
import * as Sentry from "@sentry/node";
import cors from "cors";
import bodyParser from "body-parser";
import "express-async-errors";

// Default Imports
import user from "./routes/User";
import health from "./routes/Health";
import config from "./config/index";

import reqLog from "./middlewares/RequestLogger";

// Named Imports
import { checks } from "./middlewares/Auth";
import { resSuccessLog, resErrorLog } from "./middlewares/ResponseLogger";
import { validate } from "./middlewares/SchemaValidator";

const app = express();

// init sentry
Sentry.init({
  dsn: config.sentry_dsn,
  environment: process.env.NODE_ENV,
  // name is set in ecosystem config file
  serverName: process.env.name,
  // ignore middleware errors
  ignoreErrors: [/^Non-Error exception captured$/],
});
app.use(bodyParser.json());
app.use(cors());

app.use("*", [reqLog, checks, validate]);
app.use("/v1/health", health);
app.use("/v1/user", user);

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

app.use("*", [resSuccessLog, resErrorLog]);

module.exports = app;
