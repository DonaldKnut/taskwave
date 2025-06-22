import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import taskRoutes from "./routes/task.routes";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();

// ✅ CORS Configuration
const allowedOrigins = [
  "http://localhost:5173", // Vite Dev (local)
  "https://pollpulse-app.netlify.app", // Netlify (production)
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies and auth headers
  })
);

// ✅ Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Health Check Route
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// ✅ Main Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", taskRoutes); // You can rename to "/api/tasks" if more accurate

// ✅ Global Error Handler (should be last)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("🔥 Global Error:", err.message);
  res.status(401).json({
    success: false,
    message: err.message || "Something went wrong",
  });
});

export default app;
