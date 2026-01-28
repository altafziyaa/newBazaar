import express from "express";
import ProductController from "../controller/ProductController.js";
import sellerAuthMiddleware from "../middleware/sellerAuthMiddleware.js";

const router = express.Router();

// Public routes
router.get("/search", ProductController.searchProduct);
router.get("/seller/:sellerId", ProductController.getProductBySellerId);
router.get("/:productId", ProductController.findProductById);
router.get("/", ProductController.getAllProducts);

// Protected routes (seller only)
router.post("/", sellerAuthMiddleware, ProductController.createProduct);
router.put("/:productId", sellerAuthMiddleware, ProductController.updateProduct);
router.delete("/:productId", sellerAuthMiddleware, ProductController.deleteProduct);

export default router;
