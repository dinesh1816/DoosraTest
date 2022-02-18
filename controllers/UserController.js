import * as Auth from "../middlewares/Auth";
import * as UserService from "../services/UserService";
import * as SessionUtils from "../utils/SessionUtils";
import { HEADER_API_KEY } from "../constants/Keys";

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
  const { userId, reason } = req.body;
  const sessionObj = await Auth.getSessionObj(req);
  const getSessionMetadata = SessionUtils.getSessionMetadata(sessionObj, req);

  res.data = await UserService.unsuspendUser(userId, reason, getSessionMetadata);
  next();
};

export const tempReactivateUser = async (req, res, next) => {
  const { userId, reason } = req.body;
  const sessionObj = await Auth.getSessionObj(req);
  const getSessionMetadata = SessionUtils.getSessionMetadata(sessionObj, req);

  res.data = await UserService.tempReactivateUser(userId, reason, getSessionMetadata);
  next();
};

export const whitelistUser = async (req, res, next) => {
  const { userId, reason } = req.body;
  const sessionObj = await Auth.getSessionObj(req);
  const getSessionMetadata = SessionUtils.getSessionMetadata(sessionObj, req);

  res.data = await UserService.whitelistUser(userId, reason, getSessionMetadata);
  next();
};
