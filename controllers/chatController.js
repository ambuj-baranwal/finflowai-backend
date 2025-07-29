import ChatSession from '../models/mongo/chatSession.model.js';
import Message from '../models/mongo/message.model.js';
import { validateChatMessage, validateObjectId } from '../utils/validators.js';
import { asyncHandler, createResponse, parseQueryParams, paginate, calculatePagination } from '../utils/helpers.js';

// @desc    Get all chat sessions for user
// @route   GET /api/chat/sessions
// @access  Private
export const getChatSessions = asyncHandler(async (req, res) => {
  const { page, limit, sort } = parseQueryParams(req);
  
  const total = await ChatSession.countDocuments({ userId: req.user.id });
  
  const sessions = await paginate(
    ChatSession.find({ userId: req.user.id }).sort(sort),
    page,
    limit
  );

  const pagination = calculatePagination(total, page, limit);

  res.json(createResponse(true, {
    sessions,
    pagination
  }));
});

// @desc    Create new chat session
// @route   POST /api/chat/sessions
// @access  Private
export const createChatSession = asyncHandler(async (req, res) => {
  const { title } = req.body;

  if (!title || title.trim().length === 0) {
    return res.status(400).json(createResponse(false, null, 'Session title is required'));
  }

  const session = await ChatSession.create({
    userId: req.user.id,
    title: title.trim()
  });

  res.status(201).json(createResponse(true, { session }));
});

// @desc    Get specific chat session
// @route   GET /api/chat/sessions/:sessionId
// @access  Private
export const getChatSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  if (!validateObjectId(sessionId)) {
    return res.status(400).json(createResponse(false, null, 'Invalid session ID'));
  }

  const session = await ChatSession.findOne({
    _id: sessionId,
    userId: req.user.id
  });

  if (!session) {
    return res.status(404).json(createResponse(false, null, 'Chat session not found'));
  }

  res.json(createResponse(true, { session }));
});

// @desc    Update chat session
// @route   PUT /api/chat/sessions/:sessionId
// @access  Private
export const updateChatSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { title } = req.body;

  if (!validateObjectId(sessionId)) {
    return res.status(400).json(createResponse(false, null, 'Invalid session ID'));
  }

  if (!title || title.trim().length === 0) {
    return res.status(400).json(createResponse(false, null, 'Session title is required'));
  }

  const session = await ChatSession.findOneAndUpdate(
    { _id: sessionId, userId: req.user.id },
    { title: title.trim() },
    { new: true }
  );

  if (!session) {
    return res.status(404).json(createResponse(false, null, 'Chat session not found'));
  }

  res.json(createResponse(true, { session }));
});

// @desc    Delete chat session
// @route   DELETE /api/chat/sessions/:sessionId
// @access  Private
export const deleteChatSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  if (!validateObjectId(sessionId)) {
    return res.status(400).json(createResponse(false, null, 'Invalid session ID'));
  }

  const session = await ChatSession.findOneAndDelete({
    _id: sessionId,
    userId: req.user.id
  });

  if (!session) {
    return res.status(404).json(createResponse(false, null, 'Chat session not found'));
  }

  // Delete all messages in this session
  await Message.deleteMany({ chatSessionId: sessionId });

  res.json(createResponse(true, { message: 'Chat session deleted successfully' }));
});

// @desc    Get messages for a chat session
// @route   GET /api/chat/sessions/:sessionId/messages
// @access  Private
export const getChatMessages = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { page, limit } = parseQueryParams(req);

  if (!validateObjectId(sessionId)) {
    return res.status(400).json(createResponse(false, null, 'Invalid session ID'));
  }

  // Verify session belongs to user
  const session = await ChatSession.findOne({
    _id: sessionId,
    userId: req.user.id
  });

  if (!session) {
    return res.status(404).json(createResponse(false, null, 'Chat session not found'));
  }

  const total = await Message.countDocuments({ chatSessionId: sessionId });
  
  const messages = await paginate(
    Message.find({ chatSessionId: sessionId })
      .sort({ createdAt: 1 })
      .populate('documentId', 'title fileType')
      .populate('canvasNodeId'),
    page,
    limit
  );

  const pagination = calculatePagination(total, page, limit);

  res.json(createResponse(true, {
    messages,
    pagination
  }));
});

// @desc    Add message to chat session
// @route   POST /api/chat/sessions/:sessionId/messages
// @access  Private
export const addChatMessage = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { role, content, documentId, canvasNodeId } = req.body;

  if (!validateObjectId(sessionId)) {
    return res.status(400).json(createResponse(false, null, 'Invalid session ID'));
  }

  // Validate message
  const validation = validateChatMessage({ role, content });
  if (!validation.isValid) {
    return res.status(400).json(createResponse(false, null, validation.errors.join(', ')));
  }

  // Verify session belongs to user
  const session = await ChatSession.findOne({
    _id: sessionId,
    userId: req.user.id
  });

  if (!session) {
    return res.status(404).json(createResponse(false, null, 'Chat session not found'));
  }

  // Validate referenced documents/canvas nodes if provided
  if (documentId && !validateObjectId(documentId)) {
    return res.status(400).json(createResponse(false, null, 'Invalid document ID'));
  }

  if (canvasNodeId && !validateObjectId(canvasNodeId)) {
    return res.status(400).json(createResponse(false, null, 'Invalid canvas node ID'));
  }

  const message = await Message.create({
    chatSessionId: sessionId,
    role,
    content,
    documentId: documentId || null,
    canvasNodeId: canvasNodeId || null
  });

  await message.populate('documentId', 'title fileType');
  await message.populate('canvasNodeId');

  res.status(201).json(createResponse(true, { message }));
});

export default {
  getChatSessions,
  createChatSession,
  getChatSession,
  updateChatSession,
  deleteChatSession,
  getChatMessages,
  addChatMessage
};