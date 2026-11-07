import mongoose from "mongoose";
import type { Request, Response } from "express";
import {
    getAvailableProducts,
    getProductById,
    createProduct,
    getMyProducts,
    updateProduct,
    deleteProduct,
} from "../services/productService.js";

export const getProducts = async (req: Request, res: Response) => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(
            50,
            Math.max(1, Number(req.query.limit) || 12)
        );

        const search = typeof req.query.search === "string"
            ? req.query.search.trim() : undefined;

        const category = typeof req.query.category === "string"
            ? req.query.category.trim() : undefined;

        const sort = typeof req.query.sort === "string"
            ? req.query.sort : "newest";

        const result = await getAvailableProducts({
            search,
            category,
            sort,
            page,
            limit,
        });

        return res.status(200).json({
            success: true,
            ...result,
        });
    } catch (error) {
        console.error("Get products error : ", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch products",
        });
    }
};

export const getProductDetails = async (req: Request, res: Response) => {
    try {
        const id = typeof req.params.id === "string" ? req.params.id : req.params.id?.[0];

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
        }

        const product = await getProductById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        console.error("Get product details error: ", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch product details",
        });
    }
};

export const createProductController = async (req: Request, res: Response) => {
    try {
        if (!req.userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const { title, description, price, category, images } = req.body;

        if (
            !title ||
            !description ||
            price === undefined ||
            !category ||
            !Array.isArray(images) ||
            images.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const parsedPrice = Number(price);

        if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
            return res.status(400).json({
                success: false,
                message: "Price must be valid non-negative number",
            });
        }

        const product = await createProduct({
            sellerId: req.userId,
            title,
            description,
            price: parsedPrice,
            category,
            images,
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product,
        });
    } catch (error) {
        console.error("Create product error : ", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create product",
        });
    }
};

export const getMyProductsController = async (req: Request, res: Response) => {
    try {
        if (!req.userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const products = await getMyProducts(req.userId);

        return res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });
    } catch (error) {
        console.error("Get my product error: ", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch your products",
        });
    }
};

export const updateProductController = async (req: Request, res: Response) => {
    try {
        const id = typeof req.params.id === "string" ? req.params.id : req.params.id?.[0];

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Product Id",
            });
        }

        if (!req.userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const { title, description, price, category, images } = req.body;

        if (
            !title?.trim() ||
            !description?.trim() ||
            price === undefined ||
            !category?.trim() ||
            !Array.isArray(images) ||
            images.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const parsedPrice = Number(price);

        if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
            return res.status(400).json({
                success: false,
                message: "Price must be a valid non-negative number",
            });
        }

        const product = await updateProduct(id, req.userId, {
            title: title.trim(),
            description: description.trim(),
            price: parsedPrice,
            category: category.trim(),
            images,
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found, not owned by you, or already sold",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product,
        });
    } catch (error) {
        console.error("Update product error: ", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update product",
        });
    }
};

export const deleteProductController = async (req: Request, res: Response) => {
    try {
        const id = typeof req.params.id === "string" ? req.params.id : req.params.id?.[0];

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
        }

        if (!req.userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const product = await deleteProduct(id, req.userId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found, not owned by you, or already sold",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.error("Delete product error: ", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete product",
        });
    }
};

export const uploadProductImageController = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please select an image file to upload",
            });
        }

        const protocol = req.protocol;
        const host = req.get("host") || "localhost:5000";
        const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

        return res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            imageUrl,
        });
    } catch (error) {
        console.error("Upload product image error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to upload image",
        });
    }
};
