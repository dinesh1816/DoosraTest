/* eslint-disable import/no-import-module-exports */

import mongoose from "mongoose";
import config from "../config/index";

// mongoose.set("debug", true);

let mainDb;

const RECONNECT_TIME = 5000;
const CONN_URL = config.mainDbconfig.connString;
log("info", `CONN_URL to connect to Migration database ${CONN_URL}`);

function connect() {
  mainDb = mongoose.createConnection(CONN_URL, {});
}

connect();

//  Mongoose Connection Events
mainDb.on("error", (error) => {
  log("error", { error });
});

mainDb.once("open", () => {
  log("info", { dBConnectionStatus: "open" });
});

mainDb.on("connected", () => {
  log("info", { dBConnectionStatus: "connected" });
});

mainDb.on("connecting", () => {
  log("info", { dBConnectionStatus: "connecting" });
});

mainDb.on("reconnected", () => {
  log("info", { dBConnectionStatus: "reconnected" });
});

mainDb.on("disconnected", () => {
  log("error", { dBConnectionStatus: `disconnected Reconnecting in ${RECONNECT_TIME / 1000}s...` });
  // https://github.com/automattic/mongoose/issues/5169#issuecomment-314983113
  setTimeout(() => { mainDb.openUri(CONN_URL).catch(() => {}); }, RECONNECT_TIME);
});

module.exports = {
  mainDb,
};
