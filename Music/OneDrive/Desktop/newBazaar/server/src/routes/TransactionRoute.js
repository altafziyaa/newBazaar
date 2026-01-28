import { Router } from "express";
import sellerAuthMiddleware from "../middleware/sellerAuthMiddleware.js";
import TransactionController from "../controller/transactionController.js";

const router = Router();
const transactionController = new TransactionController();

router.get("/seller", sellerAuthMiddleware, transactionController.getTransactionBySeller);

export default router;
