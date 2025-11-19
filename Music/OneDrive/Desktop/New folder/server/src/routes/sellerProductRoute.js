import express from "express";
import ProductController from "../controller/ProductController.js";
import sellerAuthMiddleware from "../middleware/sellerAuthMiddleware.js";   
const router = express.Router();

router.post("/", sellerAuthMiddleware, ProductController.createProduct);

router.delete("/:productId", sellerAuthMiddleware, ProductController.deleteProduct);

router.put("/:productId", sellerAuthMiddleware, ProductController.updateProduct);

router.get("/seller/:sellerId", ProductController.getProductBySellerId);

router.get("/", ProductController.getAllProducts);

export default router;
