import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

class JWTProvider {
  constructor(secretKey) {
    this.secretKey = secretKey || process.env.JWT_SECRET;
  }

  createJwt(payload, expiresIn = "1d") {
    return jwt.sign(payload, this.secretKey, { expiresIn });
  }

  verifyJwt(token) {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  }

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

export default new JWTProvider(process.env.JWT_SECRET || "defaultSecretKey");
