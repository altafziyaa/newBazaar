import Product from "../model/Product.js";
import Category from "../model/Category.js";
class ProductService {
  // Pricing calculation
 async calculatePricing(mrpPrice, discountPercentage) {
    if (discountPercentage < 0 || discountPercentage >= 100)
        throw new Error("Discount must be between 0% and 99%");
    const sellingPrice = Math.round(mrpPrice * (1 - discountPercentage / 100));
    return { sellingPrice, discountPercentage };
}
  // Create or get category
async createOrGetCategory(categoryId, level, parentId = null, name) {
    if (!name) throw new Error("Category name is required");

    const filter = categoryId ? { categoryId } : { name };
    const update = { $setOnInsert: { name, level, parentcategory: parentId || null } };

    return Category.findOneAndUpdate(filter, update, { new: true, upsert: true });
}
  // Pagination helper
async _paginate(query, { page = 1, limit = 10, populate = "" }) {
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
        query.limit(limit).skip(skip).populate(populate),
        query.model.countDocuments(query.getFilter())
    ]);
    return { products, total, page, limit };
}
  // --- CRUD ---
async createProduct(data) {
    const { title, description, primaryImages, mrpPrice, discountPercentage, variations, sellerId, category1, category2, category3 } = data;

    if (!title || !mrpPrice || discountPercentage === undefined || !variations?.length)
        throw new Error("Title, MRP, Discount, and at least one Variation required.");

    const { sellingPrice, discountPercentage: finalDiscount } = await this.calculatePricing(mrpPrice, discountPercentage);

    const cat1 = category1 ? await this.createOrGetCategory(category1.id, 1, null, category1.name) : null;
    const cat2 = category2 ? await this.createOrGetCategory(category2.id, 2, cat1?._id, category2.name) : null;
    const cat3 = category3 ? await this.createOrGetCategory(category3.id, 3, cat2?._id, category3.name) : null;

    const finalCategoryId = cat3?._id || cat2?._id || cat1?._id;
    if (!finalCategoryId) throw new Error("At least one valid category is required");

    return Product.create({
        title,
        description,
        primaryImages,
        mrpPrice,
        sellingPrice,
        discountPercentage: finalDiscount,
        variations,
        seller: sellerId,
        category: finalCategoryId,
    });
}

async updateProduct(productId, updates, sellerId) {
    const product = await Product.findOneAndUpdate(
        { _id: productId, seller: sellerId },
        updates,
        { new: true, runValidators: true }
    ).populate("category", "categoryId").populate("seller", "sellerName");

    if (!product) throw new Error("Product not found or unauthorized");
    return product;
}

async deleteProduct(productId, sellerId) {
    const product = await Product.findOneAndDelete({ _id: productId, seller: sellerId })
        .populate("seller", "sellerName");
    if (!product) throw new Error("Product not found or unauthorized");
    return product;
}

  async findProductById(productId) {
    const product = await Product.findById(productId)
      .populate("category", "categoryId")
      .populate("seller", "sellerName");
    if (!product) throw new Error("Product not found");
    return product;
  }
  // --- Search & Pagination ---
  async searchProduct({ query, category, minPrice, maxPrice, limit = 10, page = 1 }) {
    const filter = { isAvailable: true };
    if (query) filter.$text = { $search: query };
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.sellingPrice = {};
      if (minPrice) filter.sellingPrice.$gte = Number(minPrice);
      if (maxPrice) filter.sellingPrice.$lte = Number(maxPrice);
    }
    return this._paginate(Product.find(filter).populate("category", "categoryId"), { page, limit });
  }

  async getProductBySellerId(sellerId, limit = 10, page = 1) {
    return this._paginate(Product.find({ seller: sellerId }).populate("category", "categoryId"), { page, limit });
  }

  async getAllProducts(limit = 10, page = 1) {
    return this._paginate(Product.find().populate("category", "categoryId"), { page, limit });
  }
}

export default new ProductService();
