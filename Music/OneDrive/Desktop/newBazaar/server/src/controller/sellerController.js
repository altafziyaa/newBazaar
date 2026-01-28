// src/controller/SellerController.js
import VerificationCode from "../model/VerificationCode.js";
import SellerService from "../service/SellerService.js";
import jwtProvider from "../utils/jwtProvider.js";
import UserRole from "../domain/UserRole.js";
import bcrypt from "bcryptjs";
import Seller from "../model/Seller.js";

class SellerController {
  async getSellerProfile(req, res) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).json({ success: false, message: "Authorization header missing" });
      const token = authHeader.split(" ")[1];
      if (!token) return res.status(401).json({ success: false, message: "Token missing" });

      const seller = await SellerService.getSellerByProfile(token);
      res.status(200).json({ success: true, message: "Seller profile fetched successfully", seller });
    } catch (error) {
      const status = error.statusCode || 500;
      res.status(status).json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  async createSeller(req, res) {
    try {
      const sellerData = req.body;
      const newSeller = await SellerService.createSeller(sellerData);
      res.status(201).json({ success: true, message: "Seller created successfully", seller: newSeller });
    } catch (error) {
      const status = error.statusCode || 500;
      res.status(status).json({ success: false, message: error.message });
    }
  }

  // STEP 1: loginSeller => validate credentials then generate & save OTP
  async loginSeller(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ message: "Email and password required" });

      // include password (it was stored with select: false)
      const seller = await Seller.findOne({ email }).select('+password');
      if (!seller) return res.status(404).json({ message: "Seller not found" });

      const isMatch = await bcrypt.compare(password, seller.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid password" });

      // generate OTP (6 digits)
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // save OTP (upsert)
      await VerificationCode.findOneAndUpdate(
        { email },
        { email, otp, createdAt: new Date() },
        { upsert: true, new: true }
      );

      // In production: send OTP via SMS/email. For testing we return it.
      return res.status(200).json({ success: true, message: "OTP sent", otp });
    } catch (error) {
      console.error("loginSeller error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // STEP 2: verifyLoginOtp => check OTP and return JWT
  async verifyLoginOtp(req, res) {
    try {
      const { otp, email } = req.body;
      if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

      const seller = await Seller.findOne({ email });
      if (!seller) return res.status(404).json({ message: "Seller not found" });

      const verificationCode = await VerificationCode.findOne({ email });
      if (!verificationCode) return res.status(400).json({ message: "Invalid or expired OTP" });

      if (verificationCode.otp !== String(otp)) return res.status(400).json({ message: "Invalid OTP" });

      // OTP valid - generate token (we'll include email in payload)
      const token = jwtProvider.createJwt({ email });

      // Optionally delete used OTP
      await VerificationCode.deleteOne({ email });

      return res.status(200).json({
        message: "login success",
        jwt: token,
        role: UserRole.SELLER
      });
    } catch (error) {
      console.error("verifyLoginOtp error:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ message: error.message || "Internal Server Error" });
    }
  }

  async getAllSellers(req, res) {
    try {
      const status = req.query.status;
      const sellers = await SellerService.getAllSellers(status);
      res.status(200).json({ success: true, message: "Sellers retrieved successfully", sellers });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  async updateSeller(req, res) {
    try {
      const sellerId = req.params.id;
      const updatedData = req.body;
      if (!updatedData || Object.keys(updatedData).length === 0) return res.status(400).json({ message: "No update data provided" });

      const updatedSeller = await SellerService.updateSeller(sellerId, updatedData);
      res.status(200).json({ message: "Seller updated successfully", seller: updatedSeller });
    } catch (error) {
      const status = error.statusCode || 500;
      res.status(status).json({ message: error.message });
    }
  }

  async updateSellerAccStatus(req, res) {
    try {
      const sellerId = req.params.id;
      const { status } = req.body;
      if (!status) return res.status(400).json({ message: "Status is required" });

      const updatedSeller = await SellerService.updateSellerStatus(sellerId, status);
      if (!updatedSeller) return res.status(404).json({ message: "Seller not found" });

      return res.status(200).json({ message: "Seller account status updated successfully", seller: updatedSeller });
    } catch (error) {
      console.error("Error updating seller status:", error.message);
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ message: error.message || "Internal Server Error" });
    }
  }

  async deleteSeller(req, res) {
    try {
      const sellerId = req.params.id;
      if (!sellerId) return res.status(400).json({ message: "Seller ID is required" });

      const deletedSeller = await SellerService.deleteSeller(sellerId);
      if (!deletedSeller) return res.status(404).json({ message: "Seller not found" });

      res.status(200).json({ message: "Seller deleted successfully", seller: deletedSeller });
    } catch (error) {
      console.error("Error deleting seller:", error.message);
      const status = error.statusCode || 500;
      res.status(status).json({ message: error.message });
    }
  }
}

export default new SellerController();
