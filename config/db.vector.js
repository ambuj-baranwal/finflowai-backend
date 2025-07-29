import dotenv from "dotenv";

dotenv.config();

class VectorDBConnection {
  constructor() {
    this.isConnected = false;
    this.client = null;
  }

  async connect() {
    try {
      // For now, we'll support both Pinecone and Qdrant
      const vectorDBType = process.env.VECTOR_DB_TYPE || 'pinecone';
      
      if (vectorDBType === 'pinecone') {
        await this.connectPinecone();
      } else if (vectorDBType === 'qdrant') {
        await this.connectQdrant();
      } else {
        console.log('⚠️ No vector DB configured, skipping connection');
        return;
      }
      
      this.isConnected = true;
      console.log(`✅ Vector DB (${vectorDBType}) Connected`);
    } catch (err) {
      console.error('❌ Vector DB connection error:', err);
      // Don't exit process for vector DB errors - it's optional for basic functionality
    }
  }

  async connectPinecone() {
    // Placeholder for Pinecone connection
    // In production, use @pinecone-database/pinecone package
    if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_ENVIRONMENT) {
      throw new Error('Pinecone configuration missing: PINECONE_API_KEY, PINECONE_ENVIRONMENT required');
    }
    
    // Mock connection for now
    this.client = {
      type: 'pinecone',
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENVIRONMENT
    };
  }

  async connectQdrant() {
    // Placeholder for Qdrant connection
    // In production, use @qdrant/js-client-rest package
    if (!process.env.QDRANT_URL) {
      throw new Error('Qdrant configuration missing: QDRANT_URL required');
    }
    
    // Mock connection for now
    this.client = {
      type: 'qdrant',
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY
    };
  }

  getClient() {
    return this.client;
  }

  isVectorDBConnected() {
    return this.isConnected;
  }
}

const vectorDB = new VectorDBConnection();

export const connectVectorDB = async () => {
  await vectorDB.connect();
  return vectorDB;
};

export default vectorDB;