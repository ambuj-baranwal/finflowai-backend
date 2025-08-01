import React, { useState, useEffect, useRef } from 'react';
import ChatInput from './ChatInput';
import chatService from '../services/chatService';
import './ChatView.css';

const ChatView = ({ activeChatId }) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeChatId) {
      chatService.getMessages(activeChatId).then(res => {
        setMessages(res.data.messages);
      }).catch(err => {
        console.error("Failed to fetch messages", err);
        setMessages([]);
      });
    } else {
      setMessages([]);
    }
  }, [activeChatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (content) => {
    if (!activeChatId) return;

    const userMessage = { role: 'user', content, _id: `temp-${Date.now()}` };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Save user message to the backend
      const savedUserMessageRes = await chatService.addMessage(activeChatId, 'user', content);
      
      // Update the temporary user message with the one from the server
      setMessages(prev => prev.map(m => m._id === userMessage._id ? savedUserMessageRes.data.message : m));

      setIsTyping(true);

      // Get AI response
      const aiResponseRes = await chatService.getAIResponse(activeChatId, content);
      
      // Save AI response to the backend
      const savedAIResponseRes = await chatService.addMessage(
        activeChatId, 
        'assistant', 
        aiResponseRes.data.message.content
      );

      setMessages(prev => [...prev, savedAIResponseRes.data.message]);

    } catch (error) {
      console.error("Failed to send message or get AI response:", error);
      // Optionally show an error message in the UI
      const errorMessage = { role: 'assistant', content: 'Sorry, I encountered an error.', _id: `err-${Date.now()}` };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-view">
      <div className="chat-header">
        {/* Header content like theme toggle can go here */}
      </div>
      <div className="chat-messages">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg._id} className={`message ${msg.role}`}>
              <p>{msg.content}</p>
            </div>
          ))
        ) : (
          <div className="welcome-message">
            <h2>What's on your mind today?</h2>
          </div>
        )}
        {isTyping && (
          <div className="message assistant">
            <div className="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </div>
  );
};

export default ChatView;