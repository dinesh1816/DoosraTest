import { HEADER_SESSION_TOKEN } from "../constants/Keys";

export const getSessionMetadata = (session, req) => ({
  sessionId: req.headers[HEADER_SESSION_TOKEN] || "NA",
  ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress || null,
  username: session?.username ?? "NA",
  userId: session?.user_id,
});

export function dummyFunction() { }
