const rateLimitStore = new Map();

// Simple in-memory rate limiter
export const createRateLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100, // limit each IP to 100 requests per windowMs
    message = 'Too many requests from this IP, please try again later',
    skip = () => false
  } = options;

  return (req, res, next) => {
    if (skip(req)) {
      return next();
    }

    const key = req.ip;
    const now = Date.now();
    
    // Clean up old entries
    for (const [ip, data] of rateLimitStore.entries()) {
      if (now - data.windowStart > windowMs) {
        rateLimitStore.delete(ip);
      }
    }

    // Get or create rate limit data for this IP
    let ipData = rateLimitStore.get(key);
    
    if (!ipData || now - ipData.windowStart > windowMs) {
      ipData = {
        count: 0,
        windowStart: now
      };
    }

    ipData.count++;
    rateLimitStore.set(key, ipData);

    // Set rate limit headers
    res.set({
      'X-RateLimit-Limit': max,
      'X-RateLimit-Remaining': Math.max(0, max - ipData.count),
      'X-RateLimit-Reset': new Date(ipData.windowStart + windowMs)
    });

    if (ipData.count > max) {
      return res.status(429).json({
        success: false,
        error: message,
        retryAfter: Math.ceil((ipData.windowStart + windowMs - now) / 1000)
      });
    }

    next();
  };
};

// Common rate limiters
export const generalLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // 100 requests per 15 minutes
});

export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts per 15 minutes
  message: 'Too many authentication attempts, please try again later'
});

export const apiLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20 // 20 requests per minute
});

export default { createRateLimiter, generalLimiter, authLimiter, apiLimiter };