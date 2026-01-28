import AuthService from "../service/AuthService.js";

const authService = new AuthService();

class AuthController {
  async sendSignInOtp(req, res) {
    try {
      const { email } = req.body;
      await authService.sendSignInOtp(email);
      return res.status(200).json({ message: "OTP sent successfully"
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

 async createUser(req, res) {
  try {
    const token = await authService.createUser(req.body);
    return res.status(201).json({ message: "User created", token });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}


async signIn(req, res) {
  try {
    const { email, password, otp } = req.body;  
    // ✅ extract data
    const data = await authService.signIn({ email, password, otp }); // ✅ pass required params only
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

}

export default new AuthController(); // ✅ IMPORTANT
