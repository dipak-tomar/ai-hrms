import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";

dotenv.config();

import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import { rateLimiter } from "./middleware/rateLimiter";

import authRoutes from "./routes/auth.routes";
import departmentRoutes from "./routes/department.routes";
import employeeRoutes from "./routes/employee.routes";
import attendanceRoutes from "./routes/attendance.routes";
import leaveRoutes from "./routes/leave.routes";
import payrollRoutes from "./routes/payroll.routes";
import performanceRoutes from "./routes/performance.routes";
import chatRoutes from "./routes/chat.routes";

const app = express();
const server = createServer(app);

// Create Socket.io server with error handling
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Handle Socket.io errors
io.on("error", (error) => {
  console.error("Socket.io error:", error);
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("New client connected");
  
  // Join user-specific room for targeted messages
  socket.on("join-user", (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their room`);
  });
  
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
  
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(rateLimiter);

// Static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/chat", chatRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3001;

// Add error handling for server
server.on("error", (error) => {
  console.error("Server error:", error);
});

// Start server with graceful error handling
try {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (error) {
  console.error("Failed to start server:", error);
  process.exit(1);
}

// Export for testing
export { app, io };