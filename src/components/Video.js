import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import PremiumModal from './PremiumModal';
import { AuthContext } from '../context/authContext';
import './Video.css';

function Video() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated, isPremium } = useContext(AuthContext);

  useEffect(() => {
    fetchVideos();
  }, [isAuthenticated, isPremium]);


  const fetchVideos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/media');
      const videos = response.data.filter(item => 
        item && 
        item.contentType && 
        typeof item.contentType === 'string' && 
        item.contentType.startsWith('video')
      );
      setVideos(videos);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError('Failed to fetch videos. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (video) => {
    if (isAuthenticated && isPremium) {
      setModalContent(video);
    } else {
      setModalContent({ type: 'premium' }); // Provide a type to handle premium modal content
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const disableContextMenu = (e) => {
    e.preventDefault();
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="video" onContextMenu={disableContextMenu}>
      <h1>Video Galerisi</h1>
      <div className="video-grid">
        {videos.map(video => (
          <div key={video._id} className="video-item" onClick={() => handleVideoClick(video)}>
            <video 
              src={`http://localhost:5000/files/${video.filename}`} 
              className={isAuthenticated && isPremium ? '' : 'blurred'}
              controls
            />
            {(!isAuthenticated || !isPremium) && <span className="premium-badge">Premium</span>}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <PremiumModal 
          content={modalContent} 
          onClose={closeModal} 
          isAuthenticated={isAuthenticated} 
          isPremium={isPremium} 
        />
      )}
    </div>
  );
}

export default Video;
