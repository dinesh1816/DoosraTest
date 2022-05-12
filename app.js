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
import * as HttpContextMiddleware from "./middlewares/HttpContextMiddleware";

const httpContext = require("express-http-context");

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
// init httpcontext
app.use(httpContext.middleware);

// set http context
app.use(HttpContextMiddleware.setHttpContextMetrics);
app.use(HttpContextMiddleware.setHttpContextUserDetails);
app.use(HttpContextMiddleware.setHttpContextRequestPayload);

app.use("*", [reqLog, checks, validate]);
app.use("/v1/health", health);
app.use("/v1/user", user);

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// attach response payload
app.use(HttpContextMiddleware.setHttpContextResponsePayload);

// attach response payload on error
app.use(HttpContextMiddleware.setHttpContextErrorResponsePayload);

app.use("*", [resSuccessLog, resErrorLog]);

module.exports = app;
