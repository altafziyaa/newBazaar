// routes/cartRoutes.js
import express from "express";
import CartController from "../controller/cartController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, CartController.createUserCart);

router.post("/add", authMiddleware, CartController.addItemToCart);

router.get("/my-cart", authMiddleware, CartController.getUserCart);

router.delete("/remove/:cartItemId", authMiddleware, CartController.removeItem);

router.put("/update/:cartItemId", authMiddleware, CartController.updateQuantity);

export default router;
