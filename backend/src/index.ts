import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Load environment variables
dotenv.config();

// Import configurations and middleware
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { rateLimiter } from './middleware/rateLimiter';

// Import routes (will be created in next phases)
// import authRoutes from './routes/auth';
// import employeeRoutes from './routes/employees';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Basic Configuration
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS Configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// General Middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate Limiting
app.use('/api', rateLimiter);

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'AI HRMS Backend is running',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    version: '1.0.0'
  });
});

// API Routes
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to AI HRMS API',
    version: 'v1',
    documentation: '/api/docs',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      employees: '/api/employees',
      attendance: '/api/attendance',
      leaves: '/api/leaves',
      payroll: '/api/payroll',
      performance: '/api/performance',
      ai: '/api/ai'
    }
  });
});

// Routes (will be uncommented as we implement them)
// app.use('/api/auth', authRoutes);
// app.use('/api/employees', employeeRoutes);

// Socket.io Connection Handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Join user to their personal room for notifications
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Handle HR chatbot messages (will be implemented in Phase 5)
  socket.on('chatbot-message', (data) => {
    console.log('Chatbot message received:', data);
    // Will implement AI chatbot logic here
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server
server.listen(PORT, () => {
  console.log(`
🚀 AI HRMS Backend Server Started!
📍 Environment: ${NODE_ENV}
🌐 Server: http://localhost:${PORT}
📊 Health Check: http://localhost:${PORT}/health
📚 API Base: http://localhost:${PORT}/api
⚡ Socket.io: Enabled
🔒 Security: Helmet, CORS, Rate Limiting
📝 Logging: ${NODE_ENV === 'development' ? 'Development' : 'Production'} mode
  `);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

export { app, io }; 