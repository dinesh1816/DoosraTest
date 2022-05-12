const healthCheck = async (req, res, next) => {
  res.data = {};
  logToJSON("info", "health check");
  next();
};

export default healthCheck;
