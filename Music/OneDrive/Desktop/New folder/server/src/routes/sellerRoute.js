// routes/sellerRoutes.js
import express from 'express';
import SellerController from '../controller/SellerController.js';
import sellerAuthMiddleware from '../middleware/sellerAuthMiddleware.js';

const router = express.Router();
router.post('/', SellerController.createSeller); // ✅ Public
router.post('/login/verify-otp', SellerController.verifyLoginOtp); // ✅ Public

router.get('/profile', sellerAuthMiddleware, SellerController.getSellerProfile); // ✅ Protected

router.get('/', sellerAuthMiddleware, SellerController.getAllSellers); // ✅ Protected
router.put('/:id', sellerAuthMiddleware, SellerController.updateSeller); // ✅ Protected
router.patch('/:id/status', sellerAuthMiddleware, SellerController.updateSellerAccStatus); // ✅ Protected
router.delete('/:id', sellerAuthMiddleware, SellerController.deleteSeller); // ✅ Protected


export default router;
