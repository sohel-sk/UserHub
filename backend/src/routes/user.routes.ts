import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { getProfile, updateProfile, changePassword } from "../controllers/user.controller";

const router = Router();
router.use(authenticate);

router.get("/profile", getProfile);
router.patch("/profile", updateProfile);
router.patch("/profile/change-password", changePassword);

export default router;