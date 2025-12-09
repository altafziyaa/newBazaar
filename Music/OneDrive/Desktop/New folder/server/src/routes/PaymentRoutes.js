import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import PaymentOrderController from "../controller/PaymentOrderController";


const router = Router();

router.get('/:paymentId',authMiddleware,PaymentOrderController.paymentSuccessHandler)

export default router