import AuthService from "../service/AuthService.js";

const authService = new AuthService();

class AuthController {
  static async sendSignInOtp(req, res) {
    try {
      const { email } = req.body; 
      await authService.sendSignInOtp(email);

      return res.status(200).json({ 
        message: "OTP sent successfully" 
      });
    } catch (error) {
      return res.status(400).json({ 
        error: error.message 
      });
    }
  }
}

export default AuthController;
