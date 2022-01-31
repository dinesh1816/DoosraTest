/* eslint-disable import/no-import-module-exports */
// Module Imports
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "express-async-errors";

// Default Imports
import user from "./routes/User";
// import posts from './routes/Posts';
import health from "./routes/Health";

import reqLog from "./middlewares/RequestLogger";

// Named Imports
import { checks } from "./middlewares/Auth";
import { resSuccessLog, resErrorLog } from "./middlewares/ResponseLogger";
import { validate } from "./middlewares/SchemaValidator";

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use("*", [reqLog, checks, validate]);
app.use("/v1/health", health);
// app.use('/v1/posts', posts);
app.use("/v1/user", user);

app.use("*", [resSuccessLog, resErrorLog]);

module.exports = app;
