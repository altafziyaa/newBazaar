import { Router } from "express";
import sellerAuthMiddleware from "../middleware/sellerAuthMiddleware.js";
import SellerReportController from "../controller/sellerReportControler.js";

const router = Router();

router.get("/",sellerAuthMiddleware,new SellerReportController().getSellerReport
);

export default router;
