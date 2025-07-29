import bcrypt from 'bcrypt';
import User from '../models/mongo/user.model.js';
import { generateTokenPair, verifyToken } from '../utils/tokenGenerator.js';
import { validateEmail, validatePassword } from '../utils/validators.js';

class AuthService {
  async createUser({ name, email, password, auth_provider }) {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists with this email');
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

    return user;
  }

  async authenticateUser(email, password) {
    // Validate input
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check auth provider
    if (user.auth_provider !== 'email') {
      throw new Error('Please use your OAuth provider to login');
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    return user;
  }

  async findOrCreateOAuthUser({ name, email, auth_provider }) {
    let user = await User.findOne({ email });
    
    if (!user) {
      user = await User.create({
        name,
        email,
        auth_provider
      });
    } else if (user.auth_provider !== auth_provider) {
      throw new Error('Email already registered with different provider');
    }

    return user;
  }

  async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async updateUser(userId, updateData) {
    const allowedUpdates = ['name'];
    const filteredUpdates = {};
    
    for (const key of allowedUpdates) {
      if (updateData[key]) {
        filteredUpdates[key] = updateData[key];
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      filteredUpdates,
      { new: true }
    );

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new Error('User not found');
    }

    if (user.auth_provider !== 'email') {
      throw new Error('Password change not allowed for OAuth users');
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }

    // Validate new password
    if (!validatePassword(newPassword)) {
      throw new Error('Password must be at least 8 characters with uppercase, lowercase, and number');
    }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    return true;
  }

  generateTokens(user) {
    return generateTokenPair(user);
  }

  validateToken(token) {
    return verifyToken(token);
  }

  removePasswordFromUser(user) {
    const userObj = user.toObject ? user.toObject() : user;
    delete userObj.password;
    return userObj;
  }
}

export default new AuthService();