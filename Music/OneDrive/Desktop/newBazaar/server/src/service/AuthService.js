import Seller from "../model/Seller.js";
import VerificationCode from "../model/VerificationCode.js";
import sendVerificationEmail from "../utils/sendEmail.js";
import { generateOTP } from "../utils/generateOtp.js";
import User from "../model/User.js";
import bcrypt from "bcryptjs";
import Cart from "../model/cart.js";
import jwtProvider from "../utils/jwtProvider.js";

class AuthService {
  async sendSignInOtp(email) {
    const SIGNIN_PREFIX = "signin_";

    if (email.startsWith(SIGNIN_PREFIX)) {
      const seller = await Seller.findOne({ email });
      if (!seller) throw new Error("User not found");
    }

    await VerificationCode.deleteOne({ email });

    const otp = generateOTP();
    await new VerificationCode({ email, otp }).save();

    await sendVerificationEmail(
      email,
      "Your Login OTP",
      `<p>Your OTP is: <b>${otp}</b> (valid for 10 minutes)</p>`,
    );
    // console.log(otp);
  }

  async createUser({ name, email, mobile, password }) {
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await new User({
      name,
      email,
      mobile,
      password: hashedPassword,
    }).save();

    await new Cart({ user: user._id }).save();

    return jwtProvider.createJwt({ email: user.email });
  }

  async signIn({ email, password, otp }) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid email or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid email or password");

    const verificationCode = await VerificationCode.findOne({ email });
    if (!verificationCode || verificationCode.otp !== otp) {
      throw new Error("Invalid OTP");
    }

    return {
      message: "Login success",
      jwt: jwtProvider.createJwt({ email }),
      role: user.role,
    };
  }
}

export default AuthService;
