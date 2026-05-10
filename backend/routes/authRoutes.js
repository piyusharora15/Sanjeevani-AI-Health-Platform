import express from 'express';
const router = express.Router();
import { 
  registerUser, 
  loginUser, 
  forgotPassword, 
  resetPassword,
  registerAdmin
} from '../controllers/authController.js';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/register-admin', registerAdmin);

export default router;