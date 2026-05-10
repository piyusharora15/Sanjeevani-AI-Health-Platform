import express from 'express';
const router = express.Router();
import { processSymptoms } from '../controllers/assistantController.js';
import { protect } from'../middleware/authMiddleware.js';

// This is a protected route. A user must be logged in to access it.
// The `protect` middleware will run first to verify the user's token.
router.post('/symptoms', protect, processSymptoms);

export default router;