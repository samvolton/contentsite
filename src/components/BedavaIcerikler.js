import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal'; // Import the Modal component
import './BedavaIcerikler.css';

function BedavaIcerikler() {
  const [content, setContent] = useState({ images: [], videos: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/media');
      const images = response.data.filter(item => 
        item && item.contentType && item.contentType.startsWith('image') && !item.premium
      );
      const videos = response.data.filter(item => 
        item && item.contentType && item.contentType.startsWith('video') && !item.premium
      );
      setContent({ images, videos });
    } catch (error) {
      console.error('Error fetching content:', error);
      setError('Failed to fetch content. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleContentClick = (item) => {
    setModalContent(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="bedava-icerikler">
      <h1>Bedava İçerikler</h1>
      
      <section className="free-photos">
        <h2>Fotoğraflar ({content.images.length})</h2>
        <div className="content-grid">
          {content.images.map((item) => (
            <div key={item._id} className="content-item" onClick={() => handleContentClick(item)}>
              <img src={`http://localhost:5000/files/${item.filename}`} alt={item.filename} />
            </div>
          ))}
        </div>
      </section>

      <section className="free-videos">
        <h2>Videolar ({content.videos.length})</h2>
        <div className="content-grid">
          {content.videos.map((item) => (
            <div key={item._id} className="content-item" onClick={() => handleContentClick(item)}>
              <video src={`http://localhost:5000/files/${item.filename}`} controls></video>
            </div>
          ))}
        </div>
      </section>

      {isModalOpen && <Modal content={modalContent} onClose={closeModal} />}
    </div>
  );
}

export default BedavaIcerikler;
