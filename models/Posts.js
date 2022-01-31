import { Schema } from "mongoose";

import * as mongoConnect from "../connections/mongoConnect";

const { mainDb } = mongoConnect;

const PostsSchema = new Schema({
  post: {
    type: String,
  },
  postId: {
    type: String,
  },
  tag: {
    type: String,
  },
  createdBy: {
    type: String,
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

const Posts = mainDb.model("Posts", PostsSchema, "Posts");
export default Posts;
