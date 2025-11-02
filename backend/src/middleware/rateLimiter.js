import rateLimit from 'express-rate-limit';

export const createRateLimiter = (options = {}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    standardHeaders: true, 
    legacyHeaders: false, 
    message: 'Too many requests from this IP, please try again later',
    ...options
  };
  return rateLimit(defaultOptions);
};


export const apiLimiter = createRateLimiter();


export const authLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, 
  max: 10, 
  message: 'Too many authentication attempts, please try again later'
});


export const searchLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, 
  max: 50 
});


export const createUserLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, 
  max: 5, 
  message: 'Too many accounts created from this IP, please try again later'
});
