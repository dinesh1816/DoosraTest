import * as ErrorType from "../constants/ErrorConstants";

const getErrorObj = (errorObj) => {
  const err = new Error(errorObj.message);
  err.code = errorObj.code;
  return err;
};

export const InvalidRequest = () => getErrorObj(ErrorType.INVALID_REQUEST);

export const InvalidAPIKey = () => getErrorObj(ErrorType.INVALID_API_KEY);

export const InvalidSessionToken = () => getErrorObj(ErrorType.INVALID_SESSION_TOKEN);

export const InvalidAuthorization = () => getErrorObj(ErrorType.INVALID_AUTHORIZATION);

export const BlockListedUser = () => getErrorObj(ErrorType.BLOCK_LISTED_USER);

export const UserNotFoundError = () => getErrorObj(ErrorType.USER_DOES_NOT_EXIST);

export const InvalidPasswordError = () => getErrorObj(ErrorType.INVALID_PASSWORD);

export const InvalidSchemaError = (err) => {
  const errorObj = {
    code: ErrorType.INVALID_SCHEMA.code,
    message: `${ErrorType.INVALID_SCHEMA.message} ${err}`,
  };
  return getErrorObj(errorObj);
};

export const InternalServerError = (err) => {
  const errorObj = {
    code: ErrorType.INVALID_SCHEMA.code,
    message: err,
  };
  return getErrorObj(errorObj);
};

export const DataNotFound = () => getErrorObj(ErrorType.DATA_NOT_FOUND);

export const MongoError = () => getErrorObj(ErrorType.MONGO_ERROR);

export const DataAlreadyExists = () => getErrorObj(ErrorType.DATA_ALREADY_EXISTS);

export const NotInSurroundingsError = () => getErrorObj(ErrorType.NOT_IN_SURROUNDINGS);

export const IncorrectOTP = () => getErrorObj(ErrorType.INCORRECT_OTP);

export const InvalidUserError = () => getErrorObj(ErrorType.INVALID_USER);

export const InvalidLatLon = () => getErrorObj(ErrorType.INVALID_LAT_LON);

export const InvalidTruckId = () => getErrorObj(ErrorType.INVALID_TRUCK_ID);

export const ExpiredUser = () => getErrorObj(ErrorType.EXPIRED_USER);

export const NotRegisteredUser = () => getErrorObj(ErrorType.NOT_REGISTERED_USER);

export const redisConnectionError = () => getErrorObj(ErrorType.REDIS_CONNECTION_ERROR);

export const SuspendedUserNotFoundError = () => getErrorObj(
  ErrorType.SUSPENDED_USER_NOT_FOUND_ERROR,
);

export const TerminatedUserNotFoundError = () => getErrorObj(
  ErrorType.TERMINATED_USER_NOT_FOUND_ERROR,
);

export const VmnNotAvailableError = () => getErrorObj(
  ErrorType.VMN_NOT_AVAILABLE_ERROR,
);

export const UserVmnIsAlreadyMappedError = () => getErrorObj(
  ErrorType.USER_VMN_IS_ALREADY_MAPPED_ERROR,
);
