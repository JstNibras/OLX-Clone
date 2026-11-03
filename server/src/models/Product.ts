import mongoose, { Schema, Document } from "mongoose";

export type ProductStatus = "AVAILABLE" | "SOLD";

export interface IProduct extends Document {
    sellerId: mongoose.Types.ObjectId;
    title: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    status: ProductStatus;
}

const productSchema = new Schema<IProduct>(
    {
        sellerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        images: {
            type: [String],
            required: true,
            validate: {
                validator: (images: string[]) => images.length > 0,
                message: "At least one image is required",
            }, 
        },

        status: {
            type: String,
            enum: ["AVAILABLE", "SOLD"],
            default: "AVAILABLE",
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model<IProduct>(
    "Product",
    productSchema
);

export default Product;