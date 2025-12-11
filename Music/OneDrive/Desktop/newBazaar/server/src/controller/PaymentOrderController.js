import PaymentOrderService from "../service/paymentOrderService.js";
import AppError from "../utils/AppError.js";
import SellerService from "../service/SellerService.js";
import SellerReportService from "../service/SellerReportService.js";
import TransactionService from "../service/TransactionService.js";
import Cart from "../model/cart.js";

class PaymentOrderController {
  constructor() {
    this.service = new PaymentOrderService();
  }

  createPaymentOrder = async (req, res, next) => {
    try {
      const order = req.body.order;
      const user = req.user;
      const paymentOrder = await this.service.createPaymentOrder({ user, order });
      return res.status(201).json({ success: true, paymentOrder });
    } catch (error) {
      next(error);
    }
  };

  createRazorpayLink = async (req, res, next) => {
    try {
      const user = req.user;
      const { paymentOrderId } = req.params;

      if (!paymentOrderId) throw new AppError("Payment Order ID missing", 400);

      const paymentOrder = await this.service.findPaymentOrderById(paymentOrderId);
      
      const paymentLink = await this.service.createRazorpayPaymentLink(
        user,
        paymentOrder.amount,
        paymentOrderId
      );

      return res.status(201).json({
        success: true,
        message: "Payment link generated",
        paymentLink,
      });
    } catch (error) {
      console.error("🔥 Razorpay Link Error:", error);
      next(error);
    }
  };

paymentSuccessHandler = async (req, res, next) => {
  try {
    const { paymentOrderId, paymentId } = req.body;
    
    if (!paymentOrderId || !paymentId) {
      return res.status(400).json({ 
        status: "fail", 
        message: "PaymentOrderId and PaymentId are required" 
      });
    }

    // Step 1: Process payment
    const success = await this.service.proceedPaymentOrder(paymentOrderId, paymentId);
    if (!success) {
      return res.status(400).json({ status: "fail", message: "Payment failed" });
    }

    // Step 2: Get updated payment order and order
    const paymentOrder = await this.service.findPaymentOrderById(paymentOrderId);
    const order = paymentOrder.order;
    
    // Step 3: Seller reporting (Safe with try-catch)
    let seller = null;
    try {
      seller = await SellerService.getSellerById(order.seller);
    } catch (err) {
      console.warn("⚠️ Seller not found, skipping seller report:", order.seller);
      seller = null;
    }

    if (seller) {
      let report = await SellerReportService.getSellerReport(seller._id);
      if (!report) {
        report = await SellerReportService.createSellerReport(seller._id);
      }
      
      report.totalorders += 1;
      report.totalrevenue += order.totalSellingPrice;
      report.totalSales += order.orderItems.length;
      await SellerReportService.updateSellerReport(report._id, report);
    }

    // Step 4: Create transaction
    await TransactionService.createTransaction(order._id);
    
    // Step 5: Clear cart
    await Cart.findOneAndUpdate(
      { user: req.user._id }, 
      { cartItems: [] }, 
      { new: true }
    );

    return res.status(200).json({ 
      status: "success", 
      message: "Payment successful",
      orderId: order._id,
      redirectUrl: `${process.env.FRONTEND_URL}/order-success/${order._id}`
    });
  } catch (error) {
    console.error("🔥 Payment Proceed Error:", error);
    next(error);
  }
};


}

export default PaymentOrderController;
