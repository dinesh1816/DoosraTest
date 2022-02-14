import cryptoRandomString from "crypto-random-string";
import path from "path";
import jwt from "jsonwebtoken";
import fs from "fs";
import crypto from "crypto";

import * as ErrorUtils from "../errors/ErrorUtils";
import * as AbstractModels from "../models/AbstractModels";
import Users from "../models/Users";
import Clients from "../models/Clients";
import RedisClient from "../connections/RedisClient";

import {
  SECREAT, ALGORITHM, PASSWORD,
} from "../constants/Credentials";

import {
  HEADER_API_KEY, HEADER_SESSION_TOKEN,
} from "../constants/Keys";

// Static data can be read using require or fs
let newSessionRoutes = fs.readFileSync(
  path.resolve(__dirname, "NewSessionRoutes.json"),
  "utf8",
);
newSessionRoutes = JSON.parse(newSessionRoutes);

let authenticatedRoutes = fs.readFileSync(
  path.resolve(__dirname, "./AuthenticatedRoutes.json"),
  "utf8",
);
authenticatedRoutes = JSON.parse(authenticatedRoutes);

const noSessionRoutes = require("./NoSessionRoutes.json");
const noAPIKeyRoutes = require("./NoClientIdRoutes.json");
const healthCheckRoutes = require("./HealthCheckRoutes.json");

const routeMaps = [
  newSessionRoutes,
  authenticatedRoutes,
  noSessionRoutes,
  noAPIKeyRoutes,
  healthCheckRoutes,
];

const getRouteCategory = (routeMapsIndex) => {
  let routeCategory = "others";
  if (routeMapsIndex === 0) {
    routeCategory = "newSessionRoutes";
  } else if (routeMapsIndex === 1) {
    routeCategory = "authenticatedRoutes";
  } else if (routeMapsIndex === 2) {
    routeCategory = "noSessionRoutes";
  } else if (routeMapsIndex === 3) {
    routeCategory = "noAPIKeyRoutes";
  } else if (routeMapsIndex === 4) {
    routeCategory = "healthCheckRoutes";
  }
  return routeCategory;
};

const checkApiKeyValidity = async (req) => {
  const apiKey = req.header(HEADER_API_KEY);
  const selectCondition = {
    apiKey,
  };
  const projectCondition = {
    apiKey: 1,
    _id: 0,
  };
  const isValidAPIKey = await AbstractModels.mongoFindOne(
    Clients,
    selectCondition,
    projectCondition,
  );
  return isValidAPIKey;
};

const getRedisSession = async (sessionId) => {
  try {
    const redisSession = await RedisClient.get(sessionId);
    return redisSession;
  } catch (err) {
    console.log("Redis connection error ", err.stack);
    throw new Error(ErrorUtils.redisConnectionError());
  }
};

const decrypt = (text) => {
  let resultChiper = "";
  // eslint-disable-next-line
  const decipher = crypto.createDecipher(ALGORITHM, PASSWORD);
  resultChiper = decipher.update(text, "hex", "utf8");
  resultChiper += decipher.final("utf8");
  return resultChiper;
};

export const getSessionObj = async (req) => {
  const sessiontoken = req.header(HEADER_SESSION_TOKEN);
  if (!sessiontoken) throw new ErrorUtils.InvalidSessionToken();
  // const session = jwt.verify(sessiontoken, SECREAT);

  const sessionId = decrypt(sessiontoken);
  let session = await getRedisSession(sessionId);
  console.log("session token :", sessiontoken);
  console.log("sessionId :", sessionId);
  console.log("session :", session);

  if (!session) {
    throw new Error(ErrorUtils.InvalidSessionToken());
  }
  try {
    session = JSON.parse(session);
  } catch (err) {
    throw new Error(ErrorUtils.InvalidSessionToken());
  }
  return session;
};
const getRouteObj = (originalUrl, httpMethod) => {
  let routeObj = {};
  const normalizedURL = originalUrl.toLowerCase().split("?")[0];
  const index = normalizedURL.lastIndexOf("/");
  const baseURL = normalizedURL.substring(0, index);
  let isRouteObjFound = false;
  for (let i = 0; i < routeMaps.length; i++) {
    const routeMap = routeMaps[i];
    if (routeMap && routeMap[httpMethod]) {
      if (routeMap[httpMethod][normalizedURL]) {
        routeObj = routeMap[httpMethod][normalizedURL];
        isRouteObjFound = true;
      } else if (
        routeMap[httpMethod][`${baseURL}/:param`]
        && index !== normalizedURL.length - 1
      ) {
        routeObj = routeMap[httpMethod][`${baseURL}/:param`];
        isRouteObjFound = true;
      }
      if (isRouteObjFound) {
        routeObj.httpMethod = httpMethod;
        routeObj.baseURL = baseURL;
        routeObj.normalizedURL = normalizedURL;
        routeObj.routeCategory = getRouteCategory(i);
        break;
      }
    }
  }
  // If route is not found from RoutesMap it shoud be treated as others
  if (!isRouteObjFound) {
    routeObj.httpMethod = httpMethod;
    routeObj.baseURL = baseURL;
    routeObj.normalizedURL = normalizedURL;
    routeObj.routeCategory = "others";
  }
  return routeObj;
};

const checkAutorization = async (req) => {
  let isAuthorizedToAccessRoute = false;
  const session = await getSessionObj(req);
  const { userType } = session;
  const routeAutorizedUserTypes = req.routeObj.userType || [];
  if (
    routeAutorizedUserTypes
    && routeAutorizedUserTypes.indexOf(userType) > -1
  ) {
    isAuthorizedToAccessRoute = true;
  }
  return isAuthorizedToAccessRoute;
};

const checkBlockListedUser = async (req) => {
  let isBlockedUser = false;
  const session = await getSessionObj(req);
  const { mobileNo } = session;
  const selectCondition = {
    mobileNo,
    isBlockedUser: true,
  };
  const projectCondition = {
    mobileNo: 1,
    _id: 0,
  };
  const userObj = await AbstractModels.mongoFindOne(
    Users,
    selectCondition,
    projectCondition,
  );
  if (userObj) {
    isBlockedUser = true;
  }
  return isBlockedUser;
};

export const createSessionObj = (data) => {
  const session = jwt.sign(data, SECREAT, { expiresIn: 60 * 60 * 24 * 30 }); // default is in sec
  return session;
};

/*
1.newSessionRoutes
2.authenticatedRoutes(api key check,sessoin token check,Authorize check,blocklist users check)
3.noSessionRoutes(api key check)
4.noAPIKeyRoutes
5.healthCheckRoutes(Dont' store Audits)
6.others

For each req store req, res audits
*/

export const checks = async (req, res, next) => {
  const { routeCategory } = req.routeObj;
  if (routeCategory === "others") {
    const err = ErrorUtils.InvalidRequest();
    next(err);
  } else if (routeCategory === "healthCheckRoutes") {
    next();
  } else if (routeCategory === "noAPIKeyRoutes") {
    next();
  } else if (
    routeCategory === "noSessionRoutes"
    || routeCategory === "newSessionRoutes"
  ) {
    const isValidAPIKey = await checkApiKeyValidity(req);
    if (!isValidAPIKey) {
      const err = ErrorUtils.InvalidAPIKey();
      next(err);
    } else {
      next();
    }
  } else if (routeCategory === "authenticatedRoutes") {
    // 1.api key check 2.session token check 3.autorization check 4.blocklisted user check
    const isValidAPIKey = await checkApiKeyValidity(req);
    const session = await getSessionObj(req);
    if (!session) {
      const err = ErrorUtils.InvalidSessionToken();
      next(err);
    } else {
      const isAuthorizedToAccessRoute = checkAutorization(req);
      const isBlockListeduser = await checkBlockListedUser(req);
      if (!isValidAPIKey) {
        const err = ErrorUtils.InvalidAPIKey();
        next(err);
      } else if (isBlockListeduser) {
        const err = ErrorUtils.BlockListedUser();
        next(err);
      } else if (!isAuthorizedToAccessRoute) {
        const err = ErrorUtils.InvalidAuthorization();
        next(err);
      } else {
        req.sesssion = session;
        next();
      }
    }
  }
};

export const injectRequestId = (req) => {
  const { originalUrl } = req;
  const httpMethod = req.method;
  const routeObj = getRouteObj(originalUrl, httpMethod);

  routeObj.requestId = cryptoRandomString({ length: 15 });
  routeObj.startTime = new Date().getTime();

  return routeObj;
};
