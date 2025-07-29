import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.mongo.js";
import { connectVectorDB } from "./db.vector.js";

dotenv.config();

const initializeApp = async () => {
  const app = express();
  
  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  
  // Database connections
  await connectDB();
  await connectVectorDB();
  
  return app;
};

export default initializeApp;
