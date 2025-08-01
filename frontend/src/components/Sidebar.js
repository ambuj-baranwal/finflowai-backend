import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext'; // Use ChatContext
import AccountDropdown from './AccountDropdown'; // Import new component
import './Sidebar.css';

const Sidebar = ({ setActiveChatId }) => {
  const [historyOpen, setHistoryOpen] = useState(true);
  const { sessions, loadingSessions, createNewSession } = useChat(); // Get sessions from context
  const navigate = useNavigate();

  const handleNewChat = async () => {
    const title = prompt("Enter new chat title:");
    if (title) {
      const newSession = await createNewSession(title);
      if (newSession) {
        if (setActiveChatId) {
          setActiveChatId(newSession._id);
        }
        navigate('/');
      }
    }
  };

  const selectChat = (sessionId) => {
    if (setActiveChatId) {
      setActiveChatId(sessionId);
    }
    navigate('/');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1>ChatBot</h1>
        </Link>
      </div>
      <div className="sidebar-menu">
        <button className="menu-item" onClick={handleNewChat}>
          <span className="icon">+</span> New Chat
        </button>
        <Link to="/storage" className="menu-item">
          <span className="icon">🗄️</span> Storage
        </Link>
        <Link to="/search" className="menu-item">
          <span className="icon">🔍</span> Search
        </Link>
        <Link to="/mindmap" className="menu-item">
          <span className="icon">🧠</span> Mind Map
        </Link>
        <Link to="/flowchart" className="menu-item">
          <span className="icon">📊</span> Flowchart
        </Link>
        <div className="history-section">
          <button className="menu-item" onClick={() => setHistoryOpen(!historyOpen)}>
            <span className="icon">🕓</span> History
            <span className={`arrow ${historyOpen ? 'open' : ''}`}>▼</span>
          </button>
          {historyOpen && (
            <div className="history-list">
              {loadingSessions ? (
                <p className="history-item">Loading...</p>
              ) : (
                sessions.map(session => (
                  <div 
                    key={session._id} 
                    className="history-item"
                    onClick={() => selectChat(session._id)}
                  >
                    {session.title}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      <div className="sidebar-footer">
        <AccountDropdown />
      </div>
    </div>
  );
};

export default Sidebar;