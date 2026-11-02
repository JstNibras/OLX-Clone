import { Router } from "express";
import { register, login } from "../controllers/authController";
import { getCurrentUser } from "../controllers/authController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login)

router.get("/me", authenticate, getCurrentUser);

export default router;