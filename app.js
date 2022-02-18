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
  serverName: process.env.name,
  // https://forum.sentry.io/t/how-to-filter-out-errors-which-are-handled-by-try-catch/9051/10
  // https://github.com/getsentry/sentry-javascript/issues/2292#issuecomment-977673820
  beforeSend(event) {
    const isException = event?.exception?.values[0];
    const isHandled = isException && isException.mechanism && isException.mechanism.handled;
    const isMiddlewareErrors = isException?.value?.startsWith("Non-Error exception captured");

    if (!isHandled || !isMiddlewareErrors) {
      return event;
    }
    return null;
  },
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
