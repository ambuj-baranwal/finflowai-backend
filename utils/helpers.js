export const createResponse = (success, data = null, error = null, statusCode = 200) => {
  const response = { success };
  
  if (data !== null) {
    response.data = data;
  }
  
  if (error !== null) {
    response.error = error;
  }
  
  return response;
};

export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export const paginate = (query, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return query.skip(skip).limit(limit);
};

export const calculatePagination = (total, page = 1, limit = 10) => {
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const hasNext = currentPage < totalPages;
  const hasPrev = currentPage > 1;
  
  return {
    total,
    totalPages,
    currentPage,
    limit,
    hasNext,
    hasPrev
  };
};

export const formatDate = (date) => {
  return new Date(date).toISOString();
};

export const generateRandomString = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const parseQueryParams = (req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 10, 100); // Max 100 items per page
  const sort = req.query.sort || '-createdAt';
  const search = req.query.search || '';
  
  return { page, limit, sort, search };
};

export const createErrorResponse = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

export const removePasswordFromUser = (user) => {
  const userObj = user.toObject ? user.toObject() : user;
  delete userObj.password;
  return userObj;
};

export default {
  createResponse,
  asyncHandler,
  paginate,
  calculatePagination,
  formatDate,
  generateRandomString,
  sleep,
  parseQueryParams,
  createErrorResponse,
  isValidObjectId,
  removePasswordFromUser
};