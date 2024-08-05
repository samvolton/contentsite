import React, { useState } from 'react';
import Chat from './Chat';
import './ChatBar.css';

const ChatBar = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="chat-bar">
      {isChatOpen ? (
        <Chat isOpen={isChatOpen} onClose={toggleChat} />
      ) : (
        <button className="chat-button" onClick={toggleChat}>
          Chat with Support
        </button>
      )}
    </div>
  );
};

export default ChatBar;