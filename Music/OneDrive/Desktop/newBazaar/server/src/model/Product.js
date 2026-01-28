import mongoose from "mongoose";

const productVariationSchema = new mongoose.Schema(
  {
    size: { type: String, required: true, trim: true, uppercase: true },
    color: { type: String, required: true, trim: true, lowercase: true },
    stock: { type: Number, required: true, min: 0 },
    variantImages: { type: [String], default: [], set: imgs => imgs.map(img => img.trim()) },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true, trim: true },
    mrpPrice: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, required: true, min: 0,
      validate: {
        validator: function (value) { return value <= this.mrpPrice; },
        message: "Selling price cannot exceed MRP",
      }
    },
    discountPercentage: { type: Number, default: 0, min: 0, max: 100 },
    variations: { type: [productVariationSchema], default: [] },
    totalStock: { type: Number, default: 0, min: 0 },
    primaryImages: { type: [String], default: [] },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true, index: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Pre-save hook
productSchema.pre("save", function (next) {
  this.totalStock = this.variations?.reduce((acc, v) => acc + (v.stock || 0), 0) || 0;
  this.isAvailable = this.totalStock > 0;
  next();
});

// Pre-update hook
productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.variations) {
    const totalStock = update.variations.reduce((acc, v) => acc + (v.stock || 0), 0);
    update.totalStock = totalStock;
    update.isAvailable = totalStock > 0;
  }
  next();
});

// Text search index
productSchema.index({ title: "text", description: "text" });
productSchema.index({ seller: 1, category: 1 });

const Product = mongoose.model("Product", productSchema);
export default Product;
