import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Anasayfa.css';

function Anasayfa() {
  const [freeContent, setFreeContent] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === freeContent.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [freeContent]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/content/free');
      setFreeContent(response.data);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="anasayfa">
      <h1>Hoş Geldiniz</h1>
      <p>En son bedava içeriklerimize göz atın.</p>

      <div className="slider">
        {freeContent[currentIndex] && (
          <div className="slide">
            {freeContent[currentIndex].type === 'photo' ? (
              <img src={freeContent[currentIndex].url} alt={freeContent[currentIndex].title} />
            ) : (
              <video src={freeContent[currentIndex].url} autoPlay muted loop />
            )}
            <h3>{freeContent[currentIndex].title}</h3>
          </div>
        )}
      </div>

      <div className="navigation">
        <Link to="/bedava-icerikler" className="nav-button">Tüm Bedava İçerikler</Link>
        <Link to="/premium" className="nav-button">Premium İçerikler</Link>
      </div>
    </div>
  );
}

export default Anasayfa;