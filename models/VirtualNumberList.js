import { Schema } from "mongoose";
import * as mongoConnect from "../connections/MongoConnect";

const { mainDb } = mongoConnect;

const VirtualNumberListSchema = new Schema({
  v_mobile_no: {
    type: String,
    required: true,
  },
  is_used: {
    type: Boolean,
    dafault: false,
  },

  is_reserved: {
    type: Boolean,
  },

  is_premium: {
    type: Boolean,
    dafault: false,
  },
  is_vip: {
    type: Boolean,
    dafault: false,
  },
  blocked_at: {
    type: Date,
  },
  reserved_at: {
    type: Date,
  },
  user_id: {
    type: String,
  },
  client_id: {
    type: String,
  },
  price: {
    type: Number,
  },
  premium_price: {
    type: Number,
    default: 0,
  },
  similar_price: {
    type: Number,
    default: 0,
  },
  vip_price: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  organisation: {
    type: Object,
  },
  is_reserved_for_org: {
    type: Boolean,
    default: false,
  },
  reserved_for_org_at: {
    type: Date,
  },
});

const VirtualNumberList = mainDb.model(
  "VirtualNumberList",
  VirtualNumberListSchema,
  "VirtualNumberList",
);
export default VirtualNumberList;
