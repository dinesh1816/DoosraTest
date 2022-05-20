/* eslint-disable import/no-import-module-exports */

import mongoose from "mongoose";
import config from "../config/index";

let conn;

export function init() {
  const RECONNECT_TIME = 5000;
  const CONN_URL = config.analyticsDbConfig.connString;

  if (conn) {
    return conn;
  }

  log("info", `CONN_URL to connect to analytics database ${CONN_URL}`);
  conn = mongoose.createConnection(CONN_URL);

  //  Mongoose Connection Events
  conn.on("error", (error) => {
    log("error", { error });
  });

  conn.once("open", () => {
    log("info", { dBConnectionStatus: "open" });
  });

  conn.on("connected", () => {
    log("info", { dBConnectionStatus: "connected" });
  });

  conn.on("connecting", () => {
    log("info", { dBConnectionStatus: "connecting" });
  });

  conn.on("reconnected", () => {
    log("info", { dBConnectionStatus: "reconnected" });
  });

  conn.on("disconnected", () => {
    log("error", { dBConnectionStatus: `disconnected Reconnecting in ${RECONNECT_TIME / 1000}s...` });
    // https://github.com/automattic/mongoose/issues/5169#issuecomment-314983113
    setTimeout(() => { conn.openUri(CONN_URL).catch(() => { }); }, RECONNECT_TIME);
  });

  return conn;
}

export function getDbInstance() {
  return conn;
}
