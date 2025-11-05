import express from "express";
import AuthController from "../controller/authController.js";

const router = express.Router();

router.post("/send/login-signup-otp", AuthController.sendSignInOtp);

export default router;
