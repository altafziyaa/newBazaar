import jwtProvider from "../utils/jwtProvider.js";
import SellerService from "../service/SellerService.js";

const sellerAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Use method name as before
    const email = jwtProvider.getEmailFromJwt(token);

    if (!email) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const seller = await SellerService.getSellerByEmail(email);

    if (!seller) {
      return res.status(401).json({ message: "Seller not found" });
    }

    // Attach seller to request for further usage
    req.seller = seller;

    next();
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(401).json({ message: "Authentication failed" });
  }
};

export default sellerAuthMiddleware;
