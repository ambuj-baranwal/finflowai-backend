import jwt from 'jsonwebtoken';

export const generateAccessToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      issuer: 'finflow-ai'
    }
  );
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
      issuer: 'finflow-ai'
    }
  );
};

export const verifyToken = (token, secret = process.env.JWT_SECRET) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const decodeToken = (token) => {
  return jwt.decode(token);
};

export const createUserTokenPayload = (user) => {
  return {
    id: user._id,
    email: user.email,
    name: user.name,
    auth_provider: user.auth_provider
  };
};

export const generateTokenPair = (user) => {
  const payload = createUserTokenPayload(user);
  
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken({ id: user._id })
  };
};

export default {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  decodeToken,
  createUserTokenPayload,
  generateTokenPair
};