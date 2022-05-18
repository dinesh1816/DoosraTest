import { Schema } from "mongoose";

const AuditLogsSchema = new Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  userAgent: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  correlationId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
  },
  responseTime: {
    type: Number,
  },
  username: {
    type: String,
  },
  apiKey: {
    type: String,
  },
  clientId: {
    type: String,
  },
  eventType: {
    type: String,
  },
  requestBody: {
    type: Object,
  },
  response: {
    type: Object,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default AuditLogsSchema;
