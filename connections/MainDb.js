/* eslint-disable import/no-import-module-exports */

import mongoose from "mongoose";
import config from "../config/index";

mongoose.set("debug", true);

let mainDb;

const RECONNECT_TIME = 5000;
logToJSON("info", config);
const CONN_URL = config.mainDbconfig.connString;
logToJSON("info", "CONN_URL to connect to Migration database", CONN_URL);

function connect() {
  mainDb = mongoose.createConnection(CONN_URL, {});
}

connect();

//  Mongoose Connection Events
mainDb.on("error", (err) => {
  logToJSON("error", "Main MongoDB connection error: ", err.message);
});

mainDb.once("open", () => {
  logToJSON(
    "info",
    "Connection opened to Main MongoDB through mongoose successfully!!",
  );
});

mainDb.on("connected", () => {
  logToJSON("info", "Connected to Main MongoDB successfully!!");
});

mainDb.on("connecting", () => {
  logToJSON("info", "Connecting to Main MongoDB...");
});

mainDb.on("reconnected", () => {
  logToJSON("info", "Main MongoDB reconnected!");
});

mainDb.on("disconnected", () => {
  logToJSON(
    "error",
    `Main MongoDB disconnected! Reconnecting in ${RECONNECT_TIME / 1000}s...`,
  );
  // https://github.com/automattic/mongoose/issues/5169#issuecomment-314983113
  setTimeout(() => { mainDb.openUri(CONN_URL).catch(() => {}); }, RECONNECT_TIME);
});

module.exports = {
  mainDb,
};
