import path from "path";
import os from "os";
import winston from "winston";
import { JSONPath } from "jsonpath-plus";
import * as Constants from "../constants/Constants";

require("winston-daily-rotate-file");
const util = require("util");
const lodash = require("lodash");
const httpContext = require("express-http-context");
const fs = require("fs");

const { format } = winston;
const { combine, timestamp, json } = format;
const SENSITIVE_DATA_MAPPINGS = {
  "$.request.body": ["password"],
  "$.response.messages[:]": ["message"],
};
const MASK = "XXXXXX";
let loggerReference;

// Parse unhandled exceptions, convert message to json object
const parseUnhandledExceptions = format((info) => {
  const input = { ...info };
  if (info.exception) {
    input.message = { error: info };
  }
  return input;
});

// https://github.com/winstonjs/winston#logging-levels
// https://www.npmjs.com/package/winston-daily-rotate-file

export default function WinstonLogger() {
  const logDir = `${os.homedir()}/${process.env.name}-logs/`;
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
  const logger = winston.createLogger({
    defaultMeta: {
      service: process.env.name,
    },
    level: "info",
    format: combine(
      parseUnhandledExceptions(),
      timestamp(),
      json(),
    ),
    exitOnError: false,
    transports: [
      new winston.transports.DailyRotateFile({
        filename: "all",
        extension: ".log",
        dirname: logDir,
        maxSize: "50m",
        maxFiles: "10",
        handleExceptions: true,
        handleRejections: true,
      }),
    ],
  });
    // for local write to console
  if (process.env.NODE_ENV === "default") {
    const console = new winston.transports.Console({
      handleExceptions: true,
      handleRejections: true,
      exitOnError: false,
    });
    logger.add(console); // Add console transport
  }
  return logger;
}

function getInstanceOfLogger() {
  if (!loggerReference) {
    loggerReference = new WinstonLogger();
  }
  return loggerReference;
}

export function init() {
  loggerReference = new WinstonLogger();
}

const replaceMask = (payload) => {
  const input = { ...payload };
  Object.keys(SENSITIVE_DATA_MAPPINGS).forEach((jsonPath) => {
    if (Array.isArray(SENSITIVE_DATA_MAPPINGS[jsonPath])) {
      SENSITIVE_DATA_MAPPINGS[jsonPath].forEach((v, k) => {
        if (input[SENSITIVE_DATA_MAPPINGS[jsonPath][k]]) {
          input[SENSITIVE_DATA_MAPPINGS[jsonPath][k]] = MASK;
        }
      });
    }
  });
  return input;
};

const maskSensitiveData = (info) => {
  Object.keys(SENSITIVE_DATA_MAPPINGS).forEach((jsonPath) => {
    JSONPath({
      path: jsonPath,
      json: info,
      callback: replaceMask,
    });
  });
  return info;
};

// https://v8.dev/docs/stack-trace-api
function doosraTrace() {
  const orig = Error.prepareStackTrace;
  Error.prepareStackTrace = (_, stack) => stack;
  const err = new Error();
  Error.captureStackTrace(err, logToJSON);
  const { stack } = err;
  Error.prepareStackTrace = orig;
  const filename = path.basename(stack[0].getFileName());
  const functionName = stack[8] ? stack[8].getFunctionName() : "";
  return { filename, functionName };
}

function jsonStringifyLog(log) {
  const jsonLog = lodash.cloneDeep(log);
  try {
    jsonLog.message = util.inspect(jsonLog.message);
    jsonLog.request = util.inspect(jsonLog.request);
    jsonLog.response = util.inspect(jsonLog.response);
  } catch (error) {
    logToJSON("error", { error });
  }
  return jsonLog;
}

global.logToJSON = function (level, message) {
  const localLevel = level || "info";
  const { filename, functionName } = doosraTrace();
  let log = {
    correlationId: httpContext.get(Constants.LOGGER_CORRELATIONID) || "",
    filename,
    functionName,
    ipAddress: httpContext.get(Constants.LOGGER_USER_IP_ADDRESS) || "",
    message,
    request: httpContext.get(Constants.LOGGER_REQUEST_PAYLOAD) || {},
    response: httpContext.get(Constants.LOGGER_RESPONSE_PAYLOAD) || {},
    responseTime: httpContext.get(Constants.LOGGER_RESPONSE_TIME),
    route: httpContext.get(Constants.LOGGER_API_ROUTE) || "",
    userDetails: httpContext.get(Constants.LOGGER_USER_DETAILS) || {},
  };
  log = maskSensitiveData(log);
  const logger = getInstanceOfLogger();
  logger.log(localLevel, jsonStringifyLog(log));
  return log;
};
