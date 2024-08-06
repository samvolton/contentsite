import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import PremiumModal from './PremiumModal';
import { AuthContext } from '../context/authContext';
import './Video.css';
import './Pagination.css';

function Video() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated, isPremium } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchVideos = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/media/video?page=${currentPage}`);
      setVideos(response.data.videos);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError('Failed to fetch videos. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos, isAuthenticated, isPremium]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleVideoClick = (video) => {
    if (isAuthenticated && isPremium) {
      setModalContent(video);
    } else {
      setModalContent({ type: 'premium' });
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

      <div className="pagination">
        <button 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Previous
        </button>
        {[...Array(totalPages).keys()].map((number) => (
          <button
            key={number + 1}
            onClick={() => handlePageChange(number + 1)}
            className={`pagination-button ${currentPage === number + 1 ? 'active' : ''}`}
          >
            {number + 1}
          </button>
        ))}
        <button 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Video;