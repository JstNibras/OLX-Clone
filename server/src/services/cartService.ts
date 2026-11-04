import Cart from "../models/Cart";
import Product from "../models/Product";

export const addProductToCart = async (userId: string, productId: string) => {
    const product = await Product.findOne({
        _id: productId,
        status: "AVAILABLE",
        isDeleted: false,
    })

    if(!product) {
        return { error: "PRODUCT_NOT_FOUND" as const };
    }

    if (product.sellerId.toString() === userId) {
        return { error: "OWN_PRODUCT" as const }
    }

    const cart = await Cart.findOneAndUpdate(
        { userId },
        {
            $addToSet: {
                productIds: product._id,
            },
        },
        {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
        }
    )

    return { cart, error: null}
}

export const getUserCart = async (userId: string) => {
    const cart = await Cart.findOne({ userId })
        .populate({
            path: "productIds",
            match: {
                status: "AVAILABLE",
                isDeleted: false,
            },
            select: "titile description price category images sellerId status",
            populate: {
                path: "sellerId",
                select: "name",
            },
        }).lean();

    if(!cart) {
        return {
            userId,
            productIds: [],
        }
    }

    return {
        ...cart,
        productIds: cart.productIds.filter(Boolean),
    }
}

export const removeProductFromCart = async (userId: string, productId: string) => {
    return Cart.findOneAndUpdate(
        { userId },
        {
            $pull: {
                productIds: productId,
            },
        },
        {
            new: true,
        }
    )
}