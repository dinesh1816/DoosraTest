import _ from "lodash";
import * as AbstractModels from "../models/AbstractModels";
import * as ErrorUtils from "../errors/ErrorUtils";
import * as EncryptionService from "./EncryptionService";

import Users from "../models/Users";
import Clients from "../models/Clients";
import VirtualNumberList from "../models/VirtualNumberList";

import * as UserActivityService from "./UserActivityService";

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

export const unsuspendUser = async (userId, reason, loggedInUserSession) => {
  const condition = { user_id: userId, status: UserConstants.USER_STATUS.SUSPENDED };
  const userDetails = await AbstractModels.mongoFindOne(Users, condition);

  if (!userDetails) {
    throw ErrorUtils.SuspendedUserNotFoundError();
  }

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
    { ...loggedInUserSession, reason },
  );

  return { isSuspended: true };
};

export const tempReactivateUser = async (userId, reason, loggedInUserSession) => {
  const condition = { user_id: userId, status: UserConstants.USER_STATUS.TERMINATED };
  const userDetails = await AbstractModels.mongoFindOne(Users, condition);

  if (!userDetails) {
    throw ErrorUtils.TerminatedUserNotFoundError();
  }

  const vmnCondition = { user_id: userId, is_used: true };
  const associatedVmn = await AbstractModels.mongoFindOne(VirtualNumberList, vmnCondition);
  if (!associatedVmn) {
    throw ErrorUtils.VmnNotAvailableError();
  }

  // Keep user in expired state for 2 days. After which user should move to terminated state.
  // User will move from Expired to Terminated state after 14 days.
  // So modify the expired_at date to 12 days in past.
  const adjustExpiredAtInDays = 12;
  const expiredAt = new Date();
  expiredAt.setDate(expiredAt.getDate() - adjustExpiredAtInDays);

  const updateData = {
    $set: {
      status: UserConstants.USER_STATUS.EXPIRED,
      preserve_termination: true,
      expired_at: expiredAt,
    },
  };
  await AbstractModels.mongoUpdateOne(Users, condition, updateData);

  UserActivityService.addToUserActivity(
    userId,
    loggedInUserSession?.userId,
    UserActivityConstants.USER_ACTIVITY_ACTION.tempReactivated,
    { ...loggedInUserSession, reason },
  );

  return { isTempReactivated: true };
};

export const whitelistUser = async (userId, reason, loggedInUserSession) => {
  const condition = { user_id: userId, status: UserConstants.USER_STATUS.TERMINATED };
  const userDetails = await AbstractModels.mongoFindOne(Users, condition);

  if (!userDetails) {
    throw ErrorUtils.TerminatedUserNotFoundError();
  }

  const vmnCondition = { user_id: userId, is_used: true };
  const associatedVmn = await AbstractModels.mongoFindOne(VirtualNumberList, vmnCondition);
  if (associatedVmn) {
    throw ErrorUtils.UserVmnIsAlreadyMappedError();
  }

  const updateData = {
    $set: {
      status: UserConstants.USER_STATUS.DELETED,
      deleted_at: new Date(),
      is_deleted: true,
    },
  };
  await AbstractModels.mongoUpdateOne(Users, condition, updateData);

  UserActivityService.addToUserActivity(
    userId,
    loggedInUserSession?.userId,
    UserActivityConstants.USER_ACTIVITY_ACTION.deleted,
    { ...loggedInUserSession, reason },
  );

  return { isWhitelisted: true };
};
