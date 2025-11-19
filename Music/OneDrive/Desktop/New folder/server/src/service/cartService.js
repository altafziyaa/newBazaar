// service/CartService.js
import CartItem from "../model/CartItem.js";
import Product from "../model/Product.js";
import Cart from "../model/cart.js";

class CartService {
  
  async calculatePricing(mrpPrice, discountPercentage) {
    if (discountPercentage < 0 || discountPercentage >= 100)
      throw new Error("Discount must be between 0% and 99%");

    const sellingPrice = Math.round(mrpPrice * (1 - discountPercentage / 100));
    return { sellingPrice, discountPercentage };
  }

  async findUSerCart(user) {
    const cart = await Cart.findOne({ user: user._id });
    if (!cart) throw new Error("Cart not found");

    const items = await CartItem.find({ cart: cart._id }).populate("product");

    let totalPrice = 0;
    let totalSellingPrice = 0;

    items.forEach(item => {
      totalPrice += item.mrpPrice * item.quantity;
      totalSellingPrice += item.sellingPrice * item.quantity;
    });

    cart.totalMrpPrice = totalPrice;
    cart.totalSellingPrice = totalSellingPrice;
    cart.totalItem = items.length;
    cart.cartItems = items;

    await cart.save();
    return cart;
  }

  async addItem({ userId, cartId, productId, size, quantity = 1 }) {
    if (!userId || !cartId || !productId || !size)
      throw new Error("userId, cartId, productId and size are required");

    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    const variation = product.variations?.find(v => v.size === size);

    let cartItem = await CartItem.findOne({ cart: cartId, product: productId, size });

    if (cartItem) {
      cartItem.quantity += quantity;
      return await cartItem.save();
    }

    cartItem = new CartItem({
      cart: cartId,
      product: productId,
      size,
      quantity,
      mrpPrice: variation?.mrpPrice || product.mrpPrice,
      sellingPrice: variation?.sellingPrice || product.sellingPrice,
      userId,
    });

    return await cartItem.save();
  }

  async removeItem(cartItemId, userId) {
    const removed = await CartItem.findOneAndDelete({ _id: cartItemId, userId });
    if (!removed) throw new Error("Cart item not found or unauthorized");
    return removed;
  }

  async updateItemQuantity(cartItemId, userId, quantity) {
    if (quantity < 1) throw new Error("Quantity must be at least 1");

    const item = await CartItem.findOne({ _id: cartItemId, userId });
    if (!item) throw new Error("Cart item not found or unauthorized");

    item.quantity = quantity;
    return await item.save();
  }

}

// ❗ FINAL FIX
export default new CartService();
