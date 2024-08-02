import React, { useState, useEffect, useContext } from 'react';
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

  useEffect(() => {
    fetchPhotos();
  }, [isAuthenticated, isPremium]);

  console.log('Auth status:', isAuthenticated, 'Premium status:', isPremium);
  
  const fetchPhotos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/media');
      const photos = response.data.filter(item => 
        item && 
        item.contentType && 
        typeof item.contentType === 'string' && 
        item.contentType.startsWith('image')
      );
      setPhotos(photos);
    } catch (error) {
      console.error('Error fetching photos:', error);
      setError('Failed to fetch photos. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoClick = (photo) => {
    if (isAuthenticated && isPremium) {
      setModalContent(photo);
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
    </div>
  );
}

export default Foto;
