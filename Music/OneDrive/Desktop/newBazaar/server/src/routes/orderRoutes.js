// routes/orderRoutes.js
import { Router } from "express";
import OrderController from "../controller/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import sellerAuthMiddleware from "../middleware/sellerAuthMiddleware.js";

const router = Router();
const orderController = new OrderController();

// Specific routes first to avoid collision with /:orderId
router.post("/create", authMiddleware, orderController.createOrder);

router.get("/my-orders", authMiddleware, orderController.getUserOrders);
router.get("/history", authMiddleware, orderController.getUserHistory);
router.get("/cancelled", authMiddleware, orderController.getCancelledOrders);

// Seller routes (protected by seller middleware)
router.get("/seller/orders", sellerAuthMiddleware, orderController.getSellerOrders);

// Cancel (user can cancel their own order)
router.put("/cancel/:orderId", authMiddleware, orderController.cancelOrder);

// Dynamic param routes last
router.get("/:orderId", authMiddleware, orderController.getOrderById);
router.delete("/:orderId", authMiddleware, orderController.deleteOrder);

// Update status (seller only)
router.put("/status/:orderId", sellerAuthMiddleware, orderController.updateOrderStatus);

export default router;
