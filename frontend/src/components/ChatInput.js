import React, { useState } from 'react';
import './ChatInput.css';

const ChatInput = ({ onSendMessage, disabled }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="chat-input-container">
      <form onSubmit={handleSubmit} className="chat-input-form">
        <div className="input-actions">
          <button type="button" className="action-btn" disabled={disabled}>📎</button>
          <button type="button" className="action-btn" disabled={disabled}>🔗</button>
          <button type="button" className="action-btn" disabled={disabled}>🌐</button>
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={disabled ? "Assistant is typing..." : "What do you want to know?"}
          className="chat-input"
          disabled={disabled}
        />
        <div className="input-actions-right">
          <button type="button" className="action-btn" disabled={disabled}>🎤</button>
          <button type="submit" className="action-btn send-btn" disabled={disabled}>➤</button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;