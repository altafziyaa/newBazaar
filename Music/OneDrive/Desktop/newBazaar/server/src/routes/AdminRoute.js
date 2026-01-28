import express from 'express';
const router = express.Router();

import sellerController from '../controller/SellerController.js'; 

router.patch('/seller/:id/status/:status', sellerController.updateSellerAccStatus);
   

export default router;
