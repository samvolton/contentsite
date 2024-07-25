import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Foto.css';

function Foto() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/content/photo');
      setPhotos(response.data);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="foto">
      <h1>Fotoğraf Galerisi</h1>
      <div className="photo-grid">
        {photos.map(photo => (
          <div key={photo._id} className="photo-item">
            <img src={photo.thumbnailUrl} alt={photo.title} className={photo.isPremium ? 'blurred' : ''} />
            <div className="photo-overlay">
              <h3>{photo.title}</h3>
              {photo.isPremium && (
                <Link to="/premium" className="premium-link">Premium İçerik</Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Foto;