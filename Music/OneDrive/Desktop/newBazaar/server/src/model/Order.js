import mongoose from "mongoose";
import { PaymentStatus } from "../domain/paymentStatus.js";
import OrderStatus from "../domain/OrderStatus.js";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
  orderItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "OrderItem", required: true }], 
  shippingAddress: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true },
  totalMrpPrice: { type: Number, required: true },
  totalSellingPrice: { type: Number, required: true },
  totalDiscount: { type: Number, default: 0 },

  paymentStatus: {
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING,
  },

  orderStatus: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING,
  },

  totalItems: { type: Number, required: true },
}, { timestamps: true });

orderSchema.index({ userId: 1, orderStatus: 1 });
orderSchema.index({ seller: 1, orderStatus: 1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });

export default mongoose.model("Order", orderSchema);
