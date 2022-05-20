import * as ErrorUtils from "../errors/ErrorUtils";
import * as AbstractModels from "../models/AbstractModels";
import * as EncryptionService from "./EncryptionService";

import { Users, Clients } from "../models/mainDbSchema/index";

async function getClientIdFromApiKey(apiKey) {
  const findCondition = {
    apiKey,
  };
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
