import React, { useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import api from '../api/axios';
import { AuthContext } from '../context/authContext';
import './Chat.css';

const Chat = ({ isOpen, onClose }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const { user, isAuthenticated, loading } = useContext(AuthContext);

  const [adminId, setAdminId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.emit('join', user._id);

    newSocket.on('newMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Fetch admin ID when component mounts
    const fetchAdminId = async () => {
      try {
        console.log('Fetching admin ID...');
        const response = await api.get('/auth/admin-id');
        console.log('Admin ID response:', response.data);
        setAdminId(response.data.adminId);
      } catch (error) {
        console.error('Error fetching admin ID:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
          console.error('Error status:', error.response.status);
        }
      }
    };
    fetchAdminId();

    return () => newSocket.close();
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!isAuthenticated || !user || !adminId) return;

    const fetchMessages = async () => {
      try {
        const response = await api.get(`/chat/${adminId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
  }, [isAuthenticated, user, adminId]);

  const sendMessage = async () => {
    if (!isAuthenticated || !user || !adminId) {
      console.error('User is not authenticated or admin ID is not available');
      return;
    }
  
    if (newMessage.trim() || attachment) {
      const formData = new FormData();
      formData.append('sender', user._id);
      formData.append('receiver', adminId);
      formData.append('message', newMessage);
      if (attachment) {
        formData.append('attachment', attachment);
      }
  
      console.log('Sending message:', { sender: user._id, receiver: adminId, message: newMessage, attachment });
  
      try {
        const response = await api.post('/chat', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Message sent successfully:', response.data);
        socket.emit('sendMessage', response.data);
        setMessages((prevMessages) => [...prevMessages, response.data]);
        setNewMessage('');
        setAttachment(null);
      } catch (error) {
        console.error('Error sending message:', error);
        if (error.response) {
          console.error('Server responded with:', error.response.data);
        }
      }
    }
  };

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  if (loading) return <div>Loading...</div>;
  if (!isOpen || !isAuthenticated || !user || !adminId) return null;

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>Support Chat</h3>
        <button onClick={onClose}>Close</button>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === user._id ? 'sent' : 'received'}`}>
            <p>{msg.message}</p>
            {msg.attachment && (
              <div className="attachment">
                {msg.attachmentType === 'image' ? (
                  <img src={`http://localhost:5000/${msg.attachment}`} alt="attachment" />
                ) : (
                  <a href={`http://localhost:5000/${msg.attachment}`} target="_blank" rel="noopener noreferrer">
                    View Attachment
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <input type="file" onChange={handleFileChange} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;