import express from 'express';
import {
  getDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  getDocumentStats
} from '../controllers/documentController.js';
import { authenticateToken } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Apply authentication to all document routes
router.use(authenticateToken);

// @route   GET /api/documents/stats
// @desc    Get document statistics
// @access  Private
router.get('/stats', getDocumentStats);

// @route   GET /api/documents
// @desc    Get all documents for user
// @access  Private
router.get('/', apiLimiter, getDocuments);

// @route   POST /api/documents
// @desc    Upload/Create new document
// @access  Private
router.post('/', apiLimiter, createDocument);

// @route   GET /api/documents/:documentId
// @desc    Get specific document
// @access  Private
router.get('/:documentId', getDocument);

// @route   PUT /api/documents/:documentId
// @desc    Update document
// @access  Private
router.put('/:documentId', updateDocument);

// @route   DELETE /api/documents/:documentId
// @desc    Delete document
// @access  Private
router.delete('/:documentId', deleteDocument);

export default router;