import express from 'express';
const router = express.Router();
import { authUser, getUserProfile, registerUser } from '../controllers/userController.js';
import {protect} from '../middleware/authMiddleware.js'

// /api/users/profile
router.route('/').post(registerUser)
// /api/users/login
router.post('/login', authUser);
// /api/users/profile
router.route('/profile').get(protect, getUserProfile)

export default router;
