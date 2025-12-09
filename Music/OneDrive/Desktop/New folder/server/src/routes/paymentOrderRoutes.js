import { Router } from "express";
import PaymentOrderController from "../controller/PaymentOrderController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();
const controller = new PaymentOrderController();

router.post('/create', authMiddleware, controller.createPaymentOrder);
router.post('/razorpay-link/:paymentOrderId', authMiddleware, controller.createRazorpayLink);
router.post('/proceed', authMiddleware, controller.paymentSuccessHandler);

// Public callback endpoint (Razorpay redirects here)
router.get('/callback', (req, res) => {
  console.log("🔔 Razorpay Callback:", req.query);
  res.redirect(`${process.env.FRONTEND_URL}/payment-success?paymentOrderId=${req.query.payment_order_id}`);
});

export default router;
