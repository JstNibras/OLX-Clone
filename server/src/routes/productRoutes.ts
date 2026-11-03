import { Router } from "express";
import { getProducts, getProductDetails, createProductController } from "../controllers/productController.js";

import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductDetails)

router.post("/", authenticate, createProductController);

export default router;