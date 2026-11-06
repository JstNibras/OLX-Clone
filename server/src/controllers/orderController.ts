import mongoose from "mongoose";
import type { Request, Response } from "express";
import { checkout, getMyOrders, getOrderById } from "../services/orderService.js";

export const checkoutController = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

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

export const getMyOrdersController = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const orders = await getMyOrders(req.userId);

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Get my orders error: ", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your orders",
    });
  }
};

export const getOrderDetailsController = async (req: Request, res: Response) => {
  try {
    const id = typeof req.params.id === "string" ? req.params.id : req.params.id?.[0];

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const order = await getOrderById(id, req.userId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get order details error: ", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order details",
    });
  }
};
