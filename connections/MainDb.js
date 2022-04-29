/* eslint-disable import/no-import-module-exports */

import mongoose from "mongoose";
import config from "../config/index";

mongoose.set("debug", true);

let mainDb;

const RECONNECT_TIME = 5000;
console.log("vik1...", config);
const CONN_URL = config.mainDbconfig.connString;
console.log("CONN_URL to connect to Migration database", CONN_URL);

function connect() {
  mainDb = mongoose.createConnection(CONN_URL, {});
}

connect();

//  Mongoose Connection Events
mainDb.on("error", (err) => {
  console.error("Main MongoDB connection error: ", err.message);
});

mainDb.once("open", () => {
  console.log(
    "Connection opened to Main MongoDB through mongoose successfully!!",
  );
});

mainDb.on("connected", () => {
  console.log("Connected to Main MongoDB successfully!!");
});

mainDb.on("connecting", () => {
  console.log("Connecting to Main MongoDB...");
});

mainDb.on("reconnected", () => {
  console.log("Main MongoDB reconnected!");
});

mainDb.on("disconnected", () => {
  console.error(
    `Main MongoDB disconnected! Reconnecting in ${RECONNECT_TIME / 1000}s...`,
  );
  // https://github.com/automattic/mongoose/issues/5169#issuecomment-314983113
  setTimeout(() => { mainDb.openUri(CONN_URL).catch(() => {}); }, RECONNECT_TIME);
});

module.exports = {
  mainDb,
};
