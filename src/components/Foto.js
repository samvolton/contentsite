import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import PremiumModal from './PremiumModal';
import { AuthContext } from '../context/authContext';
import './Foto.css';

function Foto() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated, isPremium } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPhotos = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/media/foto?page=${currentPage}`);
      setPhotos(response.data.photos);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching photos:', error);
      setError('Failed to fetch photos. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos, isAuthenticated, isPremium]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePhotoClick = (photo) => {
    if (isAuthenticated && isPremium) {
      setModalContent(photo);
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
    <div className="foto" onContextMenu={disableContextMenu}>
      <h1>Fotoğraf Galerisi</h1>
      <div className="photo-grid">
        {photos.map(photo => (
          <div key={photo._id} className="photo-item" onClick={() => handlePhotoClick(photo)}>
            <img 
              src={`http://localhost:5000/files/${photo.filename}`} 
              alt={photo.title || 'Untitled'} 
              className={isAuthenticated && isPremium ? '' : 'blurred'}
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
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            disabled={page === currentPage}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Foto;
