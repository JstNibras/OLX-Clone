import mongoose from "mongoose";
import Cart from "../models/Cart";
import Product from "../models/Product";
import Order from "../models/Order";

export const checkout = async (buyerId: string) => {
    const session = await mongoose.startSession();

    try {
        let createdOrder = null;

        await session.withTransaction(async () => {
            const cart = await Cart.findOne({ userId: buyerId }).session(session)

            if(!cart || cart.productIds.length === 0) {
                throw new Error("CART_EMPTY")
            }

            const products = await Product.find({
                _id: { $in: cart.productIds },
                status: "AVAILABLE",
                isDeleted: false,
            }).session(session);

            if (products.length !== cart.productIds.length) {
                throw new Error("PRODUCT_UNAVAILABLE")
            }

            const hasOwnProduct = products.some(
                (product) => product.sellerId.toString() === buyerId
            )

            if (hasOwnProduct) {
                throw new Error("OWN_PRODUCT_IN_CART");
            }

            for (const product of products) {
                const result = await Product.updateOne(
                    {
                        _id: product._id,
                        status: "AVAILABLE",
                        isDeleted: false,
                    },
                    {
                        $set: { status: "SOLD" },
                    },
                    { session }
                );

                if (result.modifiedCount !== 1) {
                    throw new Error("PRODUCT_UNAVAILABLE");
                }
            }

            const items = products.map((product) => ({
                productId: product._id,
                sellerId: product.sellerId,
                title: product.title,
                image: product.images[0],
                price: product.price,
            }));

            const totalAmount = items.reduce(
                (total, item) => total + item.price,
                0
            );

            const orders = await Order.create(
                [
                    {
                        buyerId,
                        items,
                        totalAmount,
                        status: "PLACED",
                    },
                ],
                { session }
            );

            createdOrder = orders[0];

            await Cart.updateOne(
                { userId: buyerId },
                { $set: { productIds: [] } },
                { session }
            );
        })
        
        return createdOrder;
    } finally {
        await session.endSession();
    }
}

export const getMyOrders = async (buyerId: string) => {
    return Order.find({ buyerId }).sort({ createdAt: -1 }).lean()
}

export const getOrderById = async (orderId: string, buyerId: string) => {
    return Order.findOne({
        _id: orderId,
        buyerId,
    }).lean()
}