// routes/sellerRoutes.js
import express from 'express';
import SellerController from '../controller/SellerController.js';

const router = express.Router();

// Seller profile (auth token required in header)
router.get('/profile', SellerController.getSellerProfile);

// Create new seller
router.post('/', SellerController.createSeller);

// Get all sellers (optional status query param)
router.get('/', SellerController.getAllSellers);

// Update seller by ID
router.put('/:id', SellerController.updateSeller);

// Update seller account status by ID
router.patch('/:id/status', SellerController.updateSellerAccStatus);

// Delete seller by ID
router.delete('/:id', SellerController.deleteSeller);

// Verify login OTP
router.post('/login/verify-otp', SellerController.verifyLoginOtp);

export default router;
