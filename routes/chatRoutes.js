import express from 'express';
import {
  getChatSessions,
  createChatSession,
  getChatSession,
  updateChatSession,
  deleteChatSession,
  getChatMessages,
  addChatMessage
} from '../controllers/chatController.js';
import { authenticateToken } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Apply authentication to all chat routes
router.use(authenticateToken);

// Chat sessions routes
// @route   GET /api/chat/sessions
// @desc    Get all chat sessions for user
// @access  Private
router.get('/sessions', apiLimiter, getChatSessions);

// @route   POST /api/chat/sessions
// @desc    Create new chat session
// @access  Private
router.post('/sessions', apiLimiter, createChatSession);

// @route   GET /api/chat/sessions/:sessionId
// @desc    Get specific chat session
// @access  Private
router.get('/sessions/:sessionId', getChatSession);

// @route   PUT /api/chat/sessions/:sessionId
// @desc    Update chat session
// @access  Private
router.put('/sessions/:sessionId', updateChatSession);

// @route   DELETE /api/chat/sessions/:sessionId
// @desc    Delete chat session
// @access  Private
router.delete('/sessions/:sessionId', deleteChatSession);

// Chat messages routes
// @route   GET /api/chat/sessions/:sessionId/messages
// @desc    Get messages for a chat session
// @access  Private
router.get('/sessions/:sessionId/messages', getChatMessages);

// @route   POST /api/chat/sessions/:sessionId/messages
// @desc    Add message to chat session
// @access  Private
router.post('/sessions/:sessionId/messages', apiLimiter, addChatMessage);

export default router;