import bcrypt from 'bcrypt';
import User from '../models/mongo/user.model.js';
import { generateTokenPair } from '../utils/tokenGenerator.js';
import { validateUserRegistration } from '../utils/validators.js';
import { asyncHandler, createResponse, removePasswordFromUser } from '../utils/helpers.js';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, auth_provider } = req.body;

  // Validate input
  const validation = validateUserRegistration({ name, email, password, auth_provider });
  if (!validation.isValid) {
    return res.status(400).json(createResponse(false, null, validation.errors.join(', ')));
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json(createResponse(false, null, 'User already exists with this email'));
  }

  // Hash password if email auth
  let hashedPassword;
  if (auth_provider === 'email' && password) {
    hashedPassword = await bcrypt.hash(password, 12);
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    auth_provider
  });

  // Generate tokens
  const tokens = generateTokenPair(user);

  res.status(201).json(createResponse(true, {
    user: removePasswordFromUser(user),
    ...tokens
  }));
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json(createResponse(false, null, 'Email and password are required'));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json(createResponse(false, null, 'Invalid credentials'));
  }

  // Check if user uses email auth
  if (user.auth_provider !== 'email') {
    return res.status(400).json(createResponse(false, null, 'Please use your OAuth provider to login'));
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json(createResponse(false, null, 'Invalid credentials'));
  }

  // Generate tokens
  const tokens = generateTokenPair(user);

  res.json(createResponse(true, {
    user: removePasswordFromUser(user),
    ...tokens
  }));
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  if (!user) {
    return res.status(404).json(createResponse(false, null, 'User not found'));
  }

  res.json(createResponse(true, { user: removePasswordFromUser(user) }));
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
  // In a production app, you'd want to blacklist the token
  // For now, we'll just return success since JWT tokens are stateless
  res.json(createResponse(true, { message: 'Logged out successfully' }));
});

// @desc    OAuth callback handler
// @route   POST /api/auth/oauth
// @access  Public
export const oauthCallback = asyncHandler(async (req, res) => {
  const { name, email, auth_provider } = req.body;

  // Validate OAuth data
  if (!name || !email || !['google', 'github'].includes(auth_provider)) {
    return res.status(400).json(createResponse(false, null, 'Invalid OAuth data'));
  }

  // Find or create user
  let user = await User.findOne({ email });
  
  if (!user) {
    user = await User.create({
      name,
      email,
      auth_provider
    });
  } else if (user.auth_provider !== auth_provider) {
    return res.status(400).json(createResponse(false, null, 'Email already registered with different provider'));
  }

  // Generate tokens
  const tokens = generateTokenPair(user);

  res.json(createResponse(true, {
    user: removePasswordFromUser(user),
    ...tokens
  }));
});

export default {
  register,
  login,
  getMe,
  logout,
  oauthCallback
};