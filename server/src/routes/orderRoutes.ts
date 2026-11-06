import { Router } from "express";
import { checkoutController, getMyOrdersController, getOrderDetailsController } from "../controllers/orderController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/checkout", authenticate, checkoutController);
router.get("/my-orders", authenticate, getMyOrdersController);
router.get("/:id", authenticate, getOrderDetailsController);

export default router;
