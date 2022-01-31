import * as jsValidator from "json-schema";
import * as ErrorUtils from "../errors/ErrorUtils";
import * as Schema from "../schema/SchemaMerger";

// event type and schema type should be same, its a assumption
export const validate = (req, res, next) => {
  const { query } = req;
  const { body } = req;
  const { routeObj } = req;
  // let schema = routeObj.schema;

  const isValidReqQuery = jsValidator.validate(
    query,
    Schema[`${routeObj.eventType}_QUERY`]
  );
  const isValidReqBody = jsValidator.validate(
    body,
    Schema[`${routeObj.eventType}_BODY`]
  );
  if (!isValidReqQuery.valid) {
    next(ErrorUtils.InvalidSchemaError(JSON.stringify(isValidReqQuery.errors)));
  } else if (!isValidReqBody.valid) {
    next(ErrorUtils.InvalidSchemaError(JSON.stringify(isValidReqBody.errors)));
  } else {
    next();
  }
};

export default validate;
