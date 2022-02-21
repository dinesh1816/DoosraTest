import { Schema } from "mongoose";
import * as mongoConnect from "../connections/MongoConnect";

const { mainDb } = mongoConnect;

const UserActivitySchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    reference_id: {
      type: String, // Possible value will be Object id of calls/messages...
    },
    action: {
      type: String, // "CALL_INCOMING"/"CALL_OUTGOING"/"MESSAGE"/REFERRAL/REFERRAL_REDEEM
    },
    metadata: {
      type: Object,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

const UserActivity = mainDb.model(
  "UserActivity",
  UserActivitySchema,
  "UserActivity",
);
export default UserActivity;
