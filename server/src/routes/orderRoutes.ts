import { Router } from "express";
import { checkoutController, getMyOrdersController } from "../controllers/orderController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.post("/checkout", authenticate, checkoutController);
router.get("/my-orders", authenticate, getMyOrdersController);

export default router;