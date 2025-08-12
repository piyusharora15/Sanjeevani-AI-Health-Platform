const express = require('express');
const router = express.Router();
const { analyzeDocument, upload } = require('../controllers/analysisController');
const { protect } = require('../middleware/authMiddleware');

// This route is protected and uses the multer middleware to handle a single file upload.
// The file is expected to be in a field named 'document'.
// The middleware chain is: 1. protect (auth) -> 2. upload (file) -> 3. analyzeDocument (logic)
router.post('/analyze', protect, upload.single('document'), analyzeDocument);

module.exports = router;