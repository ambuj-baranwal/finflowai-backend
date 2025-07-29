# FinFlow AI Backend

A comprehensive Node.js backend for the FinFlow AI application with authentication, chat management, and document processing capabilities.

## 🚀 Features

- **Authentication System**: JWT-based auth with support for email/password and OAuth providers
- **Chat Management**: Create and manage chat sessions with message history
- **Document Processing**: Upload, manage, and process documents with metadata
- **Vector Database Integration**: Ready for Pinecone/Qdrant integration
- **Rate Limiting**: Built-in API rate limiting for security
- **Error Handling**: Comprehensive error handling middleware
- **Input Validation**: Robust input validation and sanitization

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB instance
- (Optional) Vector database (Pinecone or Qdrant)

## 🛠️ Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd finflowai-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start the server**
```bash
npm start
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user  
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/oauth` - OAuth callback

### Chat Management
- `GET /api/chat/sessions` - Get chat sessions
- `POST /api/chat/sessions` - Create chat session
- `GET /api/chat/sessions/:id` - Get specific session
- `PUT /api/chat/sessions/:id` - Update session
- `DELETE /api/chat/sessions/:id` - Delete session
- `GET /api/chat/sessions/:id/messages` - Get messages
- `POST /api/chat/sessions/:id/messages` - Add message

### Document Management
- `GET /api/documents` - Get documents
- `POST /api/documents` - Upload document
- `GET /api/documents/:id` - Get specific document
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document
- `GET /api/documents/stats` - Get statistics

## 🔧 Configuration

### Required Environment Variables

```env
MONGO_URI=mongodb://localhost:27017/finflowai
JWT_SECRET=your_secure_secret_key
PORT=5000
```

### Optional Environment Variables

```env
PYTHON_SERVICE_URL=http://localhost:8000
VECTOR_DB_TYPE=pinecone
PINECONE_API_KEY=your_api_key
QDRANT_URL=http://localhost:6333
```

## 🏗️ Architecture

- **Models**: Mongoose schemas for MongoDB
- **Controllers**: Request handlers with validation
- **Services**: Business logic layer  
- **Routes**: API endpoint definitions
- **Middleware**: Authentication, error handling, rate limiting
- **Utils**: Helper functions and validators

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Error handling without data leaks

## 🧪 Testing

The backend structure is complete and all components can be imported without errors. MongoDB connection is required for full functionality.

## 📝 Response Format

All API responses follow this consistent format:

```json
{
  "success": boolean,
  "data": any,
  "error": string
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.