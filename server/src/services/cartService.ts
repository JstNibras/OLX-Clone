import Cart from "../models/Cart";
import Product from "../models/Product";

export const addProductToCart = async (
  userId: string,
  productId: string
) => {
  const product = await Product.findOne({
    _id: productId,
    status: "AVAILABLE",
    isDeleted: false,
  });

  if (!product) {
    return { error: "PRODUCT_NOT_FOUND" as const };
  }

  if (product.sellerId.toString() === userId) {
    return { error: "OWN_PRODUCT" as const };
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({
      userId,
      productIds: [product._id],
    });

    return { cart, error: null };
  }

  const alreadyInCart = cart.productIds.some(
    (id) => id.toString() === productId
  );

  if (alreadyInCart) {
    return { error: "ALREADY_IN_CART" as const };
  }

  cart.productIds.push(product._id);
  await cart.save();

  return { cart, error: null };
};

export const getUserCart = async (userId: string) => {
  const cart = await Cart.findOne({ userId })
    .populate({
      path: "productIds",
      match: {
        status: "AVAILABLE",
        isDeleted: false,
      },
      select: "title description price category images sellerId status",
      populate: {
        path: "sellerId",
        select: "name",
      },
    })
    .lean();

  if (!cart) {
    return {
      userId,
      productIds: [],
    };
  }

  return {
    ...cart,
    productIds: cart.productIds.filter(Boolean),
  };
};

export const removeProductFromCart = async (
  userId: string,
  productId: string
) => {
  return Cart.findOneAndUpdate(
    { userId },
    {
      $pull: {
        productIds: productId,
      },
    },
    { new: true }
  );
};