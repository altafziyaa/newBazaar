import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true
  },
  amount: { type: Number, required: true }, // NEW ADD
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model("Transaction", transactionSchema);
