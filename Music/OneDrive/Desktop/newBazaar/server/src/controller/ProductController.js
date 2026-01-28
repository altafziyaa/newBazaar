import productService from "../service/ProductService.js";

class ProductController {
  _checkSeller(req) {
    if (!req.seller?._id) throw new Error("Authorization required");
    return req.seller._id;
  }

  _handleResponse(res, data, message = "Success", pagination = null, status = 200) {
    const response = { success: true, message, data };
    if (pagination) response.pagination = pagination;
    res.status(status).json(response);
  }

  createProduct = async (req, res, next) => {
    try {
      const sellerId = this._checkSeller(req);
      const product = await productService.createProduct({ ...req.body, sellerId });
      this._handleResponse(res, product, "Product created successfully", null, 201);
    } catch (err) {
      next(err);
    }
  };

  deleteProduct = async (req, res, next) => {
    try {
      const sellerId = this._checkSeller(req);
      const product = await productService.deleteProduct(req.params.productId, sellerId);
      this._handleResponse(res, product, "Product deleted successfully");
    } catch (err) {
      next(err);
    }
  };

  updateProduct = async (req, res, next) => {
    try {
      const sellerId = this._checkSeller(req);
      const product = await productService.updateProduct(req.params.productId, req.body, sellerId);
      this._handleResponse(res, product, "Product updated successfully");
    } catch (err) {
      next(err);
    }
  };

  findProductById = async (req, res, next) => {
    try {
      const product = await productService.findProductById(req.params.productId);
      this._handleResponse(res, product, "Product retrieved successfully");
    } catch (err) {
      next(err);
    }
  };

  searchProduct = async (req, res, next) => {
    try {
      const result = await productService.searchProduct(req.query);
      this._handleResponse(res, result.products, "Products retrieved successfully", {
        total: result.total,
        page: result.page,
        limit: result.limit,
        pages: Math.ceil(result.total / result.limit)
      });
    } catch (err) {
      next(err);
    }
  };

  getProductBySellerId = async (req, res, next) => {
    try {
      const result = await productService.getProductBySellerId(
        req.params.sellerId,
        Number(req.query.limit) || 10,
        Number(req.query.page) || 1
      );
      this._handleResponse(res, result.products, "Products retrieved successfully", {
        total: result.total,
        page: result.page,
        limit: result.limit,
        pages: Math.ceil(result.total / result.limit)
      });
    } catch (err) {
      next(err);
    }
  };

  getAllProducts = async (req, res, next) => {
    try {
      const result = await productService.getAllProducts(
        Number(req.query.limit) || 10,
        Number(req.query.page) || 1
      );
      this._handleResponse(res, result.products, "All products retrieved successfully", {
        total: result.total,
        page: result.page,
        limit: result.limit,
        pages: Math.ceil(result.total / result.limit)
      });
    } catch (err) {
      next(err);
    }
  };
}

export default new ProductController();
