import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { getAllUsers, activateUser, deactivateUser } from "../controllers/admin.controller";

const router = Router();
router.use(authenticate, authorize(["ADMIN"]));

router.get("/users", getAllUsers);
router.patch("/user/:userId/activate", activateUser);
router.patch("/user/:userId/deactivate", deactivateUser);

export default router;