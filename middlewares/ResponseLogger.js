import * as AbstractModels from "../models/AbstractModels";
import AuditLogs from "../models/AuditLogs";

const auditLogResponse = (error, req, res) => {
  const selectCondition = {
    requestId: req.routeObj.requestId,
  };
  const updateCondition = {
    status: true,
    responseTime: new Date().getTime() - req.routeObj.startTime,
  };
  if (req.session) {
    updateCondition.mobileNumber = req.session.mobileNumber;
    updateCondition.clientId = req.session.clientId;
    updateCondition.apiKey = req.session.apiKey;
  }
  if (req.routeObj) {
    updateCondition.routeCategory = req.routeObj.routeCategory;
  }

  if (error) {
    updateCondition.response = {
      code: error.code || 1000,
      reason: error.message,
    };
    updateCondition.status = false;
  } else {
    updateCondition.response = res.data;
  }
  log("info", updateCondition);
  AbstractModels.mongoFindOneAndUpdate(
    AuditLogs,
    selectCondition,
    updateCondition,
  );
};

export const resSuccessLog = (req, res) => {
  let routeCategory;
  if (req.routeObj && req.routeObj.routeCategory) {
    routeCategory = req.routeObj.routeCategory;
  }
  if (routeCategory !== "healthCheckRoutes") {
    auditLogResponse(null, req, res);
  }
  res.setHeader("requestId", req.routeObj.requestId);
  res.status(res.statusCode || 200).send({ status: true, response: res.data });
};

export const resErrorLog = (error, req, res, next) => {
  auditLogResponse(error, req, res);
  if (res.headersSent) {
    return next(error);
  }
  res.setHeader("requestId", req.routeObj.requestId);
  log("error", error.stack);
  res.status(error.statusCode);
  return res.send({
    status: false,
    response: {
      code: error.code || 1000,
      reason: error.message,
    },
  });
};
