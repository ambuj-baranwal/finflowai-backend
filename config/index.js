import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.mongo.js";
import { connectVectorDB } from "./db.vector.js";
import { errorHandler, notFound } from "../middleware/errorHandler.js";
import { generalLimiter } from "../middleware/rateLimiter.js";

// Import routes
import authRoutes from "../routes/authRoutes.js";
import chatRoutes from "../routes/chatRoutes.js";
import documentRoutes from "../routes/documentRoutes.js";

dotenv.config();

const initializeApp = async () => {
  const app = express();
  
  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  
  // Rate limiting
  app.use(generalLimiter);
  
  // Database connections
  await connectDB();
  await connectVectorDB();
  
  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/api/documents', documentRoutes);
  
  // Error handling middleware (must be last)
  app.use(notFound);
  app.use(errorHandler);
  
  return app;
};

export default initializeApp;
