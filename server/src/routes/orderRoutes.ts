import { Router } from "express";
import { checkoutController } from "../controllers/orderController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.post("/checkout", authenticate, checkoutController);

export default router;