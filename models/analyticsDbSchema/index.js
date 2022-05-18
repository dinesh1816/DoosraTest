import * as analyticsDbConnection from "../../connections/AnalyticsDb";
// load schemas
import AuditLogsSchema from "./AuditLogsSchema";

export const conn = analyticsDbConnection.getInstanceOfDbConnection();
export const AuditLogs = conn.model("AuditLogs", AuditLogsSchema, "AuditLogs");
