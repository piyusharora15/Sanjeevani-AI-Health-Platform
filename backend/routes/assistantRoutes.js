import express from 'express';
const router = express.Router();
const { processSymptoms } = import('../controllers/assistantController');
const { protect } = import('../middleware/authMiddleware');

// This is a protected route. A user must be logged in to access it.
// The `protect` middleware will run first to verify the user's token.
router.post('/symptoms', protect, processSymptoms);

export default router;