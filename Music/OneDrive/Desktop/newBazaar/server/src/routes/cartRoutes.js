// routes/cartRoutes.js
import express from "express";
import CartController from "../controller/cartController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, CartController.findUserCartHandle.bind(CartController));
router.put("/add", authMiddleware, CartController.addItemToCart.bind(CartController));
router.delete("/remove/:cartItemId", authMiddleware, CartController.removeItem.bind(CartController));
router.put("/update/:cartItemId", authMiddleware, CartController.updateQuantity.bind(CartController));

export default router;
