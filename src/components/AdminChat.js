import React, { useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import api from '../services/api/axios';
import AuthContext from '../services/context/authContext';
import './Chat.css';

const AdminChat = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const { user } = useContext(AuthContext);
  const [flaggedMessages, setFlaggedMessages] = useState([]);
  const [attachment, setAttachment] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.emit('join', user._id);

    newSocket.on('newMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => newSocket.close();
  }, [user._id]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      const fetchMessages = async () => {
        const response = await api.get(`/chat/${selectedUser._id}`);
        setMessages(response.data);
      };
      fetchMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    const fetchFlaggedMessages = async () => {
      const response = await api.get('/admin/flagged-messages');
      setFlaggedMessages(response.data);
    };
    fetchFlaggedMessages();
  }, []);

  const sendMessage = async () => {
    if ((newMessage.trim() || attachment) && selectedUser) {
      const formData = new FormData();
      formData.append('sender', user._id);
      formData.append('receiver', selectedUser._id);
      formData.append('message', newMessage);
      if (attachment) {
        formData.append('attachment', attachment);
      }

      const response = await api.post('/chat', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      socket.emit('sendMessage', response.data);
      setNewMessage('');
      setAttachment(null);
    }
  };

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  const moderateMessage = async (messageId, action) => {
    await api.post(`/admin/moderate-message/${messageId}`, { action });
    setFlaggedMessages(flaggedMessages.filter(msg => msg._id !== messageId));
  };

  const renderMessage = (msg) => (
    <div className={`message ${msg.sender === user._id ? 'sent' : 'received'}`}>
      <p>{msg.message}</p>
      {msg.attachment && (
        <div className="attachment">
          {msg.attachmentType === 'image' && <img src={msg.attachment} alt="attachment" />}
          {msg.attachmentType === 'video' && <video src={msg.attachment} controls />}
          {msg.attachmentType === 'file' && <a href={msg.attachment} download>Download File</a>}
        </div>
      )}
    </div>
  );

  return (
    <div className="admin-chat-container">
      <div className="user-list">
        <h3>Users</h3>
        {users.map((u) => (
          <div key={u._id} onClick={() => setSelectedUser(u)} className="user-item">
            {u.email}
          </div>
        ))}
      </div>
      <div className="chat-container">
        <h3>Chat with {selectedUser ? selectedUser.email : 'Select a user'}</h3>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index}>{renderMessage(msg)}</div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <input
            type="file"
            onChange={handleFileChange}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
      <div className="flagged-messages">
        <h3>Flagged Messages</h3>
        {flaggedMessages.map((msg) => (
          <div key={msg._id} className="flagged-message">
            {renderMessage(msg)}
            <div className="moderation-actions">
              <button onClick={() => moderateMessage(msg._id, 'approve')}>Approve</button>
              <button onClick={() => moderateMessage(msg._id, 'delete')}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminChat;