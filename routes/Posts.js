import { Router } from "express";
import * as PostsController from "../controllers/PostsController";

const router = Router();

router.get("/post", PostsController.getPosts);
router.post("/create-post", PostsController.createPosts);

export default router;
