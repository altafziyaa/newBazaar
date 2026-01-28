import mongoose from "mongoose";
import { PaymentStatus } from "../domain/paymentStatus.js";

const paymentOrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true }, // ✅ Single order, not array
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    paymentMethod: {
      type: String,
      enum: ["RAZORPAY", "COD"],
      default: "RAZORPAY",
    },
    paymentLinkId: { type: String },
    razorpayPaymentId: { type: String }, // ✅ Added for tracking
  },
  { timestamps: true }
);

export default mongoose.model("PaymentOrder", paymentOrderSchema);
