// controller/orderController.js
import OrderService from "../service/orderService.js";
import AppError from "../utils/AppError.js";
import cartService from "../service/cartService.js";
import PaymentOrderService from "../service/paymentOrderService.js"; // class -> will instantiate inside methods
import Product from "../model/Product.js"; // path as per your project

class OrderController {
  constructor() {
    this.service = new OrderService();
    this.paymentService = new PaymentOrderService();
  }

createOrder = async (req, res, next) => {
    try {
      const user = req.user;
      if (!user || !user._id) throw new AppError("Unauthorized", 401);

      const { seller, shippingAddress, items } = req.body;

      if (!seller) throw new AppError("Seller is required", 400);
      if (!shippingAddress) throw new AppError("Shipping address is required", 400);
      if (!Array.isArray(items) || items.length === 0)
        throw new AppError("Order items are required", 400);

      const service = new OrderService();
      const order = await service.createOrder(user._id, seller, shippingAddress, items);

      const paymentService = new PaymentOrderService();
      const paymentOrder = await paymentService.createPaymentOrder({ user, order });

      let paymentLinkResponse = null;
      if (paymentOrder.paymentMethod === "RAZORPAY") {
        const link = await paymentService.createRazorpayPaymentLink(user, paymentOrder.amount, paymentOrder._id);
        paymentLinkResponse = {
          paymentOrderId: paymentOrder._id,
          paymentLinkId: link.id,
          paymentLinkUrl: link.short_url ?? link.long_url ?? null,
        };
      }

      return res.status(201).json({
        success: true,
        message: "Order created successfully",
        order,
        payment: paymentLinkResponse,
      });
    } catch (err) {
      next(err);
    }
  };


  getUserOrders = async (req, res, next) => {
    try {
      const userId = req.user._id;
      const orders = await this.service.getUserOrders(userId);
      return res.status(200).json({ success: true, orders });
    } catch (err) {
      next(err);
    }
  };

  getOrderById = async (req, res, next) => {
    try {
      const order = await this.service.getOrderById(req.params.orderId);
      return res.status(200).json({ success: true, order });
    } catch (err) {
      next(err);
    }
  };

  updateOrderStatus = async (req, res, next) => {
    try {
      const { status } = req.body;
      const orderId = req.params.orderId;

      if (!status) throw new AppError("Status is required", 400);

      const updated = await this.service.updateOrderStatus(orderId, status);
      return res.status(200).json({ success: true, message: "Order updated", order: updated });
    } catch (err) {
      next(err);
    }
  };

  deleteOrder = async (req, res, next) => {
    try {
      const orderId = req.params.orderId;
      const userId = req.user._id;

      // Security: only owner (or seller/admin if you have roles) can delete — here enforcing owner only
      const order = await this.service.getOrderById(orderId);
      if (!order) throw new AppError("Order not found", 404);
      if (order.userId.toString() !== userId.toString()) {
        throw new AppError("Unauthorized to delete this order", 403);
      }

      const result = await this.service.deleteOrder(orderId);
      return res.status(200).json({ success: true, message: "Order deleted", result });
    } catch (err) {
      next(err);
    }
  };

  getUserHistory = async (req, res, next) => {
    try {
      const userId = req.user._id;
      const history = await this.service.getUserHistory(userId);
      return res.status(200).json({ success: true, history });
    } catch (err) {
      next(err);
    }
  };

  getCancelledOrders = async (req, res, next) => {
    try {
      const userId = req.user._id;
      const cancelled = await this.service.getCancelledOrders(userId);
      return res.status(200).json({ success: true, cancelled });
    } catch (err) {
      next(err);
    }
  };

  getSellerOrders = async (req, res, next) => {
    try {
      // sellerAuthMiddleware should set req.seller
      const sellerId = req.seller && req.seller._id ? req.seller._id : req.user._id;
      const orders = await this.service.getSellerOrders(sellerId);
      return res.status(200).json({ success: true, orders });
    } catch (err) {
      next(err);
    }
  };

  cancelOrder = async (req, res, next) => {
    try {
      const orderId = req.params.orderId;
      const userId = req.user._id;

      const cancelled = await this.service.cancelOrder(orderId, userId);
      return res.status(200).json({ success: true, message: "Order cancelled", order: cancelled });
    } catch (err) {
      next(err);
    }
  };
}

export default OrderController;
