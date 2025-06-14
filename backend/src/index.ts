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

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || "development";

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["\"self\""],
      styleSrc: ["\"self\"", "\"unsafe-inline\""],
      scriptSrc: ["\"self\""],
      imgSrc: ["\"self\"", "data:", "https:"],
    },
  },
}));

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

if (NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

app.use("/api", rateLimiter);

app.get("/", (req, res) => {
  res.redirect("/api");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "AI HRMS Backend is running",
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    version: "1.0.0"
  });
});

app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to AI HRMS API",
    version: "v1",
    documentation: "/api/docs",
    endpoints: {
      health: "/health",
      auth: "/api/auth",
      departments: "/api/departments",
      employees: "/api/employees",
      attendance: "/api/attendance",
      leaves: "/api/leaves",
      payroll: "/api/payroll",
      performance: "/api/performance",
      ai: "/api/ai"
    }
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/performance", performanceRoutes);

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  socket.on("join-user-room", (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  socket.on("chatbot-message", (data) => {
    console.log("Chatbot message received:", data);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.use(notFound);
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`
🚀 AI HRMS Backend Server Started!
📍 Environment: ${NODE_ENV}
🌐 Server: http://localhost:${PORT}
📊 Health Check: http://localhost:${PORT}/health
📚 API Base: http://localhost:${PORT}/api
⚡ Socket.io: Enabled
🔒 Security: Helmet, CORS, Rate Limiting
📝 Logging: ${NODE_ENV === "development" ? "Development" : "Production"} mode
  `);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated");
  });
});

export { app, io };