// service/cartService.js
import CartItem from "../model/CartItem.js";
import Product from "../model/Product.js";
import Cart from "../model/cart.js";

class CartService {
  async _getOrCreateCart(userId) {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = await Cart.create({ user: userId });
    return cart;
  }

  async getUserCart(userId) {
    const cart = await this._getOrCreateCart(userId);

    const items = await CartItem.find({ cart: cart._id }).populate("product");

    const totals = items.reduce(
      (acc, item) => {
        acc.totalMrp += item.mrpPrice * item.quantity;
        acc.totalSelling += item.sellingPrice * item.quantity;
        return acc;
      },
      { totalMrp: 0, totalSelling: 0 }
    );

    return {
      cartId: cart._id,
      totalMrpPrice: totals.totalMrp,
      totalSellingPrice: totals.totalSelling,
      totalItems: items.length,
      items,
    };
  }

  async addItem({ userId, productId, size }) {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    const cart = await this._getOrCreateCart(userId);

    const variation =
      product.variations?.find((v) => v.size === size) ||
      product.variations?.[0];

    if (!variation) throw new Error("Product variation not found");

    const mrpPrice = variation.mrpPrice || product.mrpPrice;
    const sellingPrice = variation.sellingPrice || product.sellingPrice;

    let cartItem = await CartItem.findOne({
      cart: cart._id,
      product: productId,
      size: variation.size,
    });

    if (cartItem) {
      cartItem.quantity += 1;
      return await cartItem.save();
    }

    cartItem = new CartItem({
      cart: cart._id,
      product: productId,
      size: variation.size,
      quantity: 1,
      mrpPrice,
      sellingPrice,
      userId,
    });

    return await cartItem.save();
  }

  async removeItem(cartItemId, userId) {
    const removed = await CartItem.findOneAndDelete({
      _id: cartItemId,
      userId,
    });

    if (!removed)
      throw new Error("Cart item not found or unauthorized action");
    return removed;
  }

  async updateItemQuantity(cartItemId, userId, quantity) {
    if (!quantity || quantity < 1)
      throw new Error("Quantity must be at least 1");

    const item = await CartItem.findOne({
      _id: cartItemId,
      userId,
    });

    if (!item)
      throw new Error("Cart item not found or unauthorized action");

    item.quantity = quantity;
    return await item.save();
  }
}

export default new CartService();
