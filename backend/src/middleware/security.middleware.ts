import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { env } from '../config/env.validation';

// Content Security Policy configuration
export const cspMiddleware = helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    fontSrc: ["'self'", 'https://fonts.gstatic.com'],
    imgSrc: ["'self'", 'data:', 'https:'],
    scriptSrc: ["'self'"],
    connectSrc: ["'self'", env.FRONTEND_URL],
    frameSrc: ["'none'"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: env.NODE_ENV === 'production' ? [] : null,
  },
});

// Rate limiting configuration
export const createRateLimiter = (
  windowMs: number = env.RATE_LIMIT_WINDOW_MS,
  max: number = env.RATE_LIMIT_MAX_REQUESTS,
  message: string = 'Too many requests from this IP, please try again later.'
) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: message,
      retryAfter: Math.ceil(windowMs / 1000),
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Use a custom key generator for more sophisticated rate limiting
    keyGenerator: (req: Request) => {
      return req.ip || req.socket.remoteAddress || 'unknown';
    },
    // Custom handler for rate limit exceeded
    handler: (req: Request, res: Response) => {
      res.status(429).json({
        error: 'Too many requests',
        message,
        retryAfter: Math.ceil(windowMs / 1000),
      });
    },
  });
};

// Strict rate limiter for auth endpoints
export const authRateLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts
  'Too many authentication attempts, please try again later.'
);

// API rate limiter
export const apiRateLimiter = createRateLimiter();

// Security headers middleware
export const securityHeaders = (req: Request, res: Response, next: NextFunction): void => {
  // Remove server signature
  res.removeHeader('X-Powered-By');
  
  // Add security headers
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // HSTS for production
  if (env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  next();
};

// Request sanitization middleware
export const sanitizeRequest = (req: Request, res: Response, next: NextFunction): void => {
  // Remove null bytes from request body
  if (req.body && typeof req.body === 'object') {
    req.body = JSON.parse(JSON.stringify(req.body).replace(/\0/g, ''));
  }
  
  // Remove null bytes from query parameters
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = (req.query[key] as string).replace(/\0/g, '');
      }
    });
  }
  
  next();
};

// File upload security middleware
export const fileUploadSecurity = (req: Request, res: Response, next: NextFunction): void => {
  if (req.file || req.files) {
    const allowedTypes = env.ALLOWED_FILE_TYPES.split(',');
    
    const validateFile = (file: Express.Multer.File): boolean => {
      // Check file size
      if (file.size > env.MAX_FILE_SIZE) {
        return false;
      }
      
      // Check MIME type
      if (!allowedTypes.includes(file.mimetype)) {
        return false;
      }
      
      // Additional security checks can be added here
      // e.g., file content validation, virus scanning
      
      return true;
    };
    
    if (req.file && !validateFile(req.file)) {
      return res.status(400).json({
        error: 'Invalid file',
        message: 'File type not allowed or file too large',
      });
    }
    
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        if (!validateFile(file)) {
          return res.status(400).json({
            error: 'Invalid file',
            message: 'One or more files are invalid',
          });
        }
      }
    }
  }
  
  next();
};