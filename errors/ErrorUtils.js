import * as ErrorType from "../constants/ErrorConstants";

const RESPONSE_STATUS_400_BAD_REQUEST = 400;
const RESPONSE_STATUS_401_UNAUTHORIZED = 401;
const RESPONSE_STATUS_403_FORBIDDEN = 403;
const RESPONSE_STATUS_404_NOT_FOUND = 404;
const RESPONSE_STATUS_409_CONFLICT = 409;

const RESPONSE_STATUS_500_INTERNAL_SERVER_ERROR = 500;

function ErrorUtils(functionName, customMessage, httpResponseStatusCode) {
  Error.captureStackTrace(this, functionName || ErrorUtils);
  this.name = this.constructor.name;
  this.message = customMessage?.message;
  this.code = customMessage?.code;
  this.statusCode = httpResponseStatusCode;
}

export function InvalidRequest() {
  return new ErrorUtils(
    InvalidRequest,
    ErrorType.INVALID_REQUEST,
    RESPONSE_STATUS_400_BAD_REQUEST,
  );
}

export function InvalidAPIKey() {
  return new ErrorUtils(
    InvalidAPIKey,
    ErrorType.INVALID_API_KEY,
    RESPONSE_STATUS_400_BAD_REQUEST,
  );
}

export const InvalidSessionToken = () => ErrorUtils(
  ErrorType.INVALID_SESSION_TOKEN,
  RESPONSE_STATUS_400_BAD_REQUEST,
);

export const InvalidAuthorization = () => ErrorUtils(
  ErrorType.INVALID_AUTHORIZATION,
  RESPONSE_STATUS_401_UNAUTHORIZED,
);

export const BlockListedUser = () => ErrorUtils(
  ErrorType.BLOCK_LISTED_USER,
  RESPONSE_STATUS_403_FORBIDDEN,
);

export const UserNotFoundError = () => ErrorUtils(
  ErrorType.USER_DOES_NOT_EXIST,
  RESPONSE_STATUS_404_NOT_FOUND,
);

export const InvalidPasswordError = () => ErrorUtils(
  ErrorType.INVALID_PASSWORD,
  RESPONSE_STATUS_401_UNAUTHORIZED,
);

export const InvalidSchemaError = (err) => {
  const errorObj = {
    code: ErrorType.INVALID_SCHEMA.code,
    message: `${ErrorType.INVALID_SCHEMA.message} ${err}`,
  };
  return ErrorUtils(errorObj);
};

export const InternalServerError = (err) => {
  const errorObj = {
    code: ErrorType.INTERNAL_SERVER_ERR.code,
    message: err,
  };
  return ErrorUtils(errorObj, RESPONSE_STATUS_500_INTERNAL_SERVER_ERROR);
};

export const DataNotFound = () => ErrorUtils(
  ErrorType.DATA_NOT_FOUND,
  RESPONSE_STATUS_404_NOT_FOUND,
);

export const MongoError = () => ErrorUtils(
  ErrorType.MONGO_ERROR,
  RESPONSE_STATUS_500_INTERNAL_SERVER_ERROR,
);

export function DataAlreadyExists() {
  return new ErrorUtils(
    DataAlreadyExists,
    ErrorType.DATA_ALREADY_EXISTS,
    RESPONSE_STATUS_409_CONFLICT,
  );
}

export const NotInSurroundingsError = () => ErrorUtils(ErrorType.NOT_IN_SURROUNDINGS);

export const IncorrectOTP = () => ErrorUtils(
  ErrorType.INCORRECT_OTP,
  RESPONSE_STATUS_401_UNAUTHORIZED,
);

export const InvalidUserError = () => ErrorUtils(ErrorType.INVALID_USER);

export const InvalidLatLon = () => ErrorUtils(ErrorType.INVALID_LAT_LON);

export const InvalidTruckId = () => ErrorUtils(ErrorType.INVALID_TRUCK_ID);

export const ExpiredUser = () => ErrorUtils(
  ErrorType.EXPIRED_USER,
  RESPONSE_STATUS_403_FORBIDDEN,
);

export const NotRegisteredUser = () => ErrorUtils(
  ErrorType.NOT_REGISTERED_USER,
  RESPONSE_STATUS_404_NOT_FOUND,
);

export const redisConnectionError = () => ErrorUtils(
  ErrorType.REDIS_CONNECTION_ERROR,
  RESPONSE_STATUS_500_INTERNAL_SERVER_ERROR,
);
