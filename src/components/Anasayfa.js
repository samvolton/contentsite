import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Anasayfa.css';
import Modal from './Modal';

function Anasayfa() {
  const [content, setContent] = useState({ images: [], videos: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchContent();

    const slideInterval = setInterval(() => {
      setContent(prevContent => ({
        images: [...prevContent.images.slice(1), prevContent.images[0]],
        videos: [...prevContent.videos.slice(1), prevContent.videos[0]]
      }));
    }, 5000);

    return () => clearInterval(slideInterval);
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/media');
      const images = response.data.filter(item => item && item.contentType && item.contentType.startsWith('image'));
      const videos = response.data.filter(item => item && item.contentType && item.contentType.startsWith('video'));
      setContent({ images, videos });
    } catch (error) {
      console.error('Error fetching content:', error);
      setError('Failed to fetch content. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleContentClick = (item) => {
    if (item.premium) {
      navigate('/premium');
    } else {
      setModalContent(item);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="anasayfa">
      <h1>Hoş Geldiniz</h1>
      <p>En son içeriklerimize göz atın.</p>

      <section className="content-section">
        <h2>Fotoğraflar ({content.images.length})</h2>
        <div className="content-slider">
          {content.images.map((item) => (
            <div key={item._id} className="content-item" onClick={() => handleContentClick(item)}>
              <img
                src={`http://localhost:5000/files/${item.filename}`}
                alt={item.filename}
                className={item.premium ? 'blurred' : ''}
              />
              {item.premium && <span className="premium-badge">Premium</span>}
            </div>
          ))}
        </div>
      </section>

      <section className="content-section">
        <h2>Videolar ({content.videos.length})</h2>
        <div className="content-slider">
          {content.videos.map((item) => (
            <div key={item._id} className="content-item" onClick={() => handleContentClick(item)}>
              <video
                src={`http://localhost:5000/files/${item.filename}`}
                className={item.premium ? 'blurred' : ''}
                controls
              />
              {item.premium && <span className="premium-badge">Premium</span>}
            </div>
          ))}
        </div>
      </section>

      <div className="navigation">
        <Link to="/bedava-icerikler" className="nav-button">Tüm Bedava İçerikler</Link>
        <Link to="/premium" className="nav-button">Premium İçerikler</Link>
      </div>

      {isModalOpen && <Modal content={modalContent} onClose={closeModal} />}
    </div>
  );
}

export default Anasayfa;
