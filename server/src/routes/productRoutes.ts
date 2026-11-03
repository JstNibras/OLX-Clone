import { Router } from "express";
import { 
    getProducts, 
    getProductDetails, 
    createProductController, 
    getMyProductsController,
    updateProductController, 
    deleteProductController,
} from "../controllers/productController.js";

import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", getProducts);
router.get("/my-listings", authenticate, getMyProductsController);
router.get("/:id", getProductDetails)

router.post("/", authenticate, createProductController);
router.put("/:id", authenticate, updateProductController);
router.delete("/:id", authenticate, deleteProductController);

export default router;