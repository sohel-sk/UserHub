import { Router } from "express";
import { signup } from "../controllers/auth.controller";
import { route } from "../app";

const router = Router();

router.post("/signup", signup);

export default router;