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