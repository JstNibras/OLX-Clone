import { Router } from "express";
import { addToCartController, getCartController } from "../controllers/cartController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", authenticate, getCartController);
router.post("/:productId", authenticate, addToCartController);

export default router;