import type { Request, Response } from "express";
import { checkout } from "../services/orderService.js";

export const checkoutController = async (req: Request, res: Response) => {
  try {
    const order = await checkout(req.userId);

    return res.status(201).json({
      success: true,
      message: "Checkout completed successfully",
      data: order,
    });
  } catch (error) {
    if (error instanceof Error) {
      switch (error.message) {
        case "CART_EMPTY":
          return res.status(400).json({
            success: false,
            message: "Your cart is empty",
          });

        case "PRODUCT_UNAVAILABLE":
          return res.status(409).json({
            success: false,
            message:
              "One or more products are no longer available. Please refresh your cart.",
          });

        case "OWN_PRODUCT_IN_CART":
          return res.status(400).json({
            success: false,
            message: "Your cart contains your own product",
          });
      }
    }

    console.error("Checkout error:", error);

    return res.status(500).json({
      success: false,
      message: "Checkout failed",
    });
  }
};