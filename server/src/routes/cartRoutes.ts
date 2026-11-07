import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { addToCartController, getCartController, removeFromCartController } from "../controllers/cartController.js";

const router = Router();

router.get("/", authenticate, getCartController);
router.post("/:productId", authenticate, addToCartController);
router.delete("/:productId", authenticate, removeFromCartController);

export default router;
