import express from 'express';
import DealController from '../controller/DealController.js';

const router = express.Router();

router.get('/', DealController.getAlldeals);
router.post('/', DealController.createDeals);
router.put('/update/:id', DealController.updateDeal);
router.delete('/delete/:id', DealController.deleteDeal);

export default router;
