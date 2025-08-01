import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatView from '../components/ChatView';
import './ChatPage.css';

const ChatPage = () => {
  const [activeChatId, setActiveChatId] = useState(null);

  return (
    <div className="chat-page-container">
      <Sidebar setActiveChatId={setActiveChatId} />
      <ChatView activeChatId={activeChatId} />
    </div>
  );
};

export default ChatPage;