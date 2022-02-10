import * as jsValidator from "json-schema";
import * as ErrorUtils from "../errors/ErrorUtils";

// event type and schema type should be same, its a assumption
export const validate = (req, res, next) => {
  const { query, body, routeObj } = req;
  const querySchema = routeObj.schema?.query;
  const bodySchema = routeObj.schema?.body;

  const isValidReqQuery = jsValidator.validate(query, querySchema);
  const isValidReqBody = jsValidator.validate(body, bodySchema);
  if (!isValidReqQuery.valid) {
    next(ErrorUtils.InvalidSchemaError(JSON.stringify(isValidReqQuery.errors)));
  } else if (!isValidReqBody.valid) {
    next(ErrorUtils.InvalidSchemaError(JSON.stringify(isValidReqBody.errors)));
  } else {
    next();
  }
};

export default validate;
