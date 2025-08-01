import React, { createContext, useState, useEffect, useContext } from 'react';
import chatService from '../services/chatService';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

const ChatContext = createContext();

export const useChat = () => {
  return useContext(ChatContext);
};

export const ChatProvider = ({ children }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotification();

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      chatService.getSessions()
        .then(res => {
          setSessions(res.data.sessions);
        })
        .catch(err => {
          console.error("Failed to fetch chat sessions:", err);
          addNotification('Could not load chat history.', 'error');
        })
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, addNotification]);

  const createNewSession = async (title) => {
    try {
      const res = await chatService.createSession(title);
      const newSession = res.data.session;
      setSessions(prev => [newSession, ...prev]);
      addNotification('New chat created!');
      return newSession;
    } catch (error) {
      console.error("Failed to create session:", error);
      addNotification('Could not create new chat.', 'error');
      throw error;
    }
  };

  const value = {
    sessions,
    loadingSessions: loading,
    createNewSession,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};