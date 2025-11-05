import VerificationCode from "../model/VerificationCode.js";
import SellerService from "../service/SellerService.js";
import jwtProvider from "../utils/jwtProvider.js";
import UserRole from "../domain/UserRole.js";


class SellerController {
 
  async getSellerProfile(req, res) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ success: false, message: "Authorization header missing" });
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(401).json({ success: false, message: "Token missing" });
      }

      const seller = await SellerService.getSellerByProfile(token);

      res.status(200).json({
        success: true,
        message: "Seller profile fetched successfully",
        seller,
      });
    } catch (error) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async createSeller(req, res) {
    try {
      const sellerData = req.body;
      const newSeller = await SellerService.createSeller(sellerData);
      res.status(201).json({
        success:true,
        message: "Seller created successfully", 
        seller:newSeller 
      });
    } catch (error) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false, 
        message: error.message 
      });
    }
  }

  async getAllSellers(req, res) {
    try {
      const status = req.query.status; // optional query param
      const sellers = await SellerService.getAllSellers(status);

      res.status(200).json({
        success: true,
        message: "Sellers retrieved successfully",
        sellers,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async updateSeller(req, res) {
    try {
      const sellerId = req.params.id;
      const updatedData = req.body;

      // Validation: ensure there’s data to update
      if (!updatedData || Object.keys(updatedData).length === 0) {
        return res.status(400).json({ message: "No update data provided" });
      }

      const updatedSeller = await SellerService.updateSeller(sellerId, updatedData);

      res.status(200).json({
        message: "Seller updated successfully",
        seller: updatedSeller,
      });
    } catch (error) {
      const status = error.statusCode || 500;
      res.status(status).json({ message: error.message });
    }
  }

  async updateSellerAccStatus(req, res) {
    try {
      const sellerId = req.params.id;
      const { status } = req.body;

      // Validate input
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      // Call service
      const updatedSeller = await SellerService.updateSellerStatus(sellerId, status);

      if (!updatedSeller) {
        return res.status(404).json({ message: "Seller not found" });
      }

      return res.status(200).json({
        message: "Seller account status updated successfully",
        seller: updatedSeller,
      });
    } catch (error) {
      console.error("Error updating seller status:", error.message);
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ message: error.message || "Internal Server Error" });
    }
  }

  async deleteSeller(req, res) {
    try {
      const sellerId = req.params.id;

      if (!sellerId) {
        return res.status(400).json({ message: "Seller ID is required" });
      }

      const deletedSeller = await SellerService.deleteSeller(sellerId);

      if (!deletedSeller) {
        return res.status(404).json({ message: "Seller not found" });
      }

      res.status(200).json({
        message: "Seller deleted successfully",
        seller: deletedSeller,
      });
    } catch (error) {
      console.error("Error deleting seller:", error.message);
      const status = error.statusCode || 500;
      res.status(status).json({ message: error.message });
    }
  }

  async verifyLoginOtp(req ,res){
    try {
      const {otp,email}=req.body;
      const seller=await SellerService.getSellerByEmail(email)
      const verificationCode=await VerificationCode.findOne({email})

      if (!verificationCode || verificationCode.otp !== otp) {
        throw new Error("Invalid OTP")
      } 

      const token=jwtProvider.createJwt({email})
      const authResponse={
        message:"login success",
        jwt:token,
        role:UserRole.SELLER
      }

      // 🛠️ FIX 2: Changed req.status to res.status
      return res.status(200).json(authResponse) 
    } catch (error) {
      const status=error.statusCode||500
      res.status(status).json({ message: error.message }) 
    }
  }
}

export default new SellerController();