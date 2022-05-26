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

export function InvalidSessionToken() {
  return new ErrorUtils(
    InvalidSessionToken,
    ErrorType.INVALID_SESSION_TOKEN,
    RESPONSE_STATUS_400_BAD_REQUEST,
  );
}

export function InvalidAuthorization() {
  return new ErrorUtils(
    InvalidAuthorization,
    ErrorType.INVALID_AUTHORIZATION,
    RESPONSE_STATUS_401_UNAUTHORIZED,
  );
}

export function BlockListedUser() {
  return new ErrorUtils(
    BlockListedUser,
    ErrorType.BLOCK_LISTED_USER,
    RESPONSE_STATUS_403_FORBIDDEN,
  );
}

export function UserNotFoundError() {
  return new ErrorUtils(
    UserNotFoundError,
    ErrorType.USER_DOES_NOT_EXIST,
    RESPONSE_STATUS_404_NOT_FOUND,
  );
}

export function InvalidPasswordError() {
  return new ErrorUtils(
    InvalidPasswordError,
    ErrorType.INVALID_PASSWORD,
    RESPONSE_STATUS_401_UNAUTHORIZED,
  );
}

export function InvalidSchemaError() {
  return new ErrorUtils(
    InvalidSchemaError,
    ErrorType.INVALID_SCHEMA.code,
    RESPONSE_STATUS_500_INTERNAL_SERVER_ERROR,
  );
}

export function InternalServerError() {
  return new ErrorUtils(
    InternalServerError,
    ErrorType.INTERNAL_SERVER_ERR,
    RESPONSE_STATUS_500_INTERNAL_SERVER_ERROR,
  );
}

export function DataNotFound() {
  return new ErrorUtils(
    DataNotFound,
    ErrorType.DATA_NOT_FOUND,
    RESPONSE_STATUS_404_NOT_FOUND,
  );
}

export function MongoError() {
  return new ErrorUtils(
    MongoError,
    ErrorType.MONGO_ERROR,
    RESPONSE_STATUS_500_INTERNAL_SERVER_ERROR,
  );
}

export function DataAlreadyExists() {
  return new ErrorUtils(
    DataAlreadyExists,
    ErrorType.DATA_ALREADY_EXISTS,
    RESPONSE_STATUS_409_CONFLICT,
  );
}

export function IncorrectOTP() {
  return new ErrorUtils(
    IncorrectOTP,
    ErrorType.INCORRECT_OTP,
    RESPONSE_STATUS_401_UNAUTHORIZED,
  );
}

export function InvalidUserError() {
  return new ErrorUtils(
    InvalidUserError,
    ErrorType.INVALID_USER,
    RESPONSE_STATUS_401_UNAUTHORIZED,
  );
}

export function ExpiredUser() {
  return new ErrorUtils(
    ExpiredUser,
    ErrorType.EXPIRED_USER,
    RESPONSE_STATUS_403_FORBIDDEN,
  );
}

export function NotRegisteredUser() {
  return new ErrorUtils(
    NotRegisteredUser,
    ErrorType.NOT_REGISTERED_USER,
    RESPONSE_STATUS_404_NOT_FOUND,
  );
}

export function redisConnectionError() {
  return new ErrorUtils(
    redisConnectionError,
    ErrorType.REDIS_CONNECTION_ERROR,
    RESPONSE_STATUS_500_INTERNAL_SERVER_ERROR,
  );
}
