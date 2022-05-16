const healthCheck = async (req, res, next) => {
  res.data = {};
  log("info", "health check");
  next();
};

export default healthCheck;
