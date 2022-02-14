import _ from "lodash";
import * as AbstractModels from "../models/AbstractModels";
import * as ErrorUtils from "../errors/ErrorUtils";
import * as EncryptionService from "./EncryptionService";

import Users from "../models/Users";
import Clients from "../models/Clients";

import UserActivityService from "./UserActivityService";

import UserActivityConstants from "../constants/UserActivityConstants";
import UserConstants from "../constants/UserConstants";

async function getClientIdFromApiKey(apiKey) {
  const findCondition = {
    apiKey,
  };

  // const client = await Clients.findOne(findCondition);

  const clientObj = await AbstractModels.mongoFindOne(Clients, findCondition);
  const clientId = clientObj._id;
  return clientId;
}

export const registerUser = async (userDetails, clientDetails) => {
  const {
    mobileNo, password, firstName, lastName,
  } = userDetails;
  const findCondition = {
    mobileNo,
  };
  let userObj = await AbstractModels.mongoFindOne(Users, findCondition);
  if (userObj) {
    throw new ErrorUtils.DataAlreadyExists();
  } else {
    const bcryptedPassword = EncryptionService.generateBcryptPassword(password);
    const clientId = await getClientIdFromApiKey(clientDetails.apiKey);
    userObj = {
      mobileNo,
      firstName,
      lastName,
      password: bcryptedPassword,
      clientId,
      userType: "user",
    };
    await AbstractModels.mongoInsertOne(Users, userObj);
    delete userObj.password;
    return userObj;
  }
};

export const getUserDetails = async (mobileNo) => {
  const selectCondition = {
    mobileNo,
  };
  const projectCondition = {
    _id: 0,
    mobileNo: 1,
    firstName: 1,
    lastName: 1,
    alternateMobileNo: 1,
    email: 1,
  };
  const userObj = await AbstractModels.mongoFindOne(
    Users,
    selectCondition,
    projectCondition,
  );
  return userObj;
};

export const updateUserDetails = async (userDetails) => {
  const {
    firstName, lastName, alternateMobileNo, email, mobileNo,
  } = userDetails;
  const selectCondition = {
    mobileNo,
  };
  const updateCondition = {
    $set: {
      firstName,
      lastName,
      alternateMobileNo,
      email,
    },
  };
  await AbstractModels.mongoUpdateOne(Users, selectCondition, updateCondition);
};

export const unsuspendUser = async (userId, loggedInUserSession) => {
  const condition = { user_id: userId, status: UserConstants.USER_STATUS.SUSPENDED };
  const userDetails = await AbstractModels.mongoFindOne(Users, condition);

  if (userDetails) {
    const unset = ["suspend_details"];
    let status = UserConstants.USER_STATUS.ACTIVE;
    if (
      _.isDate(userDetails.expire_on)
      && userDetails.expired_at <= new Date()
    ) {
      status = UserConstants.USER_STATUS.EXPIRED;
    } else {
      unset.push("expired_at");
    }

    const updateData = [{ $set: { status } }, { $unset: unset }];
    await AbstractModels.mongoUpdateOne(Users, condition, updateData);

    UserActivityService.addToUserActivity(
      userId,
      loggedInUserSession?.userId,
      UserActivityConstants.USER_ACTIVITY_ACTION.unsuspended,
      loggedInUserSession,
    );

    return { isSuspended: true };
  }

  throw ErrorUtils.SuspendedUserNotFoundError();
};
