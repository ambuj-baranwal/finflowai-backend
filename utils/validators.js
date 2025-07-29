// Basic validators without external dependencies to keep it minimal

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // At least 8 characters, one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateObjectId = (id) => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

export const validateFileType = (filename, allowedTypes = ['pdf', 'docx', 'xlsx', 'txt']) => {
  const extension = filename.split('.').pop().toLowerCase();
  return allowedTypes.includes(extension);
};

export const validateChatMessage = (message) => {
  const errors = [];
  
  if (!message.content || typeof message.content !== 'string') {
    errors.push('Message content is required and must be a string');
  }
  
  if (message.content && message.content.length > 5000) {
    errors.push('Message content cannot exceed 5000 characters');
  }
  
  if (!['user', 'assistant'].includes(message.role)) {
    errors.push('Message role must be either "user" or "assistant"');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateUserRegistration = (userData) => {
  const errors = [];
  
  if (!userData.name || typeof userData.name !== 'string' || userData.name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters');
  }
  
  if (!userData.email || !validateEmail(userData.email)) {
    errors.push('Valid email is required');
  }
  
  if (!['google', 'github', 'email'].includes(userData.auth_provider)) {
    errors.push('Valid auth provider is required (google, github, or email)');
  }
  
  if (userData.auth_provider === 'email' && (!userData.password || !validatePassword(userData.password))) {
    errors.push('Password must be at least 8 characters with uppercase, lowercase, and number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export default {
  validateEmail,
  validatePassword,
  validateObjectId,
  validateURL,
  sanitizeInput,
  validateFileType,
  validateChatMessage,
  validateUserRegistration
};