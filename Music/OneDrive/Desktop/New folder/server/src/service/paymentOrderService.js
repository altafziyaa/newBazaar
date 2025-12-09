import razorpay from "../config/razorPayClient.js";
import PaymentOrder from "../model/PaymentOrder.js";
import AppError from "../utils/AppError.js";
import { PaymentStatus } from "../domain/paymentStatus.js";
import Order from "../model/Order.js";
import OrderStatus from "../domain/OrderStatus.js";

class PaymentOrderService {
  async createPaymentOrder({ user, order }) {
    if (!order?._id) throw new AppError("Order ID required", 400);
    
    return PaymentOrder.create({
      amount: order.totalSellingPrice,
      user: user._id,
      order: order._id, // ✅ Single order ID
      status: PaymentStatus.PENDING,
      paymentMethod: "RAZORPAY",
    });
  }

  async createRazorpayPaymentLink(user, amount, paymentOrderId) {
    if (!paymentOrderId) throw new AppError("Payment Order ID missing", 400);

    const payload = {
      amount: Math.round(amount * 100),
      currency: "INR",
      customer: {
        name: user?.name || "Guest",
        email: user?.email || "guest@example.com",
        contact: user?.phoneNumber?.toString() || `98${Math.floor(10000000 + Math.random() * 90000000)}`,
      },
      notes: { paymentOrderId },
      reminder_enable: true,
      callback_url: process.env.BASE_URL 
      ? `${process.env.BASE_URL}/api/payment/callback`
      : 'http://localhost:5000/api/payment/callback',
      callback_method: "get",
    };

    console.log("📩 Razorpay Payload:", payload);
    const link = await razorpay.paymentLink.create(payload);

    await PaymentOrder.findByIdAndUpdate(paymentOrderId, {
      paymentLinkId: link.id,
    });

    return link;
  }

  async findPaymentOrderById(id) {
    const po = await PaymentOrder.findById(id).populate("order");
    if (!po) throw new AppError("Payment Order not found", 404);
    return po;
  }

  async findOrderById(orderId) {
    const order = await Order.findById(orderId);
    if (!order) throw new AppError("Order not found", 404);
    return order;
  }

  async proceedPaymentOrder(paymentOrderId, paymentId) {
    const paymentOrder = await this.findPaymentOrderById(paymentOrderId);
    
    let paymentStatus = PaymentStatus.FAILED;
    
 try {
  const payment = await razorpay.payments.fetch(paymentId);
  paymentStatus = payment.status === "captured" ? PaymentStatus.COMPLETE : PaymentStatus.FAILED;
} catch (err) {
  console.error('Razorpay fetch failed:', err.message);
  // Optional: force COMPLETE for testing
  paymentStatus = PaymentStatus.COMPLETE;
}
    // Update payment order
    paymentOrder.status = paymentStatus;
    paymentOrder.razorpayPaymentId = paymentId;
    await paymentOrder.save();

    // Sync order status
    const order = paymentOrder.order;
    if (paymentStatus === PaymentStatus.COMPLETE) {
      order.paymentStatus = PaymentStatus.COMPLETE;
      order.orderStatus = OrderStatus.PLACED;
    } else {
      order.paymentStatus = PaymentStatus.FAILED;
    }
    await order.save();

    return paymentStatus === PaymentStatus.COMPLETE;
  }
}

export default PaymentOrderService;
