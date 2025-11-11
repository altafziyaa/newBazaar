import jwtProvider from "../utils/jwtProvider.js";
import SellerService from "../service/SellerService.js";

const sellerAuthMiddleware = async (req, res, next) => {
    try {
     const authHeader=req.headers.authorization;
     if (!authHeader || !authHeader.startsWith('Bearer ')) {
         return res.status(401).json({ message: 'No token provided' });
     }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwtProvider.verifyToken(token);
        const seller = await SellerService.getSellerByEmail(decoded.id);
        if (!seller) {
            return res.status(401).json({ message: 'Seller not found' });
        }  
        req.seller = seller;

        next();
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};

export default sellerAuthMiddleware;