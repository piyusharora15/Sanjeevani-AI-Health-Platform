import express from 'express';
const router = express.Router();

import { analyzeDocument, upload } from '../controllers/analysisController.js';
import { protect } from '../middleware/authMiddleware.js';

/**
 * @route   POST /api/analysis/analyze
 * @desc    Upload a medical document and get AI-powered simplification
 * @access  Private
 * * MIDDLEWARE CHAIN:
 * 1. protect: Verifies JWT and ensures the user is authenticated.
 * 2. upload.single('document'): Multer processes the incoming multipart form data.
 * 3. analyzeDocument: The controller that interacts with Gemini AI.
 */
router.post('/analyze', protect, upload.single('document'), analyzeDocument);

export default router;