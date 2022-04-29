/* eslint-disable import/no-import-module-exports */

import mongoose from "mongoose";
import config from "../config/index";

mongoose.set("debug", true);

let analyticsDb;

const RECONNECT_TIME = 5000;
const CONN_URL = config.analyticsDbConfig.connString;
console.log("CONN_URL to connect to Migration database", CONN_URL);

function connect() {
  analyticsDb = mongoose.createConnection(CONN_URL, {});
}

connect();

//  Mongoose Connection Events
analyticsDb.on("error", (err) => {
  console.error("analyticsDb MongoDB connection error: ", err.message);
});

analyticsDb.once("open", () => {
  console.log(
    "Connection opened to analyticsDb MongoDB through mongoose successfully!!",
  );
});

analyticsDb.on("connected", () => {
  console.log("Connected to analyticsDb MongoDB successfully!!");
});

analyticsDb.on("connecting", () => {
  console.log("Connecting to analyticsDb MongoDB...");
});

analyticsDb.on("reconnected", () => {
  console.log("analyticsDb MongoDB reconnected!");
});

analyticsDb.on("disconnected", () => {
  console.error(
    `analyticsDb MongoDB disconnected! Reconnecting in ${RECONNECT_TIME / 1000}s...`,
  );
  // https://github.com/automattic/mongoose/issues/5169#issuecomment-314983113
  setTimeout(() => { analyticsDb.openUri(CONN_URL).catch(() => {}); }, RECONNECT_TIME);
});

module.exports = {
  analyticsDb,
};
