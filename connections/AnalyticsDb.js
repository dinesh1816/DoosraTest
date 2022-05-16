/* eslint-disable import/no-import-module-exports */

import mongoose from "mongoose";
import config from "../config/index";

mongoose.set("debug", true);

let analyticsDb;

const RECONNECT_TIME = 5000;
const CONN_URL = config.analyticsDbConfig.connString;
log("info", `CONN_URL to connect to Migration database ${CONN_URL}`);

function connect() {
  analyticsDb = mongoose.createConnection(CONN_URL, {});
}

connect();

//  Mongoose Connection Events
analyticsDb.on("error", (error) => {
  log("error", { error });
});

analyticsDb.once("open", () => {
  log("info", { dBConnectionStatus: "open" });
});

analyticsDb.on("connected", () => {
  log("info", { dBConnectionStatus: "connected" });
});

analyticsDb.on("connecting", () => {
  log("info", { dBConnectionStatus: "connecting" });
});

analyticsDb.on("reconnected", () => {
  log("info", { dBConnectionStatus: "reconnected" });
});

analyticsDb.on("disconnected", () => {
  log("error", { dBConnectionStatus: `disconnected Reconnecting in ${RECONNECT_TIME / 1000}s...` });
  // https://github.com/automattic/mongoose/issues/5169#issuecomment-314983113
  setTimeout(() => { analyticsDb.openUri(CONN_URL).catch(() => { }); }, RECONNECT_TIME);
});

module.exports = {
  analyticsDb,
};
