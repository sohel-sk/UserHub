import { Router } from "express";
import { signup, login, getme } from "../controllers/auth.controller";
import { route } from "../app";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authenticate, getme);

export default router;