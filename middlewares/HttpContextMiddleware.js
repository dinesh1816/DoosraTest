import * as Constants from "../constants/Constants";

const httpContext = require("express-http-context");
const _ = require("lodash");

export function setHttpContextMetrics(req, res, next) {
  httpContext.set(Constants.LOGGER_REQUEST_START_TIME, process.hrtime.bigint());
  httpContext.set(Constants.LOGGER_API_ROUTE, req.path);
  httpContext.set(Constants.LOGGER_USER_IP_ADDRESS, req.headers["x-forwarded-for"] || req.connection.remoteAddress);
  next();
}

export function setHttpContextUserDetails(req, res, next) {
  // set session payload for metroauth initi
  if (req.session) {
    httpContext.set(Constants.LOGGER_USER_DETAILS, {
      userId: req.session.user_id || "",
      primaryNumber: req.session.zvr_mobile_no || "",
      doosraNumber: req.session.v_mobile_no || "",
    });
  }
  next();
}

// unable to capture dynamic url path in request middleware
// req.route.path is populated when it hits matched route only
// is captured in response middleware
// http://expressjs.com/en/api.html#req.route
export function setHttpContextRequestPayload(req, res, next) {
  httpContext.set(Constants.LOGGER_REQUEST_PAYLOAD, {
    // clone
    urlDetails: _.cloneDeep({
      path: req.path,
      baseUrl: req.baseUrl,
      host: req.hostname,
      httpVersion: req.httpVersion,
      method: req.method,
      originalUrl: req.originalUrl,
      protocol: req.protocol,
      url: req.url,
    }),
    headers: _.cloneDeep(req.headers),
    params: _.cloneDeep(req.params),
    body: _.cloneDeep(req.body),
    query: _.cloneDeep(req.query),
  });
  next();
}

/**
 *
 * @param {*} req
 *
 * https://expressjs.com/en/api.html#req.route
 * Contains the currently-matched route, a string.
 * req.route.path is update on matched route and available in response middleware.
 */
function setHttpContextDynamicRoutePath(req) {
  const requestPayload = httpContext.get(Constants.LOGGER_REQUEST_PAYLOAD);
  if (requestPayload && requestPayload.urlDetails) {
    requestPayload.urlDetails.dynamicRoutePath = req.route?.path;
    httpContext.set(Constants.LOGGER_REQUEST_PAYLOAD, _.cloneDeep(requestPayload));
  }
}

function getResponseTime() {
  let timeDiff = "-";
  const nanoToMilli = BigInt(1e6);
  const startTime = httpContext.get(Constants.LOGGER_REQUEST_START_TIME);
  const endTime = process.hrtime.bigint();
  try {
    if (typeof startTime === "bigint" && typeof endTime === "bigint") {
      timeDiff = (endTime - startTime) / nanoToMilli;
    }
  } catch (error) {
    log("error", { error });
  }
  return `${timeDiff}ms`;
}

export function setHttpContextResponsePayload(req, res, next) {
  const out = {
    headers: res.getHeaders(),
    data: res.data,
  };
  setHttpContextDynamicRoutePath(req);
  httpContext.set(Constants.LOGGER_RESPONSE_PAYLOAD, _.cloneDeep(out));
  httpContext.set(Constants.LOGGER_RESPONSE_TIME, getResponseTime());
  next();
}

export function setHttpContextErrorResponsePayload(error, req, res, next) {
  const out = {
    headers: res.getHeaders(),
    error,
  };
  setHttpContextDynamicRoutePath(req);
  httpContext.set(Constants.LOGGER_RESPONSE_PAYLOAD, _.cloneDeep(out));
  httpContext.set(Constants.LOGGER_RESPONSE_TIME, getResponseTime());
  next(error);
}
