import mongoose from "mongoose";
import config from "../config/index";

import * as EnvUtils from "../utils/EnvUtils";

if (EnvUtils.isLocal()) {
  mongoose.set("debug", true);
}

export const mainDb = mongoose.createConnection(config.dbconfig.connString);
// .catch((error) => console.log('Mongo connection error', error));
if (mainDb) {
  console.log("Config ", config.dbconfig.connString);
} else {
  console.log("Unable to connect to mainDb");
}
export const analyticsDb = mongoose.createConnection(
  config.analyticsDbConfig.connString,
);
// .catch((error) => console.log('Mongo connection error', error));
if (analyticsDb) {
  console.log("Config ", config.analyticsDbConfig.connString);
} else {
  console.log("Unable to connect analyticsDb");
}
