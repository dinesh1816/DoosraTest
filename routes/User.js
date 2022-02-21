import { Router } from "express";
import * as UserController from "../controllers/UserController";

const router = Router();

router.post("/register", UserController.register);
router.get("/user-details", UserController.getUserDetails);
router.put("/user-details", UserController.updateUserDetails);
router.put("/unsuspend", UserController.unsuspendUser);
router.put("/temp-reactivate", UserController.tempReactivateUser);
router.put("/whitelist", UserController.whitelistUser);

export default router;
