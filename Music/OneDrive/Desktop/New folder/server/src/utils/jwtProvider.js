import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class JWTProvider {
  constructor(secretKey) {
    this.secretKey = secretKey || process.env.JWT_SECRET;
  }

  // Token create karne ka method
  createJwt(payload, expiresIn = '1h') {
    return jwt.sign(payload, this.secretKey, { expiresIn });
  }

  // Token verify karne ka method
  verifyJwt(token) {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  }

  // Email directly token se nikalne ka method (name same as before)
  getEmailFromJwt(token) {
    try {
      const decoded = jwt.verify(token, this.secretKey);
      return decoded?.email || null;
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  }
}

// Export singleton instance
export default new JWTProvider(process.env.JWT_SECRET || "defaultSecretKey");
