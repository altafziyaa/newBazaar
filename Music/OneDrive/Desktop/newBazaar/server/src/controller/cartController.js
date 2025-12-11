// controller/CartController.js
import cartService from "../service/cartService.js";

class CartController {
  _user(req) {
    if (!req.user?._id) throw new Error("Unauthorized");
    return req.user._id;
  }

  async findUserCartHandle(req, res) {
    try {
      const userId = this._user(req);
      const cart = await cartService.getUserCart(userId);
      res.status(200).json({ message: "Cart fetched", data: cart });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async addItemToCart(req, res) {
    try {
      const userId = this._user(req);
      const { productId, size } = req.body;

      if (!productId) throw new Error("Product ID is required");

      const item = await cartService.addItem({ userId, productId, size });

      res.status(201).json({ message: "Item added", data: item });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async removeItem(req, res) {
    try {
      const userId = this._user(req);
      const { cartItemId } = req.params;

      await cartService.removeItem(cartItemId, userId);

      res.status(200).json({ message: "Item removed" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateQuantity(req, res) {
    try {
      const userId = this._user(req);
      const { cartItemId } = req.params;
      const { quantity } = req.body;

      const updated = await cartService.updateItemQuantity(
        cartItemId,
        userId,
        quantity
      );

      res.status(200).json({ message: "Quantity updated", data: updated });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new CartController();
