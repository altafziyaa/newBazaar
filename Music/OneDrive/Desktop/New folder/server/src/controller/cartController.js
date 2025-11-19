// controller/CartController.js
import cartService from "../service/cartService.js"; // Instance import

class CartController {
  
  createUserCart = async (req, res) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      const cart = await cartService.getOrCreateUserCart(user._id);

      res.status(200).json({ message: "User cart fetched successfully", cart });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  addItemToCart = async (req, res) => {
    try {
      const userId = req.user?._id;
      const { cartId, productId, size, quantity } = req.body;

      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const item = await cartService.addItem({
        userId,
        cartId,
        productId,
        size,
        quantity,
      });

      res.status(201).json({ message: "Item added successfully", item });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  getUserCart = async (req, res) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      const cart = await cartService.findUSerCart(user);

      res.status(200).json({ message: "Cart fetched successfully", cart });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };

  removeItem = async (req, res) => {
    try {
      const { cartItemId } = req.params;
      const userId = req.user?._id;

      const removed = await cartService.removeItem(cartItemId, userId);

      res.status(200).json({ message: "Item removed successfully", removed });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  updateQuantity = async (req, res) => {
    try {
      const { cartItemId } = req.params;
      const { quantity } = req.body;
      const userId = req.user?._id;

      const updated = await cartService.updateItemQuantity(
        cartItemId,
        userId,
        quantity
      );

      res.status(200).json({ message: "Quantity updated successfully", updated });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
}

// ✔ Final export (Correct way)
export default new CartController();
