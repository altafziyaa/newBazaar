import express from "express";
import AuthController from "../controller/AuthController.js";

const router = express.Router();

router.post("/send/login-signup-otp", AuthController.sendSignInOtp);
router.post("/signup", AuthController.createUser);
router.post("/signin", AuthController.signIn);

export default router;
