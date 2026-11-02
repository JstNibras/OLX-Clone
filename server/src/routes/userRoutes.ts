import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.get("/protected", authenticate, (req, res) => {
    res.status(200).json({
        success: true,
        message: "You accessed a protected route",
        userId: req.userId,
    })
})

export default router;