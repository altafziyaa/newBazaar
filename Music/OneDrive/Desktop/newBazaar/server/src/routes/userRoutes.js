import express from 'express';
import UserController from '../controller/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/profile', authMiddleware, UserController.getUserProfileByJwt);
router.get('/:email', authMiddleware, UserController.getUserByEmail);

export default router;
