import * as AbstractModels from "../models/AbstractModels";
import Posts from "../models/Posts";

export const getPost = async (postId) => {
  const findCondition = {
    postId,
  };
  const projectCondition = {
    post: 1,
    createdBy: 1,
    id: 0,
  };
  const postObj = await AbstractModels.mongoFind(
    Posts,
    findCondition,
    projectCondition
  );
  return postObj;
};

export const createPost = async (postObj) => {
  await AbstractModels.mongoInsertOne(Posts, postObj);
};
