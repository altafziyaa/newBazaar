import AccountStatus from '../domain/AccountStatus.js';
import Seller from '../model/Seller.js';
import Address from '../model/Address.js';
import jwtProvider from '../utils/jwtProvider.js';



class SellerService {
  // Define service methods here
  async createSeller(sellerData) {
    // Logic to create a seller
    const existingSeller = await Seller.findOne({ email: sellerData.email });
    if (existingSeller) {
      const error = new Error("Email already registered");
      error.statusCode = 400; // Bad Request
      throw error;
    }
      
    const savedAddress = await Address.create(sellerData.pickupAddress);

    const newSeller= new Seller({
      sellerName:sellerData.sellerName,
      email:sellerData.email,
      password:sellerData.password,
      pickupAddress: savedAddress._id, 
      GSTIN:sellerData.GSTIN,
      mobile:sellerData.mobile,
      bankDetails:sellerData.bankDetails,
      businessDetails:sellerData.businessDetails
    })
    
    const savedSeller = await newSeller.save();
    return await savedSeller.populate("pickupAddress");
  }

  async getSellerByProfile(token) {
    const email = jwtProvider.getEmailFromJwt(token);
    if (!email) {
      const error = new Error("Invalid or expired token");
      error.statusCode = 401;
      throw error;
    }

    const seller = await this.getSellerByEmail(email);
    return seller;
  }

  async getSellerByEmail(email) {
    const seller = await Seller.findOne({ email }).populate("pickupAddress");
    if (!seller) {
      const error = new Error("Seller not found");
      error.statusCode = 404;
      throw error;
    }
    return seller;
  }

  async getSellerById(id) {
    const seller = await Seller.findById(id);
    if (!seller) {
      const error = new Error('Seller not found');
      error.statusCode = 404;
      throw error;
    }
    return seller;
  }

  async getAllSellers(status) {
    // filter based on query param
    const filter = status ? { accountStatus: status.toUpperCase() } : {};

    const sellers = await Seller.find(filter).populate("pickupAddress");

    if (!sellers || sellers.length === 0) {
      const error = new Error("No sellers found");
      error.statusCode = 404;
      throw error;
    }

    return sellers;
  }

  async updateSeller(sellerId, updatedData) {
    const existingSeller = await Seller.findById(sellerId);
    if (!existingSeller) {
      const error = new Error("Seller not found");
      error.statusCode = 404;
      throw error;
    }

    // Optional: prevent email or role from being updated directly
    if (updatedData.email || updatedData.role) {
      delete updatedData.email;
      delete updatedData.role;
    }

    const updatedSeller = await Seller.findByIdAndUpdate(
      sellerId,
      { ...updatedData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    return updatedSeller;
  }

  async updateSellerStatus(sellerId, status) {
    if (!sellerId) {
      const err = new Error("Seller ID is required");
      err.statusCode = 400;
      throw err;
    }

    if (!status) {
      const err = new Error("Account status is required");
      err.statusCode = 400;
      throw err;
    }

    // Ensure the provided status is valid (from AccountStatus enum)
    const validStatuses = Object.values(AccountStatus);
    if (!validStatuses.includes(status)) {
      const err = new Error(`Invalid status. Allowed values are: ${validStatuses.join(", ")}`);
      err.statusCode = 400;
      throw err;
    }

    // Check if seller exists
    const existingSeller = await Seller.findById(sellerId);
    if (!existingSeller) {
      const err = new Error("Seller not found");
      err.statusCode = 404;
      throw err;
    }

    // Update account status (use correct field name: accountStatus)
    const updatedSeller = await Seller.findByIdAndUpdate(
      sellerId,
      { $set: { accountStatus: status } },
      { new: true, runValidators: true }
    );

    return updatedSeller;
  }

  async deleteSeller(sellerId) {
    if (!sellerId) {
      const error = new Error("Seller ID is required");
      error.statusCode = 400;
      throw error;
    }

    const existingSeller = await Seller.findById(sellerId);
    if (!existingSeller) {
      const error = new Error("Seller not found");
      error.statusCode = 404;
      throw error;
    }

    const deletedSeller = await Seller.findByIdAndDelete(sellerId);
    return deletedSeller;
  }
}
export default new SellerService();