import { Router } from "express";
import { addToCartController } from "../controllers/cartController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/:productId", authenticate, addToCartController);

export default router;