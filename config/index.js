import express, { json } from "express";
import dotenv from "dotenv";
import connectDB from "./db.mongo";

dotenv.config()
const app = express()
app.use(express.json())
connectDB();



