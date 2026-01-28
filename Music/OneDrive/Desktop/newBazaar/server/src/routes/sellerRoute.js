// src/routes/sellerRoutes.js
import express from 'express';
import SellerController from '../controller/SellerController.js';
import sellerAuthMiddleware from '../middleware/sellerAuthMiddleware.js';

const router = express.Router();

router.post('/create', SellerController.createSeller); 
// register
router.post('/login', SellerController.loginSeller); 
// send OTP after verifying credentials
router.post('/login/verify-otp', SellerController.verifyLoginOtp); 
// verify OTP -> returns JWT

router.get('/profile', sellerAuthMiddleware, SellerController.getSellerProfile);

router.get('/', sellerAuthMiddleware, SellerController.getAllSellers);
router.put('/:id', sellerAuthMiddleware, SellerController.updateSeller);
router.patch('/:id/status', sellerAuthMiddleware, SellerController.updateSellerAccStatus);
router.delete('/:id', sellerAuthMiddleware, SellerController.deleteSeller);

export default router;
