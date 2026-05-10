import express from 'express';
const router = express.Router();
import { getMyUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

// When a GET request is made to /profile, it first goes through the `protect` middleware.
// If the token is valid, it proceeds to the `getUserProfile` controller.
router.get('/profile/me', protect, getMyUserProfile);

export default router;