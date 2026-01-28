import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    categoryId: { type: String, default: null },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    level: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

categorySchema.index({ parentCategory: 1 });
export default mongoose.model("Category", categorySchema);
