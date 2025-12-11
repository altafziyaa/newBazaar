import Order from "../model/Order.js";
import Seller from "../model/Seller.js";
import Transaction from "../model/Transaction.js";
import AppError from "../utils/AppError.js";
import { PaymentStatus } from "../domain/paymentStatus.js";

class TransactionService {

  static async createTransaction(orderId) {
    try {

      const order = await Order.findById(orderId).populate("seller");
      if (!order) throw new AppError("Order not found", 404);

      if (order.paymentStatus !== PaymentStatus.COMPLETED) {
      throw new AppError("Payment not completed", 400);
      }

      const existing = await Transaction.findOne({ order: orderId });
      if (existing) return existing;

      if (!order.seller) throw new AppError("Seller not found", 404);

      const transaction = new Transaction({
        seller: order.seller._id,
        customer: order.user,   // Updated key
        order: order._id, 
        amount: order.totalAmount ?? order.amount, // Ensure Amount stored
      });

      return await transaction.save();
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(err.message || "Internal Server Error", 500);
    }
  }

  static async getTransactionBySellerId(sellerId) {
    return await Transaction.find({ seller: sellerId })
      .populate("seller")
      .populate("customer")
      .populate("order");
  }

  static async getAllTransaction() {
    return await Transaction.find()
      .populate("seller")
      .populate("customer")
      .populate("order");
  }
}

export default TransactionService;
