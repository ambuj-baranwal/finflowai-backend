import dotenv from "dotenv";
import initializeApp from "./config/index.js";

dotenv.config();

const startServer = async () => {
  try {
    const app = await initializeApp();
    
    // Basic health check route
    app.get('/', (req, res) => {
      res.json({ 
        success: true, 
        message: `Welcome to ${process.env.APP_NAME || 'FinFlow AI Backend'}`,
        status: 'Server is running'
      });
    });
    
    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ 
        success: true, 
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
      });
    });
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
