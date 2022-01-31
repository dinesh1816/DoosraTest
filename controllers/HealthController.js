const healthCheck = async (req, res, next) => {
  res.data = {};
  console.log("I am in heakth");
  next();
};

export default healthCheck;
