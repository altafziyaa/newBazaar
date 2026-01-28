import jwtProvider from "../utils/jwtProvider.js";
import userService from "../service/userService.js";

const authMiddleware = async (req, res, next) => {
    
    try {
     const authHeader=req.headers.authorization;
     if (!authHeader || !authHeader.startsWith('Bearer')) {
         return res.status(401).json({ message: 'No token provided' });
     }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const email = jwtProvider.getEmailFromJwt(token);
        console.log("Decoded email from token:", email);

        const user = await userService.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};

export default authMiddleware;