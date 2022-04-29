import { Schema } from "mongoose";

import { mainDb } from "../connections/MainDb";

const UsersSchema = new Schema({
  password: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    required: false,
    type: String,
  },
  mobileNo: {
    type: String,
  },
  alternateMobileNo: {
    type: String,
  },
  email: {
    type: String,
  },
  clientId: {
    required: true,
    type: String,
  },
  userType: {
    type: Array,
    required: true,
  },
  sessionToken: {
    type: String,
  },
  isBlockedUser: {
    type: Boolean,
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

const Users = mainDb.model("Users", UsersSchema, "Users");
export default Users;
