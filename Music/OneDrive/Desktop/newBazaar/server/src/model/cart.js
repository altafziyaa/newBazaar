import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        totalSellingPrice: { type: Number, default: 0 },
      },
    ],
    totalItem: { type: Number, default: 0 },
    totalMrpPrice: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    couponCode: { type: String, default: null },
    couponPrice: { type: Number, default: 0 },
  },
  { timestamps: true },
);

cartSchema.index({ user: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });

export default mongoose.model("Cart", cartSchema);
