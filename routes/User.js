import { Router } from "express";
import * as UserController from "../controllers/UserController";

const router = Router();

router.post("/register", UserController.register);
router.get("/user-details", UserController.getUserDetails);
router.put("/user-details", UserController.updateUserDetails);

export default router;
