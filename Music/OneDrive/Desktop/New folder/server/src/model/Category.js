import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true,
      unique: true // Ensure uniqueness
    },
    categoryId: { type: String, default: null },
    parentcategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    level: { type: Number, required: true }
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
