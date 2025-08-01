import api from './api';

const getSessions = () => {
  return api.get('/chat/sessions');
};

const createSession = (title) => {
  return api.post('/chat/sessions', { title });
};

const getMessages = (sessionId) => {
  return api.get(`/chat/sessions/${sessionId}/messages`);
};

const addMessage = (sessionId, role, content) => {
  return api.post(`/chat/sessions/${sessionId}/messages`, { role, content });
};

// New function to get AI response
// In a real app, this would hit an endpoint that triggers the LLM
const getAIResponse = (sessionId, message) => {
  console.log('Getting AI response for:', message);
  // This is a mocked call. The backend currently doesn't have this endpoint.
  // We are simulating the call and returning a promise with a mock response.
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        data: {
          message: {
            chatSessionId: sessionId,
            role: 'assistant',
            content: `This is a mock AI response to: "${message}"`,
            _id: Date.now()
          }
        }
      });
    }, 1500); // Simulate network and AI processing time
  });
};


const chatService = {
  getSessions,
  createSession,
  getMessages,
  addMessage,
  getAIResponse, // Add new function
};

export default chatService;