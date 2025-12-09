import mongoose, { Schema } from "mongoose";

const cartItemSchema = new Schema({
  cart: { type: Schema.Types.ObjectId, ref: 'Cart', required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  size: { type: String, required: true, trim: true, uppercase: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  mrpPrice: { type: Number, required: true, min: 0 },
  sellingPrice: { type: Number, required: true, min: 0 },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true } // Fixed
});

export default mongoose.model('CartItem', cartItemSchema);
