const healthCheck = async (req, res, next) => {
  res.data = {};
  logToJSON("info", "I am in heakth");
  next();
};

export default healthCheck;
