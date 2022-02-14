import * as Auth from "../middlewares/Auth";
import * as UserService from "../services/UserService";
import {
  HEADER_SESSION_TOKEN,
  HEADER_API_KEY,
} from "../constants/Keys";

export const register = async (req, res, next) => {
  const {
    mobileNo, password, firstName, lastName,
  } = req.body;
  const userDetails = {
    mobileNo,
    password,
    firstName,
    lastName,
  };
  const clientDetails = {
    metro_auth_key: req.header(HEADER_API_KEY),
  };
  const userObj = await UserService.registerUser(userDetails, clientDetails);
  req.session = Auth.createSessionObj(userObj);
  res.data = {
    userDetails: userObj,
    sessiontoken: req.session,
  };
  next();
};

export const getUserDetails = async (req, res, next) => {
  const sessionObj = await Auth.getSessionObj(req);
  const { mobileNo } = sessionObj;
  const userObj = await UserService.getUserDetails(mobileNo);
  res.data = userObj;
  next();
};

export const updateUserDetails = async (req, res, next) => {
  const {
    firstName, lastName, alternateMobileNo, email,
  } = req.body;
  const sessionObj = await Auth.getSessionObj(req);
  const { mobileNo } = sessionObj;
  const userDetails = {
    firstName,
    lastName,
    alternateMobileNo,
    email,
    mobileNo,
  };
  await UserService.updateUserDetails(userDetails);
  res.data = {
    ...userDetails,
  };
  next();
};

export const unsuspendUser = async (req, res, next) => {
  const { userId } = req.body;
  const sessionObj = await Auth.getSessionObj(req);

  const sessionDetails = {
    sessionId: req.headers[HEADER_SESSION_TOKEN] || "NA",
    ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress || null,
    username: sessionObj?.username ?? "NA",
    userId: sessionObj?.user_id,
  };
  res.data = await UserService.unsuspendUser(userId, sessionDetails);

  next();
};
