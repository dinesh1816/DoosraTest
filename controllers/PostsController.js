import * as PostsService from "../services/PostsService";
import * as Auth from "../middlewares/Auth";

export const getPost = async (req, res, next) => {
  const { postId } = req.query;
  const postObj = await PostsService.getPost(postId);
  res.data = {
    post: postObj,
  };
  next();
};

export const createPost = async (req, res, next) => {
  const { post } = req.body;
  const { tag } = req.body;
  const sessionObj = await Auth.getSessionObj(req);
  const { mobileNo } = sessionObj;
  const postObj = {
    post,
    tag,
    createdBy: mobileNo,
  };
  await PostsService.createPost(postObj);
  res.data = {};
  next();
};
